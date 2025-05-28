import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import type { PlainElement, TextElement } from "./native";
import type { CustomRenderDispatch, MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const append = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__append__)) {
    const mayFiberContainer = parentFiberWithDom as MyReactFiberContainer;

    if (!fiber.nativeNode) throw new Error(`[@my-react/react-dom] append error, current render node not have a native node`);

    const parentDom = (parentFiberWithDom?.nativeNode || mayFiberContainer?.containerNode || renderDispatch.rootNode) as PlainElement;

    const currentDom = fiber.nativeNode as PlainElement | TextElement;

    if (currentDom) parentDom.appendChild(currentDom);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);
  }
};
