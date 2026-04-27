import Yoga from "yoga-layout";

import { type DOMElement, type DOMNode, getCachedRegion, setCachedRegion, setCachedRender, type StickyHeader } from "./dom.js";
import Output, { isRectIntersectingClip, extractSelectableText } from "./output.js";
import { handleCachedRenderNode } from "./render-cached.js";
import { handleContainerNode } from "./render-container.js";
import { renderStickyNode, getStickyDescendants, resolveStickyHeaderInfo } from "./render-sticky.js";
import { handleTextNode } from "./render-text-node.js";
import { triggerResizeObservers } from "./resize-observer.js";
import { type StyledLine } from "./styled-line.js";

export type OutputTransformer = (s: string, index: number) => string;

const isRenderedStaticRenderLeaf = (node: DOMNode): node is DOMElement =>
  node.nodeName === "ink-static-render" && Boolean(node.cachedRender) && node.childNodes.length === 0;

const canUseCachedRegion = (
  node: DOMElement,
  options: {
    skipStaticElements: boolean;
    isStickyRender: boolean;
    selectionMap?: Map<DOMNode, { start: number; end: number }>;
    selectionStyle?: (line: StyledLine, index: number) => void;
    trackSelection?: boolean;
  }
) => {
  if (node.nodeName !== "ink-box") {
    return false;
  }

  if (
    !options.skipStaticElements ||
    node.internal_static ||
    node.internal_sticky ||
    node.internal_stickyAlternate ||
    options.isStickyRender ||
    (options.selectionMap && options.selectionMap.size > 0) ||
    options.selectionStyle ||
    options.trackSelection
  ) {
    return false;
  }

  const overflow = node.style.overflow ?? "visible";
  const overflowX = node.style.overflowX ?? overflow;
  const overflowY = node.style.overflowY ?? overflow;

  if (overflowX === "scroll" || overflowY === "scroll") {
    return false;
  }

  return node.childNodes.some((childNode) => isRenderedStaticRenderLeaf(childNode));
};

const getOrRenderCachedRegion = (
  node: DOMElement,
  options: {
    width: number;
    height: number;
    transformers: OutputTransformer[];
    skipStaticElements: boolean;
    isStickyRender: boolean;
    skipStickyHeaders: boolean;
    stickyHeadersInBackbuffer?: boolean;
  }
) => {
  const { width, height, transformers, skipStaticElements, isStickyRender, skipStickyHeaders, stickyHeadersInBackbuffer } = options;
  const cachedRegion = getCachedRegion(node);

  if (cachedRegion && cachedRegion.width === width && cachedRegion.height === height) {
    return cachedRegion;
  }

  const cachedOutput = new Output({
    width,
    height,
    node,
    id: node.internal_id,
  });

  handleContainerNode(node, cachedOutput, {
    x: 0,
    y: 0,
    width,
    height,
    newTransformers: transformers,
    skipStaticElements,
    isStickyRender,
    skipStickyHeaders,
    stickyHeadersInBackbuffer,
    absoluteOffsetX: 0,
    absoluteOffsetY: 0,
  });

  const region = cachedOutput.get();
  setCachedRegion(node, region);

  return region;
};

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

  // Cache dimensions of the static tree before we render it out and cache/destroy its Yoga children
  triggerResizeObservers(node, true);

  const width = Math.round(node.yogaNode?.getComputedWidth() ?? 0);
  const height = Math.round(node.yogaNode?.getComputedHeight() ?? 0);

  const stickyNodes = getStickyDescendants(node);
  const cachedStickyHeaders: StickyHeader[] = [];

  for (const stickyNodeInfo of stickyNodes) {
    const { node: stickyNode, type: stickyType, cached, anchor } = stickyNodeInfo;

    let naturalLines;
    let stuckLines;
    let naturalHeight;
    let maxHeaderHeight;

    const { relativeX, relativeY, parentRelativeTop, parentHeight, parentBorderTop, parentBorderBottom, nodeId } = resolveStickyHeaderInfo(
      stickyNodeInfo,
      node
    );

    if (cached && anchor) {
      naturalLines = cached.lines;
      stuckLines = cached.stuckLines;
      naturalHeight = cached.endRow - cached.startRow;
      maxHeaderHeight = cached.height!;
    } else {
      if (!stickyNode) {
        continue;
      }

      const rendered = renderStickyNode(stickyNode, {
        skipStaticElements: options.skipStaticElements ?? false,
        selectionMap: options.selectionMap,
        selectionStyle: options.selectionStyle,
        trackSelection: options.trackSelection,
      });
      naturalLines = rendered.naturalLines;
      stuckLines = rendered.stuckLines;
      naturalHeight = rendered.naturalHeight;
      maxHeaderHeight = rendered.maxHeaderHeight;
    }

    const naturalRow = relativeY;

    const headerObj: StickyHeader = {
      nodeId,
      lines: naturalLines,
      stuckLines,
      styledOutput: stuckLines ?? naturalLines,
      x: relativeX,
      y: relativeY,
      naturalRow,
      startRow: naturalRow,
      endRow: naturalRow + naturalHeight,
      scrollContainerId: -1,
      isStuckOnly: true,

      relativeX,
      relativeY,
      height: maxHeaderHeight,
      type: stickyType,
      parentRelativeTop,
      parentHeight,
      parentBorderTop,
      parentBorderBottom,
      node: undefined,
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
  if (node.internal_onRendered) {
    node.internal_onRendered();
  }
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
    stickyHeadersInBackbuffer?: boolean;
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
    const computedLeft = yogaNode.getComputedLeft();
    const computedTop = yogaNode.getComputedTop();
    const x = Math.round(offsetX + computedLeft);
    const y = Math.round(offsetY + computedTop);

    // Absolute screen coordinates (for clipping/visibility check)
    const absX = Math.round(absoluteOffsetX + computedLeft);
    const absY = Math.round(absoluteOffsetY + computedTop);

    const width = Math.round(yogaNode.getComputedWidth());
    const height = Math.round(yogaNode.getComputedHeight());
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

    if (
      width > 0 &&
      height > 0 &&
      canUseCachedRegion(node, {
        skipStaticElements,
        isStickyRender,
        selectionMap,
        selectionStyle,
        trackSelection,
      })
    ) {
      const cachedRegion = getOrRenderCachedRegion(node, {
        width,
        height,
        transformers: newTransformers,
        skipStaticElements,
        isStickyRender,
        skipStickyHeaders,
        stickyHeadersInBackbuffer: options.stickyHeadersInBackbuffer,
      });

      output.addRegionTree(cachedRegion, x, y);
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
      stickyHeadersInBackbuffer: options.stickyHeadersInBackbuffer,
      selectionMap,
      selectionStyle,
      absoluteOffsetX: absX,
      absoluteOffsetY: absY,
      trackSelection,
    });
  }
}

export default renderNodeToOutput;
