import { STATE_TYPE, include } from "@my-react/react-shared";
import { type Node as YogaNode } from "yoga-layout";

import { TextType, removeChildNode } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";
import type { DOMNode, PlainElement, TextElement } from "../native";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const clear = (fiber: MyReactFiberNode, renderDispatch: TerminalDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (!fiber.nativeNode) return;

  const typeNativeNode = fiber.nativeNode as PlainElement | TextElement;

  const yogaNode = fiber.nativeNode?.yogaNode as YogaNode;

  if (!typeNativeNode.parentNode) return;

  const parentFiberWithNode = renderDispatch.runtimeDom.elementMap.get(fiber);

  if (parentFiberWithNode?.nativeNode) {
    removeChildNode(parentFiberWithNode.nativeNode as PlainElement, fiber.nativeNode as DOMNode);
  }

  if (typeNativeNode.nodeName !== TextType) {
    typeNativeNode.childNodes.forEach((node) => {
      removeChildNode(typeNativeNode, node);
    });
  }

  try {
    yogaNode?.unsetMeasureFunc();

    yogaNode?.freeRecursive();
  } catch (e) {
    console.log(e);
    // throw e;
  }
};
