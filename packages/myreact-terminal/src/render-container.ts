/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Yoga from "yoga-layout";

import { type DOMElement, type DOMNode, type StickyHeader } from "./dom.js";
import renderBackground from "./render-background.js";
import renderBorder from "./render-border.js";
import renderNodeToOutput, { type OutputTransformer } from "./render-node-to-output.js";
import { getStickyDescendants, identifyActiveStickyNodes, renderActiveStickyNodes, type StickyNodeInfo } from "./render-sticky.js";
import { getScrollTop, getScrollLeft, getScrollHeight, getScrollWidth } from "./scroll.js";
import { type StyledLine } from "./styled-line.js";

import type Output from "./output.js";

export function handleContainerNode(
  node: DOMElement,
  output: Output,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    newTransformers: OutputTransformer[];
    skipStaticElements: boolean;
    isStickyRender: boolean;
    skipStickyHeaders: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    absoluteOffsetX: number;
    absoluteOffsetY: number;
    trackSelection?: boolean;
  }
) {
  const {
    x,
    y,
    width,
    height,
    newTransformers,
    skipStaticElements,
    isStickyRender,
    skipStickyHeaders,
    selectionMap,
    selectionStyle,
    absoluteOffsetX,
    absoluteOffsetY,
    trackSelection,
  } = options;
  const { yogaNode } = node;
  if (!yogaNode) return;

  let clipped = false;
  let childrenOffsetY = y;
  let childrenOffsetX = x;
  const activeStickyNodes: Array<{
    stickyNode: DOMElement;
    type: "top" | "bottom";
    nextStickyNode?: DOMElement;
    nextStickyNodeInfo?: StickyNodeInfo;
    cached?: StickyHeader;
    anchor?: DOMElement;
  }> = [];

  let verticallyScrollable = false;
  let horizontallyScrollable = false;

  if (node.nodeName === "ink-box") {
    renderBackground(x, y, node, output);
    renderBorder(x, y, node, output);

    const overflow = node.style.overflow ?? "visible";
    const overflowX = node.style.overflowX ?? overflow;
    const overflowY = node.style.overflowY ?? overflow;

    verticallyScrollable = overflowY === "scroll";
    horizontallyScrollable = overflowX === "scroll";

    if (verticallyScrollable) {
      childrenOffsetY -= getScrollTop(node);

      const stickyNodes = getStickyDescendants(node);

      if (stickyNodes.length > 0) {
        const scrollTop = getScrollTop(node) + yogaNode.getComputedBorder(Yoga.EDGE_TOP);
        const clientHeight = node.internal_scrollState?.clientHeight ?? 0;
        const viewportBottom = scrollTop + clientHeight;

        activeStickyNodes.push(...identifyActiveStickyNodes(stickyNodes, node, scrollTop, viewportBottom));
      }
    }

    if (horizontallyScrollable) {
      childrenOffsetX -= getScrollLeft(node);
    }

    const clipHorizontally = overflowX === "hidden" || overflowX === "scroll";
    const clipVertically = overflowY === "hidden" || overflowY === "scroll";

    if (clipHorizontally || clipVertically) {
      const x1 = clipHorizontally ? absoluteOffsetX + yogaNode.getComputedBorder(Yoga.EDGE_LEFT) : undefined;

      const x2 = clipHorizontally ? absoluteOffsetX + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT) : undefined;

      const y1 = clipVertically ? absoluteOffsetY + yogaNode.getComputedBorder(Yoga.EDGE_TOP) : undefined;

      const y2 = clipVertically ? absoluteOffsetY + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM) : undefined;

      if (verticallyScrollable || horizontallyScrollable) {
        const scrollHeight = getScrollHeight(node);
        const scrollWidth = getScrollWidth(node);
        const scrollTop = getScrollTop(node);
        const scrollLeft = getScrollLeft(node);

        const borderLeft = yogaNode.getComputedBorder(Yoga.EDGE_LEFT);
        const borderTop = yogaNode.getComputedBorder(Yoga.EDGE_TOP);
        const borderBottom = yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);

        let marginRight = 0;
        let marginBottom = 0;

        if (!clipHorizontally) {
          marginRight = yogaNode.getComputedBorder(Yoga.EDGE_RIGHT);
        }

        if (!clipVertically) {
          marginBottom = yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM);
        }

        output.startChildRegion({
          id: node.internal_id,
          x: x + borderLeft,
          y: y + borderTop,
          width: (x2 ?? absoluteOffsetX + width) - (x1 ?? absoluteOffsetX + borderLeft),
          height: (y2 ?? absoluteOffsetY + height) - (y1 ?? absoluteOffsetY + borderTop),
          isScrollable: true,
          isVerticallyScrollable: verticallyScrollable,
          isHorizontallyScrollable: horizontallyScrollable,
          scrollState: {
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
          },
          scrollbarVisible: node.internal_scrollbar ?? true,
          overflowToBackbuffer: node.style.overflowToBackbuffer,
          marginRight,
          marginBottom,
          scrollbarThumbColor: node.style.scrollbarThumbColor,
          backgroundColor: node.style.backgroundColor,
          opaque: node.internal_opaque,
          nodeId: node.internal_id,
          stableScrollback: node.style.stableScrollback,
          borderTop,
          borderBottom,
        });

        const childOffsetX = -borderLeft;
        const childOffsetY = -borderTop;

        for (const childNode of node.childNodes) {
          renderNodeToOutput(childNode as DOMElement, output, {
            offsetX: childOffsetX,
            offsetY: childOffsetY,
            absoluteOffsetX: absoluteOffsetX - scrollLeft,
            absoluteOffsetY: absoluteOffsetY - scrollTop,
            transformers: newTransformers,
            skipStaticElements,
            isStickyRender,
            skipStickyHeaders: false,
            selectionMap,
            selectionStyle,
            trackSelection,
          });
        }

        renderActiveStickyNodes(activeStickyNodes, node, output, {
          x,
          y,
          newTransformers,
          skipStaticElements,
          selectionMap,
          selectionStyle,
          trackSelection,
        });

        output.endChildRegion();
      }

      output.clip({
        x1,
        x2,
        y1,
        y2,
      });
      clipped = true;
    }
  }

  if ((node.nodeName as string) === "ink-root" || (node.nodeName as string) === "ink-box") {
    if (!(verticallyScrollable || horizontallyScrollable)) {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode as DOMElement, output, {
          offsetX: childrenOffsetX,
          offsetY: childrenOffsetY,
          absoluteOffsetX,
          absoluteOffsetY,
          transformers: newTransformers,
          skipStaticElements,
          isStickyRender,
          skipStickyHeaders,
          selectionMap,
          selectionStyle,
          trackSelection,
        });
      }
    }

    if (clipped) {
      output.unclip();
    }
  }
}
