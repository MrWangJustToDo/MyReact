import Yoga, { type Node as YogaNode } from "yoga-layout";

import { measureStyledChars, toStyledCharacters, widestLineFromStyledChars } from "./measure-text.js";
import { type Region } from "./output.js";
import { type OutputTransformer } from "./render-node-to-output.js";
import squashTextNodes from "./squash-text-nodes.js";
import { type StyledLine } from "./styled-line.js";
import { type Styles } from "./styles.js";
import { wrapOrTruncateStyledChars } from "./text-wrap.js";

import type ResizeObserver from "./resize-observer.js";

type InkNode = {
  parentNode: DOMElement | undefined;
  yogaNode?: YogaNode;
  internal_static?: boolean;
  style: Styles;
};

export type TextName = "#text";
export type ElementNames = "ink-root" | "ink-box" | "ink-text" | "ink-virtual-text" | "ink-static-render";

export type NodeNames = ElementNames | TextName;

export type StickyHeader = {
  nodeId: number;
  lines: readonly StyledLine[]; // Natural (scrolling) version
  stuckLines?: readonly StyledLine[]; // Alternate (sticky) version
  styledOutput: readonly StyledLine[]; // Legacy property
  x: number; // Stuck X position relative to region
  y: number; // Stuck Y position relative to region
  naturalRow: number; // Natural row offset relative to content start
  startRow: number; // Content-relative start row (same as naturalRow)
  endRow: number; // Content-relative end row
  scrollContainerId: number | string;
  isStuckOnly: boolean; // If true, natural 'lines' are already in background content

  // Metadata for cached headers
  relativeX?: number; // Relative to StaticRender
  relativeY?: number; // Relative to StaticRender
  height?: number;
  parentRelativeTop?: number;
  parentHeight?: number;
  parentBorderTop?: number;
  parentBorderBottom?: number;
  type?: "top" | "bottom";
  node?: DOMElement;
  maxStuckY?: number;
  minStuckY?: number;
};

export type DOMElement = {
  nodeName: ElementNames;
  attributes: Record<string, DOMNodeAttribute>;
  childNodes: DOMNode[];
  internal_transform?: OutputTransformer;
  internal_terminalCursorFocus?: boolean;
  internal_terminalCursorPosition?: number;
  internal_onBeforeRender?: (node: DOMElement, options?: { trackSelection?: boolean }) => void;
  cachedRender?: Region;

  internal_accessibility?: {
    role?:
      | "button"
      | "checkbox"
      | "combobox"
      | "list"
      | "listbox"
      | "listitem"
      | "menu"
      | "menuitem"
      | "option"
      | "progressbar"
      | "radio"
      | "radiogroup"
      | "tab"
      | "tablist"
      | "table"
      | "textbox"
      | "timer"
      | "toolbar";
    state?: {
      busy?: boolean;
      checked?: boolean;
      disabled?: boolean;
      expanded?: boolean;
      multiline?: boolean;
      multiselectable?: boolean;
      readonly?: boolean;
      required?: boolean;
      selected?: boolean;
    };
  };

  // Internal properties
  isStaticDirty?: boolean;
  staticNode?: DOMElement;
  onComputeLayout?: () => void;
  onRender?: () => void;
  onImmediateRender?: () => void;
  internal_scrollState?: ScrollState;
  internal_sticky?: boolean | "top" | "bottom";
  internal_stickyAlternate?: boolean;
  internal_opaque?: boolean;
  internal_scrollbar?: boolean;
  internal_lastMeasuredSize?: { width: number; height: number };
  internal_maxScrollTop?: number;
  internal_isScrollbackDirty?: boolean;
  internal_id: number;
  resizeObservers?: Set<ResizeObserver>;
} & InkNode;

export type ScrollState = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  actualScrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};
export type TextNode = {
  nodeName: TextName;
  nodeValue: string;
} & InkNode;

export type DOMNode<T = { nodeName: NodeNames }> = T extends {
  nodeName: infer U;
}
  ? U extends "#text"
    ? TextNode
    : DOMElement
  : never;

export type DOMNodeAttribute = boolean | string | number;

let idCounter = 0;

export const createNode = (nodeName: ElementNames): DOMElement => {
  const node: DOMElement = {
    nodeName,
    style: {},
    attributes: {},
    childNodes: [],
    parentNode: undefined,
    yogaNode: nodeName === "ink-virtual-text" ? undefined : Yoga.Node.create(),

    internal_accessibility: {},
    internal_sticky: false,
    internal_stickyAlternate: false,
    internal_opaque: false,
    internal_scrollbar: true,
    internal_maxScrollTop: 0,
    internal_isScrollbackDirty: false,
    internal_id: idCounter++,
  };

  if (nodeName === "ink-text") {
    node.yogaNode?.setMeasureFunc(measureTextNode.bind(null, node));
  }

  return node;
};

export const appendChildNode = (node: DOMElement, childNode: DOMElement): void => {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode);
  }

  childNode.parentNode = node;
  node.childNodes.push(childNode);

  if (childNode.yogaNode) {
    node.yogaNode?.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};

export const insertBeforeNode = (node: DOMElement, newChildNode: DOMNode, beforeChildNode: DOMNode): void => {
  if (newChildNode.parentNode) {
    removeChildNode(newChildNode.parentNode, newChildNode);
  }

  newChildNode.parentNode = node;

  const index = node.childNodes.indexOf(beforeChildNode);
  if (index >= 0) {
    node.childNodes.splice(index, 0, newChildNode);
    if (newChildNode.yogaNode) {
      node.yogaNode?.insertChild(newChildNode.yogaNode, index);
    }

    return;
  }

  node.childNodes.push(newChildNode);

  if (newChildNode.yogaNode) {
    node.yogaNode?.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};

export const removeChildNode = (node: DOMElement, removeNode: DOMNode): void => {
  if (removeNode.yogaNode) {
    const parentYogaNode = removeNode.yogaNode.getParent();

    if (parentYogaNode) {
      parentYogaNode.removeChild(removeNode.yogaNode);
    }
  }

  removeNode.parentNode = undefined;

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }

  const index = node.childNodes.indexOf(removeNode);
  if (index >= 0) {
    node.childNodes.splice(index, 1);
  }
};

export const setAttribute = (node: DOMElement, key: string, value: DOMNodeAttribute): void => {
  if (key === "internal_accessibility") {
    node.internal_accessibility = value as DOMElement["internal_accessibility"];
    return;
  }

  node.attributes[key] = value;
};

export const setStyle = (node: DOMNode, style: Styles): void => {
  node.style = style;
};

export const createTextNode = (text: string): TextNode => {
  const node: TextNode = {
    nodeName: "#text",
    nodeValue: text,
    yogaNode: undefined,
    parentNode: undefined,
    style: {},
  };

  setTextNodeValue(node, text);

  return node;
};

const measureTextNode = function (node: DOMNode, width: number): { width: number; height: number } {
  const styledChars = toStyledCharacters(node.nodeName === "#text" ? node.nodeValue : squashTextNodes(node));

  const dimensions = measureStyledChars(styledChars);

  // Text fits into container, no need to wrap
  if (dimensions.width <= width) {
    return dimensions;
  }

  // This is happening when <Box> is shrinking child nodes and Yoga asks
  // if we can fit this text node in a <1px space, so we just tell Yoga "no"
  if (dimensions.width >= 1 && width > 0 && width < 1) {
    return dimensions;
  }

  const textWrap = node.style?.textWrap ?? "wrap";
  const wrappedLines =
    textWrap === "wrap" || textWrap.startsWith("truncate") ? wrapOrTruncateStyledChars(styledChars, Math.floor(width), textWrap) : [styledChars];

  const newWidth = widestLineFromStyledChars(wrappedLines);
  return { width: newWidth, height: wrappedLines.length };
};

const findClosestYogaNode = (node?: DOMNode): YogaNode | undefined => {
  if (!node?.parentNode) {
    return undefined;
  }

  return node.yogaNode ?? findClosestYogaNode(node.parentNode);
};

export const setCachedRender = (node: DOMElement, cachedRender: Region) => {
  node.cachedRender = cachedRender;

  if (node.yogaNode) {
    node.yogaNode.setWidth(cachedRender.width);
    node.yogaNode.setHeight(cachedRender.height);

    while (node.yogaNode.getChildCount() > 0) {
      node.yogaNode.removeChild(node.yogaNode.getChild(0));
    }
  }
};

const markNodeAsDirty = (node?: DOMNode): void => {
  // Mark closest Yoga node as dirty to measure text dimensions again
  const yogaNode = findClosestYogaNode(node);
  yogaNode?.markDirty();
};

export const setTextNodeValue = (node: TextNode, text: string): void => {
  if (typeof text !== "string") {
    text = String(text);
  }

  node.nodeValue = text;
  markNodeAsDirty(node);
};

export const getPathToRoot = (node: DOMNode): DOMNode[] => {
  const path: DOMNode[] = [];
  let current: DOMNode | undefined = node;

  while (current) {
    path.unshift(current);
    current = current.parentNode;
  }

  return path;
};

export const isNodeSelectable = (node: DOMElement): boolean => {
  let current: DOMElement | undefined = node;

  while (current) {
    const { userSelect } = current.style;

    if (userSelect === "none") {
      return false;
    }

    if (userSelect === "text" || userSelect === "all") {
      return true;
    }

    current = current.parentNode;
  }

  return true;
};
