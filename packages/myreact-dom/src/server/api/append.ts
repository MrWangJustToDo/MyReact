import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import type { PlainElement, TextElement } from "./native";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__append__)) {
    const mayFiberContainer = parentFiberWithDom as MyReactFiberContainer;

    if (!fiber.nativeNode) throw new Error(`[@my-react/react-dom] append error, current render node not have a native node`);

    if (!parentFiberWithDom.nativeNode && !mayFiberContainer.containerNode) {
      throw new Error(`[@my-react/react-dom] append error, current render node not have a container node`);
    }

    const parentDom = (parentFiberWithDom.nativeNode || mayFiberContainer.containerNode) as PlainElement;

    const currentDom = fiber.nativeNode as PlainElement | TextElement;

    if (currentDom) parentDom.appendChild(currentDom);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);
  }
};
