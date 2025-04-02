import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { NODE_TYPE } from "../../share";

import type { MyReactFiberNode, MyReactFiberContainer } from "../../runtimeFiber";
import type { ReconcilerDispatch } from "../dispatch";

export const insertBefore = (
  fiber: MyReactFiberNode,
  beforeFiberWithNode: MyReactFiberNode,
  parentFiberWithNode: MyReactFiberNode | null,
  dispatch: ReconcilerDispatch,
  config: any
) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    const maybeFiber = parentFiberWithNode as MyReactFiberNode;

    const parentNode = config?.getPublicInstance?.(maybeFiber?.nativeNode || maybeContainer?.containerNode);

    const rootNode = config?.getPublicInstance?.(dispatch.rootNode);

    // the before dom will not have containerNode
    const beforeNode = config?.getPublicInstance?.(beforeFiberWithNode.nativeNode);

    if (__DEV__ && !beforeNode) {
      console.error("not have a before node, look like a bug for @my-react");
    }

    const childNode = config?.getPublicInstance?.(fiber.nativeNode);

    if (!parentNode) {
      config.insertInContainerBefore?.(rootNode, childNode, beforeNode, fiber);
    } else {
      config.insertBefore?.(parentNode, childNode, beforeNode, fiber);
    }

    return;
  }

  let child = fiber.child;

  while (child) {
    insertBefore(child, beforeFiberWithNode, parentFiberWithNode, dispatch, config);

    child = child.sibling;
  }
};
