import Yoga from "yoga-layout";

import { type DOMElement } from "./dom.js";
import squashTextNodes from "./squash-text-nodes.js";

export const renderNodeToScreenReaderOutput = (
  node: DOMElement,
  options: {
    parentRole?: string;
    skipStaticElements?: boolean;
  } = {}
): string => {
  if (options.skipStaticElements && node.internal_static) {
    return "";
  }

  if (node.internal_stickyAlternate) {
    return "";
  }

  if (node.yogaNode?.getDisplay() === Yoga.DISPLAY_NONE) {
    return "";
  }

  let output = "";

  if (node.nodeName === "ink-text") {
    output = squashTextNodes(node);
  } else if (node.nodeName === "ink-box" || node.nodeName === "ink-root" || node.nodeName === "ink-static-render") {
    const separator = node.style.flexDirection === "row" || node.style.flexDirection === "row-reverse" ? " " : "\n";

    const childNodes =
      node.style.flexDirection === "row-reverse" || node.style.flexDirection === "column-reverse" ? [...node.childNodes].reverse() : [...node.childNodes];

    output = childNodes
      .map((childNode) => {
        const screenReaderOutput = renderNodeToScreenReaderOutput(childNode as DOMElement, {
          parentRole: node.internal_accessibility?.role,
          skipStaticElements: options.skipStaticElements,
        });
        return screenReaderOutput;
      })
      .filter(Boolean)
      .join(separator);
  }

  if (node.internal_accessibility) {
    const { role, state } = node.internal_accessibility;

    if (state) {
      const stateKeys = Object.keys(state) as Array<keyof typeof state>;
      const stateDescription = stateKeys.filter((key) => state[key]).join(", ");

      if (stateDescription) {
        output = `(${stateDescription}) ${output}`;
      }
    }

    if (role && role !== options.parentRole) {
      output = `${role}: ${output}`;
    }
  }

  return output;
};
