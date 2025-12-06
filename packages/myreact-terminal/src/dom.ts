import Yoga, { type Node as YogaNode } from "yoga-layout";

import { measureStyledChars, toStyledCharacters, widestLineFromStyledChars } from "./measure-text";
import { type OutputTransformer } from "./render-node-to-output";
import squashTextNodes from "./squash-text-nodes";
import { type Styles } from "./styles";
import { wrapOrTruncateStyledChars } from "./text-wrap";

import type ResizeObserver from "./resize-observer";

type InkNode = {
  parentNode: DOMElement | undefined;
  yogaNode?: YogaNode;
  internal_static?: boolean;
  style: Styles;
};

export type TextName = "#text";
export type ElementNames = "ink-root" | "ink-box" | "ink-text" | "ink-virtual-text";

export type NodeNames = ElementNames | TextName;

export type DOMElement = {
  nodeName: ElementNames;
  attributes: Record<string, DOMNodeAttribute>;
  childNodes: DOMNode[];
  internal_transform?: OutputTransformer;

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
  internal_sticky?: boolean;
  internal_sticky_alternate?: boolean;
  internal_opaque?: boolean;
  resizeObservers?: Set<ResizeObserver>;
  internal_lastMeasuredSize?: { width: number; height: number };
} & InkNode;

export type ScrollState = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
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
    internal_sticky_alternate: false,
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
    removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
  }

  removeNode.parentNode = undefined;

  const index = node.childNodes.indexOf(removeNode);
  if (index >= 0) {
    node.childNodes.splice(index, 1);
  }

  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
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
  const wrappedLines = textWrap === "wrap" || textWrap.startsWith("truncate") ? wrapOrTruncateStyledChars(styledChars, width, textWrap) : [styledChars];

  const newWidth = widestLineFromStyledChars(wrappedLines);
  return { width: newWidth, height: wrappedLines.length };
};

const findClosestYogaNode = (node?: DOMNode): YogaNode | undefined => {
  if (!node?.parentNode) {
    return undefined;
  }

  return node.yogaNode ?? findClosestYogaNode(node.parentNode);
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
