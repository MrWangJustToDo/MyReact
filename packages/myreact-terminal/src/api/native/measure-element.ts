import { measureText } from "./measure-text";
import { squashTextNodes } from "./squash-text-nodes";
import { TextType } from "./text";
import { wrapText } from "./wrap-text";

import type { DOMNode } from "./dom";
import type { PlainElement } from "./plain";

type Output = {
  /**
   * Element width.
   */
  width: number;

  /**
   * Element height.
   */
  height: number;
};

/**
 * Measure the dimensions of a particular `<Box>` element.
 */
export const measureElement = (node: PlainElement): Output => ({
  width: node.yogaNode?.getComputedWidth() ?? 0,
  height: node.yogaNode?.getComputedHeight() ?? 0,
});

export const measureTextElement = (node: DOMNode, width: number) => {
  const text = node.nodeName === TextType ? node.nodeValue : squashTextNodes(node);

  const dimensions = measureText(text);

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

  const wrappedText = wrapText(text, width, textWrap);

  return measureText(wrappedText);
};
