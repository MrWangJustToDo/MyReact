import type { PlainElement } from "./plain";

// Squashing text nodes allows to combine multiple text nodes into one and write
// to `Output` instance only once. For example, <Text>hello{' '}world</Text>
// is actually 3 text nodes, which would result 3 writes to `Output`.
//
// Also, this is necessary for libraries like ink-link (https://github.com/sindresorhus/ink-link),

// which need to wrap all children at once, instead of wrapping 3 text nodes separately.
export const squashTextNodes = (node: PlainElement): string => {
  let text = "";

  for (let index = 0; index < node.childNodes.length; index++) {
    const childNode = node.childNodes[index];

    if (childNode === undefined) {
      continue;
    }

    let nodeText = "";

    if (childNode.nodeName === "#text") {
      nodeText = childNode.nodeValue;
    } else {
      if (childNode.nodeName === "terminal-text" || childNode.nodeName === "terminal-virtual-text") {
        nodeText = squashTextNodes(childNode);
      }

      // Since these text nodes are being concatenated, `Output` instance won't be able to
      // apply children transform, so we have to do it manually here for each text node
      if (nodeText.length > 0 && typeof childNode.internal_transform === "function") {
        nodeText = childNode.internal_transform(nodeText, index);
      }
    }

    text += nodeText;
  }

  if (typeof node.internal_transform === "function") {
    text = node.internal_transform(text, 0);
  }

  return text;
};
