import { type DOMElement } from "./dom";
import { type CharOffsetMap } from "./measure-text";

export type { CharOffsetMap, CharOffsetRange } from "./measure-text";

// Squashing text nodes allows to combine multiple text nodes into one and write
// to `Output` instance only once. For example, <Text>hello{' '}world</Text>
// is actually 3 text nodes, which would result 3 writes to `Output`.
//
// Also, this is necessary for libraries like ink-link (https://github.com/sindresorhus/ink-link),
// which need to wrap all children at once, instead of wrapping 3 text nodes separately.
const squashTextNodes = (node: DOMElement): string => {
  const map: CharOffsetMap = new Map();
  const offsetRef = { current: 0 };

  return squashTextNodesWithMap(node, map, offsetRef);
};

/**
 * Squash text nodes with character offset mapping.
 * This variant builds a CharOffsetMap that tracks the character position
 * of each DOM node within the squashed text, used for text selection.
 *
 * The character counting method matches getPositionAtOffset() in measure-text.ts,
 * ensuring consistent cursor and selection position calculations.
 */
export const squashTextNodesWithMap = (node: DOMElement, map: CharOffsetMap, offsetRef: { current: number }): string => {
  let text = "";

  for (let index = 0; index < node.childNodes.length; index++) {
    const childNode = node.childNodes[index];

    if (childNode === undefined) {
      continue;
    }

    let nodeText = "";
    const startOffset = offsetRef.current;

    if (childNode.nodeName === "#text") {
      nodeText = childNode.nodeValue;
      map.set(childNode, {
        start: startOffset,
        end: startOffset + nodeText.length,
      });
      offsetRef.current += nodeText.length;
    } else {
      if (childNode.nodeName === "ink-text" || childNode.nodeName === "ink-virtual-text") {
        nodeText = squashTextNodesWithMap(childNode, map, offsetRef);
        map.set(childNode, {
          start: startOffset,
          end: offsetRef.current,
        });
      }

      // Since these text nodes are being concatenated, `Output` instance won't be able to
      // apply children transform, so we have to do it manually here for each text node
      if (nodeText.length > 0 && typeof childNode.internal_transform === "function") {
        nodeText = childNode.internal_transform(nodeText, index);
      }
    }

    text += nodeText;
  }

  return text;
};

export default squashTextNodes;
