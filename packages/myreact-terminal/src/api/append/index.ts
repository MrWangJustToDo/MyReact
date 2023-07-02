import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "../../shared";
import { appendChildNode, type PlainElement, type TextElement } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const append = (fiber: MyReactFiberNode, renderDispatch: TerminalDispatch) => {
  if (fiber.patch & PATCH_TYPE.__append__) {
    let parentFiberWithNode = renderDispatch.runtimeDom.elementMap.get(fiber);

    if (!parentFiberWithNode || parentFiberWithNode.state & STATE_TYPE.__unmount__) {
      parentFiberWithNode = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      renderDispatch.runtimeDom.elementMap.set(fiber, parentFiberWithNode);
    }

    const mayFiberContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!fiber.nativeNode) throw new Error(`append error, current render node not have a native node`);

    if (!parentFiberWithNode.nativeNode && !mayFiberContainer.containerNode) {
      throw new Error(`append error, current render node not have a container node`);
    }

    const parentDom = (parentFiberWithNode.nativeNode || mayFiberContainer.containerNode) as PlainElement;

    const currentDom = fiber.nativeNode as PlainElement | TextElement;

    if (currentDom) appendChildNode(parentDom, currentDom);

    if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
  }
};
