import { safeCallWithCurrentFiber } from "@my-react/react-reconciler";
import indentString from "indent-string";
import widestLine from "widest-line";
import Yoga from "yoga-layout";

import { squashTextNodes, getMaxWidth, wrapText } from "../native";

import { renderBorder } from "./render-border";

import type { Output } from "./output";
import type { ContainerElement, PlainElement } from "../native";

// If parent container is `<Box>`, text nodes will be treated as separate nodes in
// the tree and will have their own coordinates in the layout.
// To ensure text nodes are aligned correctly, take X and Y of the first text node
// and use it as offset for the rest of the nodes
// Only first node is taken into account, because other text nodes can't have margin or padding,
// so their coordinates will be relative to the first node anyway
const applyPaddingToText = (node: PlainElement, text: string): string => {
  const yogaNode = node.childNodes[0]?.yogaNode;

  if (yogaNode) {
    const offsetX = yogaNode.getComputedLeft();
    const offsetY = yogaNode.getComputedTop();
    text = "\n".repeat(offsetY) + indentString(text, offsetX);
  }

  return text;
};

export type OutputTransformer = (s: string, index: number) => string;

// After nodes are laid out, render each to output object, which later gets rendered to terminal
const _renderNodeToOutput = (
  node: PlainElement | ContainerElement,
  output: Output,
  options: {
    offsetX?: number;
    offsetY?: number;
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
  }
) => {
  const { offsetX = 0, offsetY = 0, transformers = [], skipStaticElements } = options;

  if (skipStaticElements && node.internal_static) {
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

    // Transformers are functions that transform final text output of each component
    // See Output class for logic that applies transformers
    let newTransformers = transformers;

    if (typeof node.internal_transform === "function") {
      newTransformers = [node.internal_transform, ...transformers];
    }

    if (node.nodeName === "terminal-text") {
      let text = squashTextNodes(node);

      if (text.length > 0) {
        const currentWidth = widestLine(text);
        const maxWidth = getMaxWidth(yogaNode);

        if (currentWidth > maxWidth) {
          const textWrap = node.style.textWrap ?? "wrap";
          text = wrapText(text, maxWidth, textWrap);
        }

        text = applyPaddingToText(node, text);

        output.write(x, y, text, { transformers: newTransformers });
      }

      return;
    }

    let clipped = false;

    if (node.nodeName === "terminal-box") {
      renderBorder(x, y, node, output);

      const clipHorizontally = node.style.overflowX === "hidden" || node.style.overflow === "hidden";
      const clipVertically = node.style.overflowY === "hidden" || node.style.overflow === "hidden";

      if (clipHorizontally || clipVertically) {
        const x1 = clipHorizontally ? x + yogaNode.getComputedBorder(Yoga.EDGE_LEFT) : undefined;

        const x2 = clipHorizontally ? x + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT) : undefined;

        const y1 = clipVertically ? y + yogaNode.getComputedBorder(Yoga.EDGE_TOP) : undefined;

        const y2 = clipVertically ? y + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM) : undefined;

        output.clip({ x1, x2, y1, y2 });
        clipped = true;
      }
    }

    if (node.nodeName === "terminal-root" || node.nodeName === "terminal-box") {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode as PlainElement, output, {
          offsetX: x,
          offsetY: y,
          transformers: newTransformers,
          skipStaticElements,
        });
      }

      if (clipped) {
        output.unclip();
      }
    }
  }
};

export const renderNodeToOutput = (
  node: PlainElement | ContainerElement,
  output: Output,
  options: {
    offsetX?: number;
    offsetY?: number;
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
  }
) => {
  safeCallWithCurrentFiber({ fiber: node.__fiber__, action: () => _renderNodeToOutput(node, output, options) });
};
