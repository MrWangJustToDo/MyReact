/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type DOMNode } from "./dom";
import { collectSortedFragments, type TextFragment } from "./measure-element";

export type LayoutState = Record<string, any>;

export type LayoutCallbacks<T extends LayoutState> = {
  onText: (fragment: TextFragment, state: T) => void;
  onNewline: (count: number, state: T) => void;
  onSpace: (count: number, state: T) => void;
  initialState: () => T;
};

export const processLayout = <T extends LayoutState>(node: DOMNode, callbacks: LayoutCallbacks<T>): { state: T; lineBottom: number } => {
  const { initialState, onNewline, onSpace, onText } = callbacks;

  if ((node.nodeName !== "ink-box" && node.nodeName !== "ink-root" && node.nodeName !== "ink-text" && node.nodeName !== "ink-virtual-text") || !node.yogaNode) {
    return { state: initialState(), lineBottom: 0 };
  }

  const { fragments } = collectSortedFragments(node);
  const state: T & {
    currentX: number;
    lineBottom: number;
    yieldedContent: boolean;
  } = {
    ...initialState(),
    currentX: 0,
    lineBottom: 0,
    yieldedContent: false,
  };

  for (const fragment of fragments) {
    if (fragment.y >= state.lineBottom) {
      const gap = fragment.y - state.lineBottom;
      const newlines = state.yieldedContent ? 1 + gap : gap;

      if (newlines > 0) {
        onNewline(newlines, state);
        state.currentX = 0;
      }

      state.lineBottom = fragment.y;
    }

    if (fragment.x > state.currentX) {
      const spaces = fragment.x - state.currentX;
      onSpace(spaces, state);
      state.currentX = fragment.x;
    }

    if (fragment.text.length > 0) {
      state.yieldedContent = true;
      onText(fragment, state);
    }

    const newlinesInText = (fragment.text.match(/\n/g) ?? []).length;
    if (newlinesInText > 0) {
      const lastNewlineIndex = fragment.text.lastIndexOf("\n");
      state.currentX = fragment.text.length - lastNewlineIndex - 1;
    } else {
      state.currentX += fragment.text.length;
    }

    state.lineBottom = Math.max(state.lineBottom, fragment.y + fragment.height);
  }

  return { state, lineBottom: state.lineBottom };
};
