import { PATCH_TYPE } from "@my-react/react-shared";

import type { PlainElement, TextElement } from "./native";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__append__) {
    if (!fiber.nativeNode || !parentFiberWithDom.nativeNode) throw new Error("append error");

    const parentDom = parentFiberWithDom.nativeNode as PlainElement;

    const currentDom = fiber.nativeNode as PlainElement | TextElement;

    if (currentDom) parentDom.appendChild(currentDom);

    if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
  }
};
