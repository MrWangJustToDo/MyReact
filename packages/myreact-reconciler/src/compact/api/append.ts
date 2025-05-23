import { include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { NODE_TYPE } from "../../share";

import type { MyReactFiberNode, MyReactFiberContainer } from "../../runtimeFiber";
import type { ReconcilerDispatch } from "../dispatch";

export const append = (fiber: MyReactFiberNode, parentFiberWithNode: MyReactFiberNode | null, dispatch: ReconcilerDispatch, config: any) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__)) {
    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    const maybeFiber = parentFiberWithNode as MyReactFiberNode;

    const parentNode = config?.getPublicInstance?.(maybeFiber?.nativeNode || maybeContainer?.containerNode);

    const rootNode = config?.getPublicInstance?.(dispatch.rootNode);

    const childNode = config?.getPublicInstance?.(fiber.nativeNode);

    if (!parentNode) {
      if (config.appendInContainer) {
        config.appendInContainer?.(rootNode, childNode, fiber);
      } else {
        config.appendChild?.(rootNode, childNode, fiber);
      }
    } else {
      config.appendChild?.(parentNode, childNode, fiber);
    }
    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentFiberWithNode, dispatch, config);

    child = child.sibling;
  }
};