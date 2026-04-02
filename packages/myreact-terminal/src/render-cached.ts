/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type DOMElement, type DOMNode } from "./dom.js";
import { toStyledCharacters } from "./measure-text.js";
import { type StyledLine } from "./styled-line.js";

import type Output from "./output.js";

export function handleCachedRenderNode(
  node: DOMElement,
  output: Output,
  options: {
    x: number;
    y: number;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
) {
  const { x, y, selectionMap, selectionStyle } = options;
  let handledSelection = false;

  if (selectionMap && selectionMap.has(node) && node.cachedRender) {
    const range = selectionMap.get(node)!;
    const clonedRegionObj = {
      ...node.cachedRender,
      lines: node.cachedRender.lines.map((line) => line.clone()),
      selectableSpans: node.cachedRender.selectableSpans.map((span) => ({
        ...span,
      })),
      stickyHeaders: (node.cachedRender.cachedStickyHeaders ?? []).map((header) => ({
        ...header,
      })),
      children: node.cachedRender.children.map((child) => ({ ...child })),
    };

    const spans = clonedRegionObj.selectableSpans;
    spans.sort((a, b) => (a.y === b.y ? a.startX - b.startX : a.y - b.y));

    let currentOffset = 0;
    let currentY = spans[0]?.y ?? 0;
    let currentX = spans[0]?.startX ?? 0;

    for (const span of spans) {
      if (span.y > currentY) {
        currentOffset += span.y - currentY;
        currentX = 0;
        currentY = span.y;
      }

      if (span.startX > currentX) {
        currentOffset += span.startX - currentX;
        currentX = span.startX;
      }

      let spanCharX = span.startX;
      const styledChars = toStyledCharacters(span.text);
      for (const char of styledChars) {
        const charLen = char.value.length;
        const charWidth = char.fullWidth ? 2 : 1;

        if (currentOffset >= range.start && currentOffset < range.end) {
          const line = clonedRegionObj.lines[span.y];
          if (line && spanCharX < line.length) {
            if (selectionStyle) {
              selectionStyle(line, spanCharX);
            } else {
              line.setInverted(spanCharX, true);
            }
          }
        }

        currentOffset += charLen;
        spanCharX += charWidth;
      }

      currentX = span.endX;
    }

    output.addRegionTree(clonedRegionObj, x, y);
    handledSelection = true;
  }

  if (!handledSelection && node.cachedRender) {
    output.addRegionTree(node.cachedRender, x, y);
  }
}
