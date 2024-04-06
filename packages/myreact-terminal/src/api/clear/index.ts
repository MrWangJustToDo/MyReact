import { STATE_TYPE, include } from "@my-react/react-shared";
import { type Node as YogaNode } from "yoga-layout";

import { removeChildNode } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";
import type { DOMNode, PlainElement } from "../native";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const cleanupYogaNode = (node?: YogaNode): void => {
  node?.unsetMeasureFunc();
  node?.freeRecursive();
};

export const clear = (fiber: MyReactFiberNode, renderDispatch: TerminalDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (!fiber.nativeNode) return;

  const parentFiberWithNode = renderDispatch.runtimeDom.elementMap.get(fiber);

  if (parentFiberWithNode.nativeNode) {
    removeChildNode(parentFiberWithNode.nativeNode as PlainElement, fiber.nativeNode as DOMNode);
  }

  cleanupYogaNode(fiber.nativeNode.yogaNode);
};
