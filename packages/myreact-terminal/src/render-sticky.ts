/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Yoga from "yoga-layout";

import { type DOMElement, type DOMNode, type StickyHeader } from "./dom.js";
import { getRelativeTop, getRelativeLeft } from "./measure-element.js";
import Output from "./output.js";
import renderNodeToOutput, { type OutputTransformer } from "./render-node-to-output.js";
import { getScrollTop } from "./scroll.js";
import { type StyledLine } from "./styled-line.js";

export type StickyNodeInfo = {
  node: DOMElement;
  type: "top" | "bottom";
  cached?: StickyHeader;
  anchor?: DOMElement;
};

export function getStickyDescendants(node: DOMElement): StickyNodeInfo[] {
  const stickyDescendants: StickyNodeInfo[] = [];

  for (const child of node.childNodes) {
    if (child.nodeName === "#text") {
      continue;
    }

    const domChild = child;

    if (domChild.internal_stickyAlternate) {
      continue;
    }

    if (domChild.internal_sticky) {
      stickyDescendants.push({
        node: domChild,
        type: domChild.internal_sticky === "bottom" ? "bottom" : "top",
      });
    } else if (domChild.nodeName === "ink-static-render" && domChild.cachedRender?.cachedStickyHeaders) {
      for (const header of domChild.cachedRender.cachedStickyHeaders) {
        if (header.node) {
          stickyDescendants.push({
            node: header.node,
            type: header.node.internal_sticky === "bottom" ? "bottom" : "top",
            cached: header,
            anchor: domChild,
          });
        }
      }
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

export function renderStickyNode(
  stickyNode: DOMElement,
  options: {
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
): {
  naturalLines: readonly StyledLine[];
  stuckLines: readonly StyledLine[] | undefined;
  naturalHeight: number;
  maxHeaderHeight: number;
} {
  const alternateStickyNode = stickyNode.childNodes.find((childNode) => (childNode as DOMElement).internal_stickyAlternate) as DOMElement | undefined;

  const naturalHeight = stickyNode.yogaNode!.getComputedHeight();
  const stuckHeight = alternateStickyNode?.yogaNode?.getComputedHeight() ?? 0;
  const maxHeaderHeight = Math.max(naturalHeight, stuckHeight);

  const renderHeader = (isSticky: boolean) => {
    const stickyOutput = new Output({
      width: stickyNode.yogaNode!.getComputedWidth(),
      height: maxHeaderHeight,
      trackSelection: options.trackSelection,
    });

    renderNodeToOutput(stickyNode, stickyOutput, {
      offsetX: -stickyNode.yogaNode!.getComputedLeft(),
      offsetY: -stickyNode.yogaNode!.getComputedTop(),
      transformers: options.transformers,
      skipStaticElements: options.skipStaticElements,
      isStickyRender: isSticky,
      selectionMap: options.selectionMap,
      selectionStyle: options.selectionStyle,
      trackSelection: options.trackSelection,
    });

    return stickyOutput.get().lines;
  };

  const naturalLines = renderHeader(false);
  const stuckLines = alternateStickyNode ? renderHeader(true) : undefined;

  return { naturalLines, stuckLines, naturalHeight, maxHeaderHeight };
}

export function identifyActiveStickyNodes(stickyNodes: StickyNodeInfo[], node: DOMElement, scrollTop: number, viewportBottom: number) {
  let activeTopStickyNodeIndex = -1;
  let activeTopStickyNode: StickyNodeInfo | undefined;
  let activeBottomStickyNodeIndex = -1;
  let activeBottomStickyNode: StickyNodeInfo | undefined;

  for (const [index, stickyNodeInfo] of stickyNodes.entries()) {
    const { node: stickyNode, type: stickyType, cached, anchor } = stickyNodeInfo;

    let stickyNodeTop: number;
    let stickyNodeHeight: number;
    let parentTop: number;
    let parentHeight: number;

    if (cached && anchor) {
      const staticRenderPos = getRelativeTop(anchor, node) ?? 0;
      stickyNodeTop = staticRenderPos + cached.relativeY!;
      stickyNodeHeight = cached.height!;
      parentTop = staticRenderPos + cached.parentRelativeTop!;
      parentHeight = cached.parentHeight!;
    } else {
      if (!stickyNode.yogaNode) continue;
      stickyNodeTop = getRelativeTop(stickyNode, node) ?? 0;
      stickyNodeHeight = stickyNode.yogaNode.getComputedHeight();

      const parent = stickyNode.parentNode!;
      if (parent?.yogaNode) {
        parentTop = getRelativeTop(parent, node) ?? 0;
        parentHeight = parent.yogaNode.getComputedHeight();
      } else {
        parentTop = 0;
        parentHeight = Number.MAX_SAFE_INTEGER;
      }
    }

    const stickyNodeBottom = stickyNodeTop + stickyNodeHeight;

    if (stickyType === "top" && stickyNodeTop < scrollTop && parentTop + parentHeight > scrollTop) {
      activeTopStickyNode = stickyNodeInfo;
      activeTopStickyNodeIndex = index;
    }

    if (stickyType === "bottom" && Math.floor(stickyNodeBottom) > Math.floor(viewportBottom) && parentTop < viewportBottom) {
      activeBottomStickyNode = stickyNodeInfo;
      activeBottomStickyNodeIndex = index;
    }
  }

  const activeStickyNodes: Array<{
    stickyNode: DOMElement;
    type: "top" | "bottom";
    nextStickyNode?: DOMElement;
    nextStickyNodeInfo?: StickyNodeInfo;
    cached?: StickyHeader;
    anchor?: DOMElement;
  }> = [];

  if (activeTopStickyNode) {
    let nextStickyNode: DOMElement | undefined;
    let nextStickyNodeInfo: StickyNodeInfo | undefined;
    for (let i = activeTopStickyNodeIndex + 1; i < stickyNodes.length; i++) {
      const info = stickyNodes[i]!;
      if (info.type !== "bottom") {
        nextStickyNode = info.node;
        nextStickyNodeInfo = info;
        break;
      }
    }

    activeStickyNodes.push({
      stickyNode: activeTopStickyNode.node,
      type: "top",
      nextStickyNode,
      nextStickyNodeInfo,
      cached: activeTopStickyNode.cached,
      anchor: activeTopStickyNode.anchor,
    });
  }

  if (activeBottomStickyNode) {
    let nextStickyNode: DOMElement | undefined;
    let nextStickyNodeInfo: StickyNodeInfo | undefined;
    for (let i = activeBottomStickyNodeIndex - 1; i >= 0; i--) {
      const info = stickyNodes[i]!;
      if (info.type === "bottom") {
        nextStickyNode = info.node;
        nextStickyNodeInfo = info;
        break;
      }
    }

    activeStickyNodes.push({
      stickyNode: activeBottomStickyNode.node,
      type: "bottom",
      nextStickyNode,
      nextStickyNodeInfo,
      cached: activeBottomStickyNode.cached,
      anchor: activeBottomStickyNode.anchor,
    });
  }

  return activeStickyNodes;
}

export function renderActiveStickyNodes(
  activeStickyNodes: Array<{
    stickyNode: DOMElement;
    type: "top" | "bottom";
    nextStickyNode?: DOMElement;
    nextStickyNodeInfo?: StickyNodeInfo;
    cached?: StickyHeader;
    anchor?: DOMElement;
  }>,
  node: DOMElement,
  output: Output,
  options: {
    x: number;
    y: number;
    newTransformers: OutputTransformer[];
    skipStaticElements: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
) {
  const { x, y, newTransformers, skipStaticElements, selectionMap, selectionStyle, trackSelection } = options;
  const { yogaNode } = node;
  if (!yogaNode) return;

  for (const { stickyNode, type, nextStickyNodeInfo, cached, anchor } of activeStickyNodes) {
    let stickyNodeHeight: number;
    let stickyNodeTop: number;
    let parentTop: number;
    let parentHeight: number;
    let stickyOffsetX: number;
    let stickyNodeId: number;

    const currentBorderTop = yogaNode.getComputedBorder(Yoga.EDGE_TOP);
    const currentBorderLeft = yogaNode.getComputedBorder(Yoga.EDGE_LEFT);

    if (cached && anchor) {
      const staticRenderPosTop = getRelativeTop(anchor, node) ?? 0;
      const staticRenderPosLeft = getRelativeLeft(anchor, node) ?? 0;
      stickyNodeTop = staticRenderPosTop + cached.relativeY!;
      stickyNodeHeight = cached.height!;
      parentTop = staticRenderPosTop + cached.parentRelativeTop!;
      parentHeight = cached.parentHeight!;
      stickyOffsetX = x + staticRenderPosLeft + cached.relativeX!;
      stickyNodeId = cached.nodeId;
    } else {
      stickyNodeTop = getRelativeTop(stickyNode, node) ?? 0;
      const naturalHeight = stickyNode.yogaNode!.getComputedHeight();
      const alternateStickyNode = stickyNode.childNodes.find((childNode) => (childNode as DOMElement).internal_stickyAlternate) as DOMElement | undefined;
      const stuckHeight = alternateStickyNode?.yogaNode?.getComputedHeight() ?? 0;
      stickyNodeHeight = Math.max(naturalHeight, stuckHeight);

      const parent = stickyNode.parentNode!;

      if (parent?.yogaNode) {
        parentTop = getRelativeTop(parent, node) ?? 0;
        parentHeight = parent.yogaNode.getComputedHeight();
      } else {
        parentTop = 0;
        parentHeight = Number.MAX_SAFE_INTEGER;
      }

      stickyOffsetX = x + (getRelativeLeft(stickyNode, node) ?? 0);
      stickyNodeId = stickyNode.internal_id;
    }

    const currentScrollTop = getScrollTop(node);
    const currentClientHeight = node.internal_scrollState?.clientHeight ?? 0;

    const parentBorderBottom = cached ? (cached.parentBorderBottom ?? 0) : (stickyNode.parentNode?.yogaNode?.getComputedBorder(Yoga.EDGE_BOTTOM) ?? 0);

    const parentBottom = parentTop + parentHeight - parentBorderBottom;

    let finalStickyY = 0;
    let maxStuckY: number | undefined;
    let minStuckY: number | undefined;

    if (type === "top") {
      let maxStickyTop = y - currentScrollTop + parentBottom - stickyNodeHeight;
      const naturalStickyY = y - currentScrollTop + stickyNodeTop;
      const stuckStickyY = y + currentBorderTop;

      if (nextStickyNodeInfo) {
        let nextNodeTop: number | undefined;

        if (nextStickyNodeInfo.cached && nextStickyNodeInfo.anchor) {
          const staticRenderPosTop = getRelativeTop(nextStickyNodeInfo.anchor, node) ?? 0;
          nextNodeTop = staticRenderPosTop + nextStickyNodeInfo.cached.relativeY!;
        } else if (nextStickyNodeInfo.node?.yogaNode) {
          nextNodeTop = getRelativeTop(nextStickyNodeInfo.node, node) ?? 0;
        }

        if (nextNodeTop !== undefined) {
          const nextNodeTopInViewport = y - currentScrollTop + nextNodeTop;

          const nextNodePushTop = nextNodeTopInViewport - stickyNodeHeight;
          if (nextNodePushTop < maxStickyTop) {
            maxStickyTop = nextNodePushTop;
          }
        }
      }

      finalStickyY = Math.min(Math.max(stuckStickyY, naturalStickyY), maxStickyTop);

      maxStuckY = maxStickyTop - (y + currentBorderTop);
    } else {
      const parentBorderTop = cached ? (cached.parentBorderTop ?? 0) : (stickyNode.parentNode?.yogaNode?.getComputedBorder(Yoga.EDGE_TOP) ?? 0);

      let minStickyTop = y - currentScrollTop + parentTop + parentBorderTop;
      const naturalStickyY = y - currentScrollTop + stickyNodeTop;
      const stuckStickyY = y + currentBorderTop + currentClientHeight - stickyNodeHeight;

      if (nextStickyNodeInfo) {
        let nextNodeHeight: number | undefined;
        let nextNodeTop: number | undefined;

        if (nextStickyNodeInfo.cached && nextStickyNodeInfo.anchor) {
          nextNodeHeight = nextStickyNodeInfo.cached.height;
          const staticRenderPosTop = getRelativeTop(nextStickyNodeInfo.anchor, node) ?? 0;
          nextNodeTop = staticRenderPosTop + nextStickyNodeInfo.cached.relativeY!;
        } else if (nextStickyNodeInfo.node?.yogaNode) {
          nextNodeHeight = nextStickyNodeInfo.node.yogaNode.getComputedHeight();
          nextNodeTop = getRelativeTop(nextStickyNodeInfo.node, node) ?? 0;
        }

        if (nextNodeTop !== undefined && nextNodeHeight !== undefined) {
          const nextNodeBottomInViewport = y - currentScrollTop + nextNodeTop + nextNodeHeight;
          if (nextNodeBottomInViewport > minStickyTop) {
            minStickyTop = nextNodeBottomInViewport;
          }
        }
      }

      finalStickyY = Math.max(Math.min(stuckStickyY, naturalStickyY), minStickyTop);

      minStuckY = minStickyTop - (y + currentBorderTop);
    }

    let naturalLines: readonly StyledLine[];
    let stuckLines: readonly StyledLine[] | undefined;
    let naturalHeight: number;

    if (cached) {
      naturalLines = cached.lines;
      stuckLines = cached.stuckLines;
      naturalHeight = cached.endRow - cached.startRow;
    } else {
      const rendered = renderStickyNode(stickyNode, {
        transformers: newTransformers,
        skipStaticElements,
        selectionMap,
        selectionStyle,
        trackSelection,
      });
      naturalLines = rendered.naturalLines;
      stuckLines = rendered.stuckLines;
      naturalHeight = rendered.naturalHeight;
    }

    const naturalRow = stickyNodeTop - currentBorderTop;

    const headerObj: StickyHeader = {
      nodeId: stickyNodeId,
      lines: naturalLines,
      stuckLines,
      styledOutput: stuckLines ?? naturalLines,
      x: stickyOffsetX - (x + currentBorderLeft),
      y: finalStickyY - (y + yogaNode.getComputedBorder(Yoga.EDGE_TOP)),
      naturalRow,
      startRow: naturalRow,
      endRow: naturalRow + naturalHeight,
      scrollContainerId: node.internal_id,
      isStuckOnly: false,
      type,
      maxStuckY,
      minStuckY,
    };
    output.addStickyHeader(headerObj);
  }
}
