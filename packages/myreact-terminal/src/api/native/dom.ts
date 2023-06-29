import { type Node as YogaNode } from "yoga-wasm-web/auto";

import type { PlainElement } from "./plain";
import type { TextElement } from "./text";

export type DOMNode = PlainElement | TextElement;

export const appendChildNode = (node: PlainElement, childNode: DOMNode): void => {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode);
  }

  childNode.parentNode = node;
  node.childNodes.push(childNode);

  if (childNode.yogaNode) {
    node.yogaNode?.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
  }

  if (node.nodeName === "terminal-text" || node.nodeName === "terminal-virtual-text") {
    markNodeAsDirty(node);
  }
};

export const insertBeforeNode = (node: PlainElement, newChildNode: DOMNode, beforeChildNode: DOMNode): void => {
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

  if (node.nodeName === "terminal-text" || node.nodeName === "terminal-virtual-text") {
    markNodeAsDirty(node);
  }
};

export const removeChildNode = (node: PlainElement, removeNode: DOMNode): void => {
  if (removeNode.yogaNode) {
    removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
  }

  removeNode.parentNode = undefined;

  const index = node.childNodes.indexOf(removeNode);
  if (index >= 0) {
    node.childNodes.splice(index, 1);
  }

  if (node.nodeName === "terminal-text" || node.nodeName === "terminal-virtual-text") {
    markNodeAsDirty(node);
  }
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

export const setTextNodeValue = (node: TextElement, text: string): void => {
	node.nodeValue = text.toString();

	markNodeAsDirty(node);
};
