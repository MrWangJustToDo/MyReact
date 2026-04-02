import Yoga from "yoga-layout";

import { type DOMElement, type DOMNode, setCachedRender, type StickyHeader } from "./dom.js";
import { getRelativeLeft, getRelativeTop } from "./measure-element.js";
import Output, { isRectIntersectingClip, extractSelectableText } from "./output.js";
import { handleCachedRenderNode } from "./render-cached.js";
import { handleContainerNode } from "./render-container.js";
import { renderStickyNode, getStickyDescendants } from "./render-sticky.js";
import { handleTextNode } from "./render-text-node.js";
import { type StyledLine } from "./styled-line.js";

export type OutputTransformer = (s: string, index: number) => string;

export const renderToStatic = (
  node: DOMElement,
  options: {
    calculateLayout?: boolean;
    skipStaticElements?: boolean;
    isStickyRender?: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  } = {}
) => {
  if (options.calculateLayout && node.yogaNode) {
    node.yogaNode.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);
  }

  const width = node.yogaNode?.getComputedWidth() ?? 0;
  const height = node.yogaNode?.getComputedHeight() ?? 0;

  const stickyNodes = getStickyDescendants(node);
  const cachedStickyHeaders: StickyHeader[] = [];

  for (const { node: stickyNode } of stickyNodes) {
    const { naturalLines, stuckLines, naturalHeight, maxHeaderHeight } = renderStickyNode(stickyNode, {
      skipStaticElements: options.skipStaticElements ?? false,
      selectionMap: options.selectionMap,
      selectionStyle: options.selectionStyle,
      trackSelection: options.trackSelection,
    });

    const parent = stickyNode.parentNode;
    const parentYogaNode = parent?.yogaNode;
    const currentBorderTop = node.yogaNode?.getComputedBorder(Yoga.EDGE_TOP) ?? 0;
    const naturalRow = getRelativeTop(stickyNode, node) ?? 0 - currentBorderTop;
    const stickyType: "top" | "bottom" = stickyNode.internal_sticky === "bottom" ? "bottom" : "top";

    const headerObj = {
      nodeId: stickyNode.internal_id,
      lines: naturalLines,
      stuckLines,
      styledOutput: stuckLines ?? naturalLines,
      x: getRelativeLeft(stickyNode, node) ?? 0 - (node.yogaNode?.getComputedBorder(Yoga.EDGE_LEFT) ?? 0),
      y: getRelativeTop(stickyNode, node) ?? 0 - currentBorderTop,
      naturalRow,
      startRow: naturalRow,
      endRow: naturalRow + naturalHeight,
      scrollContainerId: -1,
      isStuckOnly: true,

      relativeX: getRelativeLeft(stickyNode, node) ?? 0 - (node.yogaNode?.getComputedBorder(Yoga.EDGE_LEFT) ?? 0),
      relativeY: getRelativeTop(stickyNode, node) ?? 0 - currentBorderTop,
      height: maxHeaderHeight,
      type: stickyType,
      parentRelativeTop: parent ? (getRelativeTop(parent, node) ?? 0 - currentBorderTop) : 0,
      parentHeight: parentYogaNode ? parentYogaNode.getComputedHeight() : Number.MAX_SAFE_INTEGER,
      parentBorderTop: parentYogaNode ? parentYogaNode.getComputedBorder(Yoga.EDGE_TOP) : 0,
      parentBorderBottom: parentYogaNode ? parentYogaNode.getComputedBorder(Yoga.EDGE_BOTTOM) : 0,
      node: stickyNode,
    };

    cachedStickyHeaders.push(headerObj);
  }

  const staticOutput = new Output({
    width,
    height,
    id: node.internal_id,
    trackSelection: options.trackSelection,
  });

  for (const childNode of node.childNodes) {
    renderNodeToOutput(childNode as DOMElement, staticOutput, {
      offsetX: 0,
      offsetY: 0,
      transformers: undefined,
      skipStaticElements: options.skipStaticElements ?? false,
      isStickyRender: options.isStickyRender,
      selectionMap: options.selectionMap,
      selectionStyle: options.selectionStyle,
      trackSelection: options.trackSelection,
    });
  }

  const rootRegion = staticOutput.get();
  rootRegion.cachedStickyHeaders = cachedStickyHeaders;
  if (options.trackSelection) {
    rootRegion.selectableText = extractSelectableText(rootRegion.selectableSpans);
  }

  setCachedRender(node, rootRegion);
};

// After nodes are laid out, render each to output object, which later gets rendered to terminal
function renderNodeToOutput(
  node: DOMElement,
  output: Output,
  options: {
    offsetX?: number;
    offsetY?: number;
    absoluteOffsetX?: number;
    absoluteOffsetY?: number;
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
    isStickyRender?: boolean;
    skipStickyHeaders?: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
) {
  const {
    offsetX = 0,
    offsetY = 0,
    absoluteOffsetX = 0,
    absoluteOffsetY = 0,
    transformers = [],
    skipStaticElements,
    isStickyRender = false,
    skipStickyHeaders = false,
    selectionMap,
    selectionStyle,
    trackSelection,
  } = options;

  if (skipStaticElements && node.internal_static) {
    return;
  }

  if (node.internal_stickyAlternate && !isStickyRender) {
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

    // Absolute screen coordinates (for clipping/visibility check)
    const absX = absoluteOffsetX + yogaNode.getComputedLeft();
    const absY = absoluteOffsetY + yogaNode.getComputedTop();

    const width = yogaNode.getComputedWidth();
    const height = yogaNode.getComputedHeight();
    const clip = output.getCurrentClip();

    if (clip) {
      const absoluteNodeLeft = absX;
      const absoluteNodeRight = absoluteNodeLeft + width;
      const absoluteNodeTop = absY;
      const absoluteNodeBottom = absoluteNodeTop + height;

      const isVisible = isRectIntersectingClip(
        {
          x1: absoluteNodeLeft,
          y1: absoluteNodeTop,
          x2: absoluteNodeRight,
          y2: absoluteNodeBottom,
        },
        clip
      );

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

    if (node.nodeName === "ink-static-render" && !node.cachedRender) {
      return;
    }

    if (node.cachedRender) {
      handleCachedRenderNode(node, output, {
        x,
        y,
        selectionMap,
        selectionStyle,
        trackSelection,
      });
      return;
    }

    if (node.nodeName === "ink-text") {
      handleTextNode(node, output, {
        x,
        y,
        newTransformers,
        selectionMap,
        selectionStyle,
        trackSelection,
      });
      return;
    }

    handleContainerNode(node, output, {
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
      absoluteOffsetX: absX,
      absoluteOffsetY: absY,
      trackSelection,
    });
  }
}

export default renderNodeToOutput;
