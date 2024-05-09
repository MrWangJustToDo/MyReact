import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { getValidParentFiberWithNode } from "../../shared";
import { appendChildNode, type PlainElement, type TextElement } from "../native";

import type { TerminalDispatch } from "../../renderDispatch";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const append = (fiber: MyReactFiberNode, renderDispatch: TerminalDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__append__)) {
    const parentFiberWithNode = getValidParentFiberWithNode(fiber, renderDispatch);

    const mayFiberContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!fiber.nativeNode) throw new Error(`append error, current render node not have a native node`);

    if (!parentFiberWithNode.nativeNode && !mayFiberContainer.containerNode) {
      throw new Error(`append error, current render node not have a container node`);
    }

    const parentDom = (parentFiberWithNode.nativeNode || mayFiberContainer.containerNode) as PlainElement;

    const currentDom = fiber.nativeNode as PlainElement | TextElement;

    if (currentDom) appendChildNode(parentDom, currentDom);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);
  }
};
