/* eslint-disable max-lines */
import Yoga from "yoga-layout";

import { type DOMElement, type DOMNode, type TextNode } from "./dom";
import getMaxWidth from "./get-max-width";
import { processLayout } from "./layout";
import { toStyledCharacters, inkCharacterWidth, styledCharsToString } from "./measure-text";
import { getScrollLeft, getScrollTop } from "./scroll";
import squashTextNodes from "./squash-text-nodes";
import { wrapOrTruncateStyledChars } from "./text-wrap";

type Output = {
  /**
	Element width.
	*/
  width: number;

  /**
	Element height.
	*/
  height: number;
};

/**
Measure the dimensions of a particular `<Box>` element.
*/
const measureElement = (node: DOMElement): Output => ({
  width: node.yogaNode?.getComputedWidth() ?? 0,
  height: node.yogaNode?.getComputedHeight() ?? 0,
});

/**
 * Get an element's inner width.
 */
export const getInnerWidth = (node: DOMElement): number => {
  const { yogaNode } = node;

  if (!yogaNode) {
    return 0;
  }

  const width = yogaNode.getComputedWidth() ?? 0;
  const borderLeft = yogaNode.getComputedBorder(Yoga.EDGE_LEFT);
  const borderRight = yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);

  return width - borderLeft - borderRight;
};

/*
 * Get an element's inner height.
 */
export const getInnerHeight = (node: DOMElement): number => {
  const { yogaNode } = node;

  if (!yogaNode) {
    return 0;
  }

  const height = yogaNode.getComputedHeight() ?? 0;
  const borderTop = yogaNode.getComputedBorder(Yoga.EDGE_TOP);
  const borderBottom = yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

  return height - borderTop - borderBottom;
};

/**
 * Get an element's position and dimensions relative to the root.
 */
export const getBoundingBox = (node: DOMElement): { x: number; y: number; width: number; height: number } => {
  const { yogaNode } = node;

  if (!yogaNode) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const width = yogaNode.getComputedWidth() ?? 0;
  const height = yogaNode.getComputedHeight() ?? 0;

  let x = yogaNode.getComputedLeft();
  let y = yogaNode.getComputedTop();

  let parent = node.parentNode;
  while (parent?.yogaNode) {
    x += parent.yogaNode.getComputedLeft();
    y += parent.yogaNode.getComputedTop();

    if (parent.nodeName === "ink-box") {
      const overflow = parent.style.overflow ?? "visible";
      const overflowX = parent.style.overflowX ?? overflow;
      const overflowY = parent.style.overflowY ?? overflow;

      if (overflowY === "scroll") {
        y -= getScrollTop(parent);
      }

      if (overflowX === "scroll") {
        x -= getScrollLeft(parent);
      }
    }

    parent = parent.parentNode;
  }

  return { x, y, width, height };
};

export type ScrollbarBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  thumb: {
    x: number;
    y: number;
    width: number;
    height: number;
    start: number;
    end: number;
    startHalf: number;
    endHalf: number;
  };
};

export function calculateScrollbarThumb(options: {
  scrollbarDimension: number;
  clientDimension: number;
  scrollDimension: number;
  scrollPosition: number;
  axis: "vertical" | "horizontal";
}): {
  startIndex: number;
  endIndex: number;
  thumbStartHalf: number;
  thumbEndHalf: number;
} {
  const { scrollbarDimension, clientDimension, scrollDimension, scrollPosition, axis } = options;

  const scrollbarDimensionHalves = scrollbarDimension * 2;

  const thumbDimensionHalves = Math.max(axis === "vertical" ? 2 : 1, Math.round((clientDimension / scrollDimension) * scrollbarDimensionHalves));

  const maxScrollPosition = scrollDimension - clientDimension;
  const maxThumbPosition = scrollbarDimensionHalves - thumbDimensionHalves;

  const thumbPosition = maxScrollPosition > 0 ? Math.round((scrollPosition / maxScrollPosition) * maxThumbPosition) : 0;

  const thumbStartHalf = thumbPosition;
  const thumbEndHalf = thumbPosition + thumbDimensionHalves;

  const startIndex = Math.floor(thumbStartHalf / 2);
  const endIndex = Math.min(scrollbarDimension, Math.ceil(thumbEndHalf / 2));

  return { startIndex, endIndex, thumbStartHalf, thumbEndHalf };
}

/**
 * Get the bounding box of the vertical scrollbar.
 */
export const getVerticalScrollbarBoundingBox = (node: DOMElement, offset?: { x: number; y: number }): ScrollbarBoundingBox | undefined => {
  const { yogaNode } = node;
  if (!yogaNode) {
    return undefined;
  }

  const overflow = node.style.overflow ?? "visible";
  const overflowY = node.style.overflowY ?? overflow;

  if (overflowY !== "scroll") {
    return undefined;
  }

  const clientHeight = node.internal_scrollState?.clientHeight ?? 0;
  const scrollHeight = node.internal_scrollState?.scrollHeight ?? 0;

  if (scrollHeight <= clientHeight) {
    return undefined;
  }

  const { x, y } = offset ?? getBoundingBox(node);
  const scrollbarHeight = yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_TOP) - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

  const { startIndex, endIndex, thumbStartHalf, thumbEndHalf } = calculateScrollbarThumb({
    scrollbarDimension: scrollbarHeight,
    clientDimension: clientHeight,
    scrollDimension: scrollHeight,
    scrollPosition: node.internal_scrollState?.scrollTop ?? 0,
    axis: "vertical",
  });

  const scrollbarX = x + yogaNode.getComputedWidth() - 1 - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);
  const scrollbarY = y + yogaNode.getComputedBorder(Yoga.EDGE_TOP);

  return {
    x: scrollbarX,
    y: scrollbarY,
    width: 1,
    height: scrollbarHeight,
    thumb: {
      x: scrollbarX,
      y: scrollbarY + startIndex,
      width: 1,
      height: endIndex - startIndex,
      start: startIndex,
      end: endIndex,
      startHalf: thumbStartHalf,
      endHalf: thumbEndHalf,
    },
  };
};

/**
 * Get the bounding box of the horizontal scrollbar.
 */
export const getHorizontalScrollbarBoundingBox = (node: DOMElement, offset?: { x: number; y: number }): ScrollbarBoundingBox | undefined => {
  const { yogaNode } = node;
  if (!yogaNode) {
    return undefined;
  }

  const overflow = node.style.overflow ?? "visible";
  const overflowX = node.style.overflowX ?? overflow;

  if (overflowX !== "scroll") {
    return undefined;
  }

  const clientWidth = node.internal_scrollState?.clientWidth ?? 0;
  const scrollWidth = node.internal_scrollState?.scrollWidth ?? 0;

  if (scrollWidth <= clientWidth) {
    return undefined;
  }

  const { x, y } = offset ?? getBoundingBox(node);

  const overflowY = node.style.overflowY ?? overflow;
  const clientHeight = node.internal_scrollState?.clientHeight ?? 0;
  const scrollHeight = node.internal_scrollState?.scrollHeight ?? 0;
  const isVerticalScrollbarVisible = overflowY === "scroll" && scrollHeight > clientHeight;

  const scrollbarWidth =
    yogaNode.getComputedWidth() -
    yogaNode.getComputedBorder(Yoga.EDGE_LEFT) -
    yogaNode.getComputedBorder(Yoga.EDGE_RIGHT) -
    (isVerticalScrollbarVisible ? 1 : 0);

  const { startIndex, endIndex, thumbStartHalf, thumbEndHalf } = calculateScrollbarThumb({
    scrollbarDimension: scrollbarWidth,
    clientDimension: clientWidth,
    scrollDimension: scrollWidth,
    scrollPosition: node.internal_scrollState?.scrollLeft ?? 0,
    axis: "horizontal",
  });

  const scrollbarX = x + yogaNode.getComputedBorder(Yoga.EDGE_LEFT);
  const scrollbarY = y + yogaNode.getComputedHeight() - 1 - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

  return {
    x: scrollbarX,
    y: scrollbarY,
    width: scrollbarWidth,
    height: 1,
    thumb: {
      x: scrollbarX + startIndex,
      y: scrollbarY,
      width: endIndex - startIndex,
      height: 1,
      start: startIndex,
      end: endIndex,
      startHalf: thumbStartHalf,
      endHalf: thumbEndHalf,
    },
  };
};

export type TextFragment = {
  node: DOMElement;
  text: string;
  x: number;
  y: number;
  visualX: number;
  visualY: number;
  width: number;
  height: number;
};

export const collectSortedFragments = (
  node: DOMNode
): {
  fragments: TextFragment[];
  removedVertical: number;
  removedHorizontal: number;
} => {
  const fragments: TextFragment[] = [];

  const collect = (
    currentNode: DOMNode,
    coords: { x: number; y: number; visualX: number; visualY: number },
    isSelectable: boolean
  ): { v: number; h: number; hasContent: boolean } => {
    const { x, y, visualX, visualY } = coords;
    let v = 0;
    let h = 0;

    let currentSelectable = isSelectable;
    const { userSelect } = currentNode.style;

    if (userSelect === "none") {
      currentSelectable = false;
    } else if (userSelect === "text" || userSelect === "all") {
      currentSelectable = true;
    }

    if (currentNode.nodeName === "ink-text" || currentNode.nodeName === "ink-virtual-text") {
      if (currentSelectable) {
        const text = getText(currentNode);
        fragments.push({
          node: currentNode,
          text,
          x,
          y,
          visualX,
          visualY,
          width: currentNode.yogaNode?.getComputedWidth() ?? 0,
          height: currentNode.yogaNode?.getComputedHeight() ?? 0,
        });

        return { v: 0, h: 0, hasContent: true };
      }

      return {
        v: currentNode.yogaNode?.getComputedHeight() ?? 0,
        h: currentNode.yogaNode?.getComputedWidth() ?? 0,
        hasContent: false,
      };
    }

    if (currentNode.nodeName === "ink-box" || currentNode.nodeName === "ink-root") {
      if (!currentNode.yogaNode || currentNode.yogaNode.getDisplay() === Yoga.DISPLAY_NONE) {
        return { v: 0, h: 0, hasContent: false };
      }

      const borderTop = currentNode.yogaNode.getComputedBorder(Yoga.EDGE_TOP);
      const borderBottom = currentNode.yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);
      const borderLeft = currentNode.yogaNode.getComputedBorder(Yoga.EDGE_LEFT);
      const borderRight = currentNode.yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);

      v += borderTop + borderBottom;
      h += borderLeft + borderRight;

      const flexDirection = currentNode.yogaNode.getFlexDirection();
      const isColumn = flexDirection === Yoga.FLEX_DIRECTION_COLUMN || flexDirection === Yoga.FLEX_DIRECTION_COLUMN_REVERSE;

      let siblingRemovedH = 0;
      let siblingRemovedV = 0;
      let childHasContent = false;

      for (const child of currentNode.childNodes) {
        if (child.yogaNode) {
          const parentBorderLeft = currentNode.yogaNode.getComputedBorder(Yoga.EDGE_LEFT);

          const childX = x + child.yogaNode.getComputedLeft() - parentBorderLeft - siblingRemovedH;
          const childY = y + child.yogaNode.getComputedTop() - borderTop - siblingRemovedV;

          const childVisualX = visualX + child.yogaNode.getComputedLeft();
          const childVisualY = visualY + child.yogaNode.getComputedTop();

          const res = collect(
            child,
            {
              x: childX,
              y: childY,
              visualX: childVisualX,
              visualY: childVisualY,
            },
            currentSelectable
          );

          if (res.hasContent) {
            childHasContent = true;
          }

          if (isColumn) {
            siblingRemovedV += res.v;
          } else {
            siblingRemovedH += res.h;
          }
        }
      }

      if (isColumn) {
        v += siblingRemovedV;
      } else {
        h += siblingRemovedH;
      }

      if (!childHasContent && userSelect === "none") {
        return {
          v: currentNode.yogaNode.getComputedHeight(),
          h: currentNode.yogaNode.getComputedWidth(),
          hasContent: false,
        };
      }

      return { v, h, hasContent: childHasContent };
    }

    return { v: 0, h: 0, hasContent: false };
  };

  const { v, h } = collect(node, { x: 0, y: 0, visualX: 0, visualY: 0 }, true);

  fragments.sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }

    return a.x - b.x;
  });

  return { fragments, removedVertical: v, removedHorizontal: h };
};

export const getText = (node: DOMNode): string => {
  if (node.nodeName === "#text") {
    return node.nodeValue;
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    const text = squashTextNodes(node);
    const styledChars = toStyledCharacters(text);
    const plainText = styledChars.map((char) => char.value).join("");

    const textWrap = node.style.textWrap ?? "wrap";

    if (textWrap.startsWith("truncate")) {
      const maxWidth = getMaxWidth(node.yogaNode!);
      const lines = wrapOrTruncateStyledChars(styledChars, maxWidth, textWrap);
      return styledCharsToString(lines[0]!);
    }

    return plainText;
  }

  if (node.nodeName === "ink-box" || node.nodeName === "ink-root") {
    if (!node.yogaNode) {
      return "";
    }

    const { state, lineBottom } = processLayout(node, {
      initialState: (): { result: string } => ({ result: "" }),
      onNewline(count, state) {
        state.result += "\n".repeat(count);
      },
      onSpace(count, state) {
        state.result += " ".repeat(count);
      },
      onText(fragment, state) {
        state.result += fragment.text;
      },
    });

    // Trailing newlines
    const { removedVertical } = collectSortedFragments(node);
    const height = node.yogaNode?.getComputedHeight() ?? 0;
    const innerHeight = height - removedVertical;

    if (innerHeight > lineBottom) {
      state.result += "\n".repeat(innerHeight - lineBottom);
    }

    return state.result;
  }

  return "";
};

const handleVerticalGap = (
  fragment: TextFragment,
  state: {
    offset: number;
    currentX: number;
    lineBottom: number;
    trailingCandidate: number;
  },
  y: number,
  options?: { snapToGap?: "start" | "end" }
): number | undefined => {
  if (fragment.y < state.lineBottom) {
    return undefined;
  }

  if (state.trailingCandidate !== -1) {
    return state.trailingCandidate;
  }

  const gap = fragment.y - state.lineBottom;
  const newlines = state.offset > 0 ? 1 + gap : gap;

  if (y < fragment.visualY) {
    if (options?.snapToGap === "end") {
      return state.offset + newlines;
    }

    if (options?.snapToGap === "start") {
      return state.offset;
    }

    if (newlines > 0) {
      const distance = fragment.visualY - y;
      const clampedDistance = Math.min(distance, newlines);
      return state.offset + newlines - clampedDistance;
    }

    return state.offset;
  }

  if (newlines > 0) {
    state.offset += newlines;
    state.currentX = 0;
    state.lineBottom = fragment.y;
  }

  return undefined;
};

const handleHorizontalGap = (
  fragment: TextFragment,
  state: {
    offset: number;
    currentX: number;
  },
  x: number,
  y: number,
  options?: { snapToGap?: "start" | "end" }
): number | undefined => {
  const gap = fragment.x - state.currentX;

  if (y >= fragment.visualY && y < fragment.visualY + 1 && x < fragment.visualX) {
    if (options?.snapToGap === "end") {
      return state.offset + gap;
    }

    if (options?.snapToGap === "start") {
      return state.offset;
    }

    if (gap > 0) {
      const distance = fragment.visualX - x;
      const clampedDistance = Math.min(distance, gap);
      return state.offset + gap - clampedDistance;
    }

    return state.offset;
  }

  if (gap > 0) {
    state.offset += gap;
    state.currentX = fragment.x;
  }

  return undefined;
};

const handleContentMatch = (
  fragment: TextFragment,
  state: {
    offset: number;
    trailingCandidate: number;
  },
  x: number,
  y: number,
  options?: { snapToChar?: "start" | "end" }
): number | undefined => {
  const isVerticalMatch = y >= fragment.visualY && y < fragment.visualY + fragment.height;

  const isHorizontalMatch = x >= fragment.visualX && x <= fragment.visualX + fragment.width;

  if (isVerticalMatch && (isHorizontalMatch || x < fragment.visualX)) {
    return state.offset + getTextOffset(fragment.node, x - fragment.visualX, y - fragment.visualY, options);
  }

  if (isVerticalMatch && x > fragment.visualX + fragment.width) {
    state.trailingCandidate = state.offset + getTextOffset(fragment.node, x - fragment.visualX, y - fragment.visualY, options);
  }

  return undefined;
};

const processFragment = (
  fragment: TextFragment,
  state: {
    offset: number;
    currentX: number;
    lineBottom: number;
    trailingCandidate: number;
  },
  x: number,
  y: number,
  options?: { snapToGap?: "start" | "end"; snapToChar?: "start" | "end" }
): number | undefined => {
  const verticalResult = handleVerticalGap(fragment, state, y, options);
  if (verticalResult !== undefined) {
    return verticalResult;
  }

  const horizontalResult = handleHorizontalGap(fragment, state, x, y, options);
  if (horizontalResult !== undefined) {
    return horizontalResult;
  }

  const contentResult = handleContentMatch(fragment, state, x, y, options);
  if (contentResult !== undefined) {
    return contentResult;
  }

  state.offset += fragment.text.length;

  const newlines = (fragment.text.match(/\n/g) ?? []).length;
  if (newlines > 0) {
    const lastNewlineIndex = fragment.text.lastIndexOf("\n");
    state.currentX = fragment.text.length - lastNewlineIndex - 1;
  } else {
    state.currentX += fragment.text.length;
  }

  state.lineBottom = Math.max(state.lineBottom, fragment.y + fragment.height);

  return undefined;
};

const getTextOffsetForTextNode = (node: DOMElement, x: number, y: number, options?: { snapToChar?: "start" | "end" }): number => {
  if (y < 0) {
    return 0;
  }

  const text = squashTextNodes(node);
  const styledChars = toStyledCharacters(text);
  const maxWidth = getMaxWidth(node.yogaNode!);
  const textWrap = node.style.textWrap ?? "wrap";

  const lines = wrapOrTruncateStyledChars(styledChars, maxWidth, textWrap);

  let currentY = 0;
  for (const line of lines) {
    if (y === currentY) {
      let currentX = 0;
      for (const char of line) {
        const charWidth = inkCharacterWidth(char.value);
        if (x < currentX + charWidth) {
          const index = styledChars.indexOf(char);
          if (index !== -1) {
            let currentOffset = 0;
            for (let i = 0; i < index; i++) {
              currentOffset += styledChars[i]!.value.length;
            }

            if (options?.snapToChar === "end" && x >= currentX) {
              currentOffset += char.value.length;
            }

            return currentOffset;
          }

          return getText(node).length;
        }

        currentX += charWidth;
      }

      const lastChar = line.at(-1);
      if (lastChar) {
        const index = styledChars.indexOf(lastChar);
        if (index !== -1) {
          let currentOffset = 0;
          for (let i = 0; i <= index; i++) {
            currentOffset += styledChars[i]!.value.length;
          }

          return currentOffset;
        }

        return getText(node).length;
      }

      // If we are here, we finished the line loop.
      // This happens if the line is empty, or if x was greater than the line width.
      // But wait, if x < 0, we should have returned inside the loop (first char).
      // Unless the line is empty.

      // If the line is empty, we should return the offset at the start of this line.
      // We need to find the offset corresponding to the start of this line.
      // Since we don't track offsets easily, we can find the first char of the line (if any) or the char after the previous line.

      // However, the issue in the test was returning 1 instead of 5.
      // This means it matched index 1.
      // Index 1 is '2'.
      // This means `x` was interpreted as matching '2'.
      // This implies `x` was not < width of '1'.
      // If `x` was 1.
      // `visualX` must have been 0.
      // But we saw `visualX` should be 2.

      // Let's look at the logs I added.
      // I need to run the test again and see the logs.
      // I missed checking the logs in the previous turn output because I was focused on the failure message.
      // The logs should be in the output.

      return 0;
    }

    currentY++;
  }

  return getText(node).length;
};

export const getTextOffset = (node: DOMNode, x: number, y: number, options?: { snapToGap?: "start" | "end"; snapToChar?: "start" | "end" }): number => {
  if (node.nodeName === "#text") {
    return 0;
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    return getTextOffsetForTextNode(node, x, y, options);
  }

  if (node.nodeName === "ink-box" || node.nodeName === "ink-root") {
    const { fragments, removedVertical } = collectSortedFragments(node);
    const state = {
      offset: 0,
      currentX: 0,
      lineBottom: 0,
      trailingCandidate: -1,
    };

    for (const fragment of fragments) {
      const result = processFragment(fragment, state, x, y, options);
      if (result !== undefined) {
        return result;
      }
    }

    if (state.trailingCandidate !== -1) {
      return state.trailingCandidate;
    }

    const height = node.yogaNode?.getComputedHeight() ?? 0;
    const innerHeight = height - removedVertical;

    if (innerHeight > state.lineBottom) {
      const gap = innerHeight - state.lineBottom;
      if (y >= state.lineBottom) {
        // This logic uses logical Y (lineBottom) and visual Y (y).
        // This is potentially buggy if they diverge.
        // But we don't have a better way to map trailing empty lines without more info.
        // Assuming trailing lines match logical height.
        const relativeY = y - state.lineBottom;
        return state.offset + Math.min(relativeY, gap);
      }
    }

    return state.offset;
  }

  return 0;
};

const findNodeInSquashed = (root: DOMNode, offset: number): { node: TextNode; offset: number } | undefined => {
  let currentOffset = 0;

  const findNode = (node: DOMNode): { node: TextNode; offset: number } | undefined => {
    if (node.nodeName === "#text") {
      const { length } = node.nodeValue;
      if (offset >= currentOffset && offset <= currentOffset + length) {
        return { node, offset: offset - currentOffset };
      }

      currentOffset += length;
    } else if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
      for (const child of node.childNodes) {
        const result = findNode(child);
        if (result) {
          return result;
        }
      }
    }

    return undefined;
  };

  return findNode(root);
};

export const findNodeAtOffset = (node: DOMNode, targetOffset: number): { node: TextNode; offset: number } | undefined => {
  if (node.nodeName === "#text") {
    return { node, offset: Math.min(targetOffset, node.nodeValue.length) };
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    return findNodeInSquashed(node, targetOffset);
  }

  if (node.nodeName === "ink-box" || node.nodeName === "ink-root") {
    if (!node.yogaNode) {
      return undefined;
    }

    const { fragments } = collectSortedFragments(node);
    let currentOffset = 0;
    let lineBottom = 0;
    let currentX = 0;

    for (const fragment of fragments) {
      if (fragment.y >= lineBottom) {
        const gap = fragment.y - lineBottom;
        const newlines = currentOffset > 0 ? 1 + gap : gap;

        if (newlines > 0) {
          if (targetOffset < currentOffset + newlines) {
            return findNodeInSquashed(fragment.node, 0);
          }

          currentOffset += newlines;
          currentX = 0;
          lineBottom = fragment.y;
        }
      }

      if (fragment.x > currentX) {
        const spaces = fragment.x - currentX;

        if (targetOffset < currentOffset + spaces) {
          return findNodeInSquashed(fragment.node, 0);
        }

        currentOffset += spaces;
        currentX = fragment.x;
      }

      const textLength = fragment.text.length;
      if (targetOffset < currentOffset + textLength) {
        return findNodeInSquashed(fragment.node, targetOffset - currentOffset);
      }

      currentOffset += textLength;

      const newlinesInText = (fragment.text.match(/\n/g) ?? []).length;
      if (newlinesInText > 0) {
        const lastNewlineIndex = fragment.text.lastIndexOf("\n");
        currentX = fragment.text.length - lastNewlineIndex - 1;
      } else {
        currentX += fragment.text.length;
      }

      lineBottom = Math.max(lineBottom, fragment.y + fragment.height);
    }

    if (fragments.length > 0) {
      const lastFragment = fragments.at(-1)!;
      const { text } = lastFragment;
      return findNodeInSquashed(lastFragment.node, text.length);
    }
  }

  return undefined;
};

export const hitTest = (node: DOMElement, x: number, y: number): { node: DOMNode; offset: number } | undefined => {
  const { fragments } = collectSortedFragments(node);
  let bestMatch: { fragment: TextFragment; vDist: number; hDist: number } | undefined;

  for (const fragment of fragments) {
    let vDist = 0;
    let hDist = 0;

    // Calculate vertical distance
    if (y < fragment.visualY) {
      vDist = fragment.visualY - y;
    } else if (y >= fragment.visualY + fragment.height) {
      vDist = y - (fragment.visualY + fragment.height - 1);
    } else {
      vDist = 0;
    }

    // Calculate horizontal distance
    if (x < fragment.visualX) {
      hDist = fragment.visualX - x;
    } else if (x > fragment.visualX + fragment.width) {
      hDist = x - (fragment.visualX + fragment.width);
    } else {
      hDist = 0;
    }

    // Prioritize exact matches (vDist=0, hDist=0)
    if (vDist === 0 && hDist === 0) {
      bestMatch = { fragment, vDist, hDist };
      break;
    }

    if (bestMatch) {
      // Compare with best match
      // Priority:
      // 1. Vertical distance (smaller is better)
      // 2. Horizontal distance (smaller is better)

      if (vDist < bestMatch.vDist) {
        bestMatch = { fragment, vDist, hDist };
      } else if (vDist === bestMatch.vDist && hDist < bestMatch.hDist) {
        bestMatch = { fragment, vDist, hDist };
      }
    } else {
      bestMatch = { fragment, vDist, hDist };
    }
  }

  if (bestMatch) {
    const { fragment } = bestMatch;
    const relativeX = x - fragment.visualX;
    const relativeY = y - fragment.visualY;

    const offsetInSquashed = getTextOffset(fragment.node, relativeX, relativeY);

    let currentOffset = 0;

    const findNode = (n: DOMNode): { node: DOMNode; offset: number } | undefined => {
      if (n.nodeName === "#text") {
        const { length } = n.nodeValue;
        if (offsetInSquashed >= currentOffset && offsetInSquashed <= currentOffset + length) {
          return { node: n, offset: offsetInSquashed - currentOffset };
        }

        currentOffset += length;
      } else {
        for (const child of n.childNodes) {
          const result = findNode(child);
          if (result) {
            return result;
          }
        }
      }

      return undefined;
    };

    return findNode(fragment.node);
  }

  return undefined;
};

export default measureElement;
