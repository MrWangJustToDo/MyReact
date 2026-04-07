/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Yoga from "yoga-layout";

import { type DOMElement } from "./dom.js";

function calculateScrollDimensions(node: DOMElement): {
  scrollHeight: number;
  scrollWidth: number;
} {
  const { yogaNode } = node;
  if (!yogaNode) {
    return { scrollHeight: 0, scrollWidth: 0 };
  }

  const top = yogaNode.getComputedBorder(Yoga.EDGE_TOP);
  const left = yogaNode.getComputedBorder(Yoga.EDGE_LEFT);

  let maxBottom = top;
  let maxRight = yogaNode.getComputedPadding(Yoga.EDGE_LEFT);

  for (let i = 0; i < yogaNode.getChildCount(); i++) {
    const child = yogaNode.getChild(i);
    const childBottom = child.getComputedTop() + child.getComputedHeight() + child.getComputedMargin(Yoga.EDGE_BOTTOM);

    if (childBottom > maxBottom) {
      maxBottom = childBottom;
    }

    const childRight = child.getComputedLeft() + child.getComputedWidth() + child.getComputedMargin(Yoga.EDGE_RIGHT);

    if (childRight > maxRight) {
      maxRight = childRight;
    }
  }

  const scrollHeight = maxBottom - top + yogaNode.getComputedPadding(Yoga.EDGE_BOTTOM);
  const scrollWidth = maxRight - left + yogaNode.getComputedPadding(Yoga.EDGE_RIGHT);

  return { scrollHeight, scrollWidth };
}

export function getScrollHeight(node: DOMElement): number {
  return node.internal_scrollState?.scrollHeight ?? 0;
}

export function getScrollWidth(node: DOMElement): number {
  return node.internal_scrollState?.scrollWidth ?? 0;
}

export function calculateScroll(node: DOMElement, isTerminalResized = false): void {
  const { yogaNode } = node;
  if (!yogaNode) {
    return;
  }

  const { scrollHeight: actualScrollHeight, scrollWidth } = calculateScrollDimensions(node);
  let scrollHeight = actualScrollHeight;

  const clientHeight = yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_TOP) - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

  if (node.style.stableScrollback && node.style.overflowToBackbuffer) {
    if (isTerminalResized) {
      node.internal_maxScrollTop = 0;
      node.internal_isScrollbackDirty = false;
    } else {
      // When stableScrollback is enabled, we track the maximum scroll position ever reached
      // (unless the buffer is cleared). This avoids needing to clear the entire scrollback
      // buffer in order to change the content rendered to it. It ensures that even if child
      // nodes are removed from the DOM, the scrollable area doesn't shrink, allowing users
      // to still scroll up and view content that has 'fallen off' into the virtual backbuffer.
      const actualMaxScrollTop = Math.max(0, actualScrollHeight - clientHeight);

      if (node.internal_isScrollbackDirty) {
        node.internal_maxScrollTop = actualMaxScrollTop;
        node.internal_isScrollbackDirty = false;
      } else {
        node.internal_maxScrollTop = Math.max(node.internal_maxScrollTop ?? 0, actualMaxScrollTop);
      }

      // Ensure we have enough scrollHeight to accommodate internalMaxScrollTop,
      // but cap the padding so that at least one line of actual content remains
      // visible (even if it's pushed to the top of the viewport).
      // We use actualScrollHeight - 1 so that the viewport (of size clientHeight)
      // positioned at clampedMaxScrollTop will intersect with the last line of actual content.
      const maxAllowedScrollTop = Math.max(0, actualScrollHeight - 1);
      const clampedMaxScrollTop = Math.min(node.internal_maxScrollTop, maxAllowedScrollTop);

      scrollHeight = Math.max(actualScrollHeight, clampedMaxScrollTop + clientHeight);
    }
  }

  const scrollTop = Math.max(0, Math.min(node.style.scrollTop ?? 0, scrollHeight - clientHeight));

  const clientWidth = yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_LEFT) - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);

  let scrollLeft = node.style.scrollLeft ?? 0;
  scrollLeft = Math.max(0, Math.min(scrollLeft, scrollWidth - clientWidth));

  node.internal_scrollState = {
    scrollHeight,
    actualScrollHeight,
    scrollWidth,
    scrollTop,
    scrollLeft,
    clientHeight,
    clientWidth,
  };
}

export function getScrollTop(node: DOMElement): number {
  const { yogaNode } = node;
  if (!yogaNode) {
    return 0;
  }

  const clientHeight = yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_TOP) - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

  const scrollHeight = getScrollHeight(node);

  let { scrollTop } = node.style;
  if (typeof scrollTop !== "number") {
    scrollTop = 0;
  }

  return Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
}

export function getScrollLeft(node: DOMElement): number {
  const { yogaNode } = node;
  if (!yogaNode) {
    return 0;
  }

  const clientWidth = yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_LEFT) - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);

  const scrollWidth = getScrollWidth(node);
  const scrollLeft = node.style.scrollLeft ?? 0;
  return Math.max(0, Math.min(scrollLeft, scrollWidth - clientWidth));
}
