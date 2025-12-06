/* eslint-disable max-lines */
import { type StyledChar } from "@alcalzone/ansi-tokenize";
import Yoga from "yoga-layout";

import colorize from "./colorize";
import { type DOMElement, type DOMNode } from "./dom";
import getMaxWidth from "./get-max-width";
import { getVerticalScrollbarBoundingBox, getHorizontalScrollbarBoundingBox, type ScrollbarBoundingBox } from "./measure-element";
import { measureStyledChars, splitStyledCharsByNewline, toStyledCharacters } from "./measure-text";
import renderBackground from "./render-background";
import renderBorder from "./render-border";
import squashTextNodes from "./squash-text-nodes";
import { wrapOrTruncateStyledChars } from "./text-wrap";

import type Output from "./output";

// If parent container is `<Box>`, text nodes will be treated as separate nodes in
// the tree and will have their own coordinates in the layout.
// To ensure text nodes are aligned correctly, take X and Y of the first text node
// and use it as offset for the rest of the nodes
// Only first node is taken into account, because other text nodes can't have margin or padding,
// so their coordinates will be relative to the first node anyway
const applyPaddingToStyledChars = (node: DOMElement, lines: StyledChar[][]): StyledChar[][] => {
  const yogaNode = node.childNodes[0]?.yogaNode;

  if (yogaNode) {
    const offsetX = yogaNode.getComputedLeft();
    const offsetY = yogaNode.getComputedTop();

    const space: StyledChar = {
      type: "char",
      value: " ",
      fullWidth: false,
      styles: [],
    };

    const paddingLeft = Array.from({ length: offsetX }).map(() => space);

    lines = lines.map((line) => [...paddingLeft, ...line]);

    const paddingTop: StyledChar[][] = Array.from({ length: offsetY }).map(() => []);
    lines.unshift(...paddingTop);
  }

  return lines;
};

export type OutputTransformer = (s: string, index: number) => string;

export const renderNodeToScreenReaderOutput = (
  node: DOMElement,
  options: {
    parentRole?: string;
    skipStaticElements?: boolean;
  } = {}
): string => {
  if (options.skipStaticElements && node.internal_static) {
    return "";
  }

  if (node.internal_sticky_alternate) {
    return "";
  }

  if (node.yogaNode?.getDisplay() === Yoga.DISPLAY_NONE) {
    return "";
  }

  let output = "";

  if (node.nodeName === "ink-text") {
    output = squashTextNodes(node);
  } else if (node.nodeName === "ink-box" || node.nodeName === "ink-root") {
    const separator = node.style.flexDirection === "row" || node.style.flexDirection === "row-reverse" ? " " : "\n";

    const childNodes =
      node.style.flexDirection === "row-reverse" || node.style.flexDirection === "column-reverse" ? [...node.childNodes].reverse() : [...node.childNodes];

    output = childNodes
      .map((childNode) => {
        const screenReaderOutput = renderNodeToScreenReaderOutput(childNode as DOMElement, {
          parentRole: node.internal_accessibility?.role,
          skipStaticElements: options.skipStaticElements,
        });
        return screenReaderOutput;
      })
      .filter(Boolean)
      .join(separator);
  }

  if (node.internal_accessibility) {
    const { role, state } = node.internal_accessibility;

    if (state) {
      const stateKeys = Object.keys(state) as Array<keyof typeof state>;
      const stateDescription = stateKeys.filter((key) => state[key]).join(", ");

      if (stateDescription) {
        output = `(${stateDescription}) ${output}`;
      }
    }

    if (role && role !== options.parentRole) {
      output = `${role}: ${output}`;
    }
  }

  return output;
};

// After nodes are laid out, render each to output object, which later gets rendered to terminal
const renderNodeToOutput = (
  node: DOMElement,
  output: Output,
  options: {
    offsetX?: number;
    offsetY?: number;
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
    nodeToSkip?: DOMElement;
    isStickyRender?: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (char: StyledChar) => StyledChar;
  }
) => {
  if (options.nodeToSkip === node) {
    return;
  }

  const { offsetX = 0, offsetY = 0, transformers = [], skipStaticElements, isStickyRender = false, selectionMap, selectionStyle } = options;

  if (skipStaticElements && node.internal_static) {
    return;
  }

  if (node.internal_sticky_alternate && !isStickyRender) {
    return;
  }

  const { yogaNode } = node;

  if (yogaNode) {
    if (yogaNode.getDisplay() === Yoga.DISPLAY_NONE) {
      return;
    }

    // Left and top positions in Yoga are relative to their parent node
    const x = offsetX + yogaNode.getComputedLeft();
    const y = offsetY + yogaNode.getComputedTop();

    const width = yogaNode.getComputedWidth();
    const height = yogaNode.getComputedHeight();
    const clip = output.getCurrentClip();

    if (clip) {
      const nodeLeft = x;
      const nodeRight = x + width;
      const nodeTop = y;
      const nodeBottom = y + height;

      const clipLeft = clip.x1 ?? -Infinity;
      const clipRight = clip.x2 ?? Infinity;
      const clipTop = clip.y1 ?? -Infinity;
      const clipBottom = clip.y2 ?? Infinity;

      const isVisible = nodeRight > clipLeft && nodeLeft < clipRight && nodeBottom > clipTop && nodeTop < clipBottom;

      if (!isVisible) {
        return;
      }
    }

    // Transformers are functions that transform final text output of each component
    // See Output class for logic that applies transformers
    let newTransformers = transformers;
    if (typeof node.internal_transform === "function") {
      newTransformers = [node.internal_transform, ...transformers];
    }

    if (node.nodeName === "ink-text") {
      let styledChars = toStyledCharacters(squashTextNodes(node));
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

      if (styledChars.length > 0) {
        let lines: StyledChar[][] = [];
        const { width: currentWidth } = measureStyledChars(styledChars);
        const maxWidth = getMaxWidth(yogaNode);

        if (currentWidth > maxWidth) {
          const textWrap = node.style.textWrap ?? "wrap";
          lines = wrapOrTruncateStyledChars(styledChars, maxWidth, textWrap);
        } else {
          lines = splitStyledCharsByNewline(styledChars);
        }

        lines = applyPaddingToStyledChars(node, lines);

        for (const [index, line] of lines.entries()) {
          output.write(x, y + index, line, {
            transformers: newTransformers,
            lineIndex: index,
          });
        }
      }

      return;
    }

    let clipped = false;
    let childrenOffsetY = y;
    let childrenOffsetX = x;
    let verticallyScrollable = false;
    let horizontallyScrollable = false;
    let activeStickyNode: DOMElement | undefined;
    let nextStickyNode: DOMElement | undefined;

    if (node.nodeName === "ink-box") {
      renderBackground(x, y, node, output);
      renderBorder(x, y, node, output);

      const overflow = node.style.overflow ?? "visible";
      const overflowX = node.style.overflowX ?? overflow;
      const overflowY = node.style.overflowY ?? overflow;

      verticallyScrollable = overflowY === "scroll";
      horizontallyScrollable = overflowX === "scroll";

      if (verticallyScrollable) {
        childrenOffsetY -= node.internal_scrollState?.scrollTop ?? 0;

        const stickyNodes = getStickyDescendants(node);

        if (stickyNodes.length > 0) {
          const scrollTop = (node.internal_scrollState?.scrollTop ?? 0) + yogaNode.getComputedBorder(Yoga.EDGE_TOP);
          let activeStickyNodeIndex = -1;

          for (const [index, stickyNode] of stickyNodes.entries()) {
            if (stickyNode.yogaNode) {
              const stickyNodeTop = getRelativeTop(stickyNode, node);
              if (stickyNodeTop < scrollTop) {
                const parent = stickyNode.parentNode!;
                if (parent?.yogaNode) {
                  const parentTop = getRelativeTop(parent, node);
                  const parentHeight = parent.yogaNode.getComputedHeight();
                  if (parentTop + parentHeight > scrollTop) {
                    activeStickyNode = stickyNode;
                    activeStickyNodeIndex = index;
                  }
                }
              }
            }
          }

          if (activeStickyNodeIndex !== -1 && activeStickyNodeIndex + 1 < stickyNodes.length) {
            nextStickyNode = stickyNodes[activeStickyNodeIndex + 1];
          }
        }
      }

      if (horizontallyScrollable) {
        childrenOffsetX -= node.internal_scrollState?.scrollLeft ?? 0;
      }

      const clipHorizontally = overflowX === "hidden" || overflowX === "scroll";
      const clipVertically = overflowY === "hidden" || overflowY === "scroll";

      if (clipHorizontally || clipVertically) {
        const x1 = clipHorizontally ? x + yogaNode.getComputedBorder(Yoga.EDGE_LEFT) : undefined;

        const x2 = clipHorizontally ? x + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT) : undefined;

        const y1 = clipVertically ? y + yogaNode.getComputedBorder(Yoga.EDGE_TOP) : undefined;

        const y2 = clipVertically ? y + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM) : undefined;

        output.clip({ x1, x2, y1, y2 });
        clipped = true;
      }
    }

    if (node.nodeName === "ink-root" || node.nodeName === "ink-box") {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode as DOMElement, output, {
          offsetX: childrenOffsetX,
          offsetY: childrenOffsetY,
          transformers: newTransformers,
          skipStaticElements,
          nodeToSkip: activeStickyNode,
          isStickyRender,
          selectionMap,
          selectionStyle,
        });
      }

      if (activeStickyNode?.yogaNode) {
        const alternateStickyNode = activeStickyNode.childNodes.find((childNode) => (childNode as DOMElement).internal_sticky_alternate) as
          | DOMElement
          | undefined;

        const nodeToRender = alternateStickyNode ?? activeStickyNode;
        const nodeToRenderYogaNode = nodeToRender.yogaNode;

        if (!nodeToRenderYogaNode) {
          return;
        }

        const stickyYogaNode = activeStickyNode.yogaNode;
        const borderTop = yogaNode.getComputedBorder(Yoga.EDGE_TOP);
        const scrollTop = node.internal_scrollState?.scrollTop ?? 0;

        const parent = activeStickyNode.parentNode!;
        const parentYogaNode = parent.yogaNode!;
        const parentTop = getRelativeTop(parent, node);
        const parentHeight = parentYogaNode.getComputedHeight();
        const parentBottom = parentTop + parentHeight;
        const stickyNodeHeight = nodeToRenderYogaNode.getComputedHeight();
        const maxStickyTop = y - scrollTop + parentBottom - stickyNodeHeight;

        const naturalStickyY = y - scrollTop + getRelativeTop(activeStickyNode, node);
        const stuckStickyY = y + borderTop;

        let finalStickyY = Math.min(Math.max(stuckStickyY, naturalStickyY), maxStickyTop);

        if (nextStickyNode?.yogaNode) {
          const nextStickyNodeTop = getRelativeTop(nextStickyNode, node);
          const nextStickyNodeTopInViewport = y - scrollTop + nextStickyNodeTop;
          if (nextStickyNodeTopInViewport < finalStickyY + stickyNodeHeight) {
            finalStickyY = nextStickyNodeTopInViewport - stickyNodeHeight;
          }
        }

        let offsetX: number;
        let offsetY: number;

        if (nodeToRender === alternateStickyNode) {
          const parentAbsoluteX = x + getRelativeLeft(parent, node);
          const stickyNodeAbsoluteX = parentAbsoluteX + stickyYogaNode.getComputedLeft();
          offsetX = stickyNodeAbsoluteX;
          offsetY = finalStickyY;
        } else {
          const parentAbsoluteX = x + getRelativeLeft(parent, node);
          offsetX = parentAbsoluteX;
          offsetY = finalStickyY - stickyYogaNode.getComputedTop();
        }

        renderNodeToOutput(nodeToRender, output, {
          offsetX,
          offsetY,
          transformers: newTransformers,
          skipStaticElements,
          isStickyRender: true,
          selectionMap,
          selectionStyle,
        });
      }

      if (clipped) {
        output.unclip();
      }

      if (node.nodeName === "ink-box") {
        if (verticallyScrollable) {
          renderVerticalScrollbar(node, x, y, output);
        }

        if (horizontallyScrollable) {
          renderHorizontalScrollbar(node, x, y, output);
        }
      }
    }
  }
};

function getStickyDescendants(node: DOMElement): DOMElement[] {
  const stickyDescendants: DOMElement[] = [];

  for (const child of node.childNodes) {
    if (child.nodeName === "#text") {
      continue;
    }

    const domChild = child;

    if (domChild.internal_sticky_alternate) {
      continue;
    }

    if (domChild.internal_sticky) {
      stickyDescendants.push(domChild);
    } else {
      const overflow = domChild.style.overflow ?? "visible";
      const overflowX = domChild.style.overflowX ?? overflow;
      const overflowY = domChild.style.overflowY ?? overflow;
      const isScrollable = overflowX === "scroll" || overflowY === "scroll";

      if (!isScrollable && domChild.childNodes) {
        stickyDescendants.push(...getStickyDescendants(domChild));
      }
    }
  }

  return stickyDescendants;
}

function getRelativeTop(node: DOMElement, ancestor: DOMElement): number {
  if (!node.yogaNode) {
    return 0;
  }

  let top = node.yogaNode.getComputedTop();
  let parent = node.parentNode;

  while (parent && parent !== ancestor) {
    if (parent.yogaNode) {
      top += parent.yogaNode.getComputedTop();

      if (parent.nodeName === "ink-box") {
        const overflow = parent.style.overflow ?? "visible";
        const overflowY = parent.style.overflowY ?? overflow;

        if (overflowY === "scroll") {
          top -= parent.internal_scrollState?.scrollTop ?? 0;
        }
      }
    }

    parent = parent.parentNode;
  }

  return top;
}

function getRelativeLeft(node: DOMElement, ancestor: DOMElement): number {
  if (!node.yogaNode) {
    return 0;
  }

  let left = node.yogaNode.getComputedLeft();
  let parent = node.parentNode;

  while (parent && parent !== ancestor) {
    if (parent.yogaNode) {
      left += parent.yogaNode.getComputedLeft();

      if (parent.nodeName === "ink-box") {
        const overflow = parent.style.overflow ?? "visible";
        const overflowX = parent.style.overflowX ?? overflow;

        if (overflowX === "scroll") {
          left -= parent.internal_scrollState?.scrollLeft ?? 0;
        }
      }
    }

    parent = parent.parentNode;
  }

  return left;
}

function renderScrollbar(node: DOMElement, output: Output, layout: ScrollbarBoundingBox, axis: "vertical" | "horizontal") {
  const { thumb } = layout;
  const thumbColor = node.style.scrollbarThumbColor;

  for (let index = thumb.start; index < thumb.end; index++) {
    const cellStartHalf = index * 2;
    const cellEndHalf = (index + 1) * 2;

    const start = Math.max(cellStartHalf, thumb.startHalf);
    const end = Math.min(cellEndHalf, thumb.endHalf);

    const fill = end - start;

    if (fill > 0) {
      const char =
        axis === "vertical"
          ? fill === 2
            ? "█"
            : // Fill === 1
              start % 2 === 0
              ? "▀" // Top half of the cell is filled
              : "▄" // Bottom half of the cell is filled
          : fill === 2
            ? "█"
            : // Fill === 1
              start % 2 === 0
              ? "▌" // Left half of the cell is filled
              : "▐"; // Right half of the cell is filled

      const outputX = axis === "vertical" ? layout.x : layout.x + index;
      const outputY = axis === "vertical" ? layout.y + index : layout.y;

      output.write(outputX, outputY, colorize(char, thumbColor, "foreground"), {
        transformers: [],
        preserveBackgroundColor: true,
      });
    }
  }
}

function renderVerticalScrollbar(node: DOMElement, x: number, y: number, output: Output) {
  const layout = getVerticalScrollbarBoundingBox(node, { x, y });

  if (layout) {
    renderScrollbar(node, output, layout, "vertical");
  }
}

function renderHorizontalScrollbar(node: DOMElement, x: number, y: number, output: Output) {
  const layout = getHorizontalScrollbarBoundingBox(node, { x, y });

  if (layout) {
    renderScrollbar(node, output, layout, "horizontal");
  }
}

const applySelectionToStyledChars = (
  styledChars: StyledChar[],
  selectionState: { range: { start: number; end: number }; currentOffset: number },
  selectionStyle?: (char: StyledChar) => StyledChar
): StyledChar[] => {
  const { range, currentOffset } = selectionState;
  const { start, end } = range;
  let charCodeUnitOffset = 0;
  const newStyledChars: StyledChar[] = [];

  for (const char of styledChars) {
    const charLength = char.value.length;
    const globalOffset = currentOffset + charCodeUnitOffset;

    if (globalOffset >= start && globalOffset < end) {
      if (selectionStyle) {
        newStyledChars.push(selectionStyle(char));
      } else {
        // 7 is the ANSI code for inverse (reverse video)
        const newChar = {
          ...char,
          styles: [...char.styles],
        };

        newChar.styles.push({
          type: "ansi",
          code: "\u001B[7m",
          endCode: "\u001B[27m",
        });

        newStyledChars.push(newChar);
      }
    } else {
      newStyledChars.push(char);
    }

    charCodeUnitOffset += charLength;
  }

  selectionState.currentOffset += charCodeUnitOffset;

  return newStyledChars;
};

export default renderNodeToOutput;
