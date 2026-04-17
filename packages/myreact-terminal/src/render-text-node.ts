import { type DOMElement, type DOMNode, isNodeSelectable } from "./dom.js";
import getMaxWidth from "./get-max-width.js";
import { measureStyledChars, splitStyledCharsByNewline, toStyledCharacters } from "./measure-text.js";
import { applySelectionToStyledChars } from "./selection.js";
import squashTextNodes from "./squash-text-nodes.js";
import { StyledLine } from "./styled-line.js";
import { wrapOrTruncateStyledChars } from "./text-wrap.js";

import type Output from "./output.js";
import type { OutputTransformer } from "./render-node-to-output.js";

export const applyPaddingToStyledChars = (node: DOMElement, lines: StyledLine[]): StyledLine[] => {
  const yogaNode = node.childNodes[0]?.yogaNode;

  if (yogaNode) {
    const offsetX = Math.round(yogaNode.getComputedLeft());
    const offsetY = Math.round(yogaNode.getComputedTop());

    if (offsetX > 0 || offsetY > 0) {
      const paddedLines: StyledLine[] = [];
      const paddingLeft = offsetX > 0 ? StyledLine.empty(offsetX) : undefined;

      for (const line of lines) {
        paddedLines.push(paddingLeft ? paddingLeft.combine(line) : line);
      }

      lines = paddedLines;

      for (let i = 0; i < offsetY; i++) {
        lines.unshift(new StyledLine());
      }
    }
  }

  return lines;
};

export const calculateWrappedCursorPosition = (
  lines: StyledLine[],
  _styledChars: StyledLine,
  targetOffset: number
): { cursorLineIndex: number; relativeCursorPosition: number } => {
  let cursorLineIndex = lines.length - 1;
  let relativeCursorPosition = targetOffset;

  let sourceIndex = 0;

  for (const [i, line] of lines.entries()) {
    // If the line is empty (e.g., from consecutive newlines), it consumes a newline
    if (line.length === 0) {
      if (targetOffset === sourceIndex) {
        cursorLineIndex = i;
        relativeCursorPosition = 0;
        break;
      }

      sourceIndex++; // Consume the newline
      continue;
    }

    // Advance sourceIndex over dropped characters (like \n or space)
    while (sourceIndex < _styledChars.length && _styledChars.getValue(sourceIndex) !== line.getValue(0)) {
      if (targetOffset === sourceIndex) {
        // Target is on a dropped character BEFORE this line
        // We return the END of the previous line (or start of this line if i=0)
        if (i > 0) {
          cursorLineIndex = i - 1;
          relativeCursorPosition = lines[i - 1]!.length;
        } else {
          cursorLineIndex = 0;
          relativeCursorPosition = 0;
        }

        return { cursorLineIndex, relativeCursorPosition };
      }

      sourceIndex++;
    }

    const lineStartOffset = sourceIndex;
    sourceIndex += line.length; // Advance past the line content
    const lineEndOffset = sourceIndex;

    if (targetOffset >= lineStartOffset && targetOffset <= lineEndOffset) {
      cursorLineIndex = i;
      relativeCursorPosition = targetOffset - lineStartOffset;
      break;
    } else if (targetOffset > lineEndOffset && i === lines.length - 1) {
      cursorLineIndex = i;
      relativeCursorPosition = line.length;
    }
  }

  return { cursorLineIndex, relativeCursorPosition };
};

export function handleTextNode(
  node: DOMElement,
  output: Output,
  options: {
    x: number;
    y: number;
    newTransformers: OutputTransformer[];
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
) {
  const { x, y, newTransformers, selectionMap, selectionStyle } = options;
  const text = squashTextNodes(node);
  let styledChars = toStyledCharacters(text);
  let selectionState:
    | {
        range: { start: number; end: number };
        currentOffset: number;
      }
    | undefined;

  const selectionRange = selectionMap?.get(node);

  if (selectionRange) {
    selectionState = {
      range: selectionRange,
      currentOffset: 0,
    };
  }

  if (selectionState) {
    styledChars = applySelectionToStyledChars(styledChars, selectionState, selectionStyle);
  }

  if (styledChars.length > 0 || node.internal_terminalCursorFocus) {
    let lines: StyledLine[] = [];
    let cursorLineIndex = 0;
    let relativeCursorPosition = node.internal_terminalCursorPosition ?? 0;

    if (styledChars.length > 0) {
      const { width: currentWidth } = measureStyledChars(styledChars);
      const maxWidth = getMaxWidth(node.yogaNode!);

      lines =
        currentWidth > maxWidth ? wrapOrTruncateStyledChars(styledChars, maxWidth, node.style.textWrap ?? "wrap") : splitStyledCharsByNewline(styledChars);

      if (node.internal_terminalCursorFocus && node.internal_terminalCursorPosition !== undefined) {
        ({ cursorLineIndex, relativeCursorPosition } = calculateWrappedCursorPosition(lines, styledChars, node.internal_terminalCursorPosition));
      }

      // Original code applied padding here.
      // It was done BEFORE calculateWrappedCursorPosition in original?
      // Wait, the original code did:
      // lines = applyPaddingToStyledChars(node, lines);
      // cursorLineIndex = lines.length - 1;
      // if (node.internal_terminalCursorFocus) { ... }
      // I moved it after, because mapping padding offsets is hard without objects.
      // But padding affects the visual cursor index!
      // If we pad, the cursor shifts. Let's do it after, but we need to shift the cursor position by the padding.
      const yogaNode = node.childNodes[0]?.yogaNode;
      const offsetX = Math.round(yogaNode?.getComputedLeft() ?? 0);
      const offsetY = Math.round(yogaNode?.getComputedTop() ?? 0);

      lines = applyPaddingToStyledChars(node, lines);

      if (node.internal_terminalCursorFocus && node.internal_terminalCursorPosition !== undefined) {
        cursorLineIndex += offsetY;
        relativeCursorPosition += offsetX;
      } else if (node.internal_terminalCursorFocus) {
        cursorLineIndex = lines.length - 1;
        // Default to end of the last line
        relativeCursorPosition = lines[cursorLineIndex]!.length;
      }
    } else {
      const yogaNode = node.childNodes[0]?.yogaNode;
      const offsetX = Math.round(yogaNode?.getComputedLeft() ?? 0);
      const offsetY = Math.round(yogaNode?.getComputedTop() ?? 0);

      const line = StyledLine.empty(offsetX);
      lines = [line];

      for (let i = 0; i < offsetY; i++) {
        lines.unshift(new StyledLine());
      }

      if (node.internal_terminalCursorFocus) {
        cursorLineIndex = offsetY;
        relativeCursorPosition = offsetX;
      }
    }

    for (const [index, line] of lines.entries()) {
      output.write(x, y + index, line, {
        transformers: newTransformers,
        lineIndex: index,
        isTerminalCursorFocused: node.internal_terminalCursorFocus && index === cursorLineIndex,
        terminalCursorPosition: relativeCursorPosition,
        isSelectable: isNodeSelectable(node),
      });
    }
  }
}
