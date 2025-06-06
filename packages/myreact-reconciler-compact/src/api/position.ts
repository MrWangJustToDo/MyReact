import { NODE_TYPE } from "@my-react/react-reconciler";
import { exclude, include, PATCH_TYPE, remove } from "@my-react/react-shared";

import { getInsertBeforeNodeFromSiblingAndParent, getValidParentFiberWithNode } from "../dispatchMap";

import type { ReconcilerDispatch } from "../dispatch";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

const append = (dispatch: ReconcilerDispatch, config: any, fiber: MyReactFiberNode, parentFiberWithNode: MyReactFiberNode | null) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__)) {
    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    const maybeFiber = parentFiberWithNode as MyReactFiberNode;

    // const parentNode = config?.getPublicInstance?.(maybeFiber?.nativeNode || maybeContainer?.containerNode);
    const parentNode = maybeFiber?.nativeNode || maybeContainer?.containerNode;

    // const rootNode = config?.getPublicInstance?.(dispatch.rootNode);
    const rootNode = dispatch.rootNode;

    // const childNode = config?.getPublicInstance?.(fiber.nativeNode);
    const childNode = fiber.nativeNode;

    const isContainer = !parentNode || (parentNode && parentNode === maybeContainer?.containerNode);

    if (isContainer) {
      if (config.appendChildToContainer) {
        config.appendChildToContainer?.(rootNode, childNode, fiber);
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
    append(dispatch, config, child, parentFiberWithNode);

    child = child.sibling;
  }
};

const insertBefore = (
  dispatch: ReconcilerDispatch,
  config: any,
  fiber: MyReactFiberNode,
  beforeFiberWithNode: MyReactFiberNode,
  parentFiberWithNode: MyReactFiberNode | null
) => {
  if (!fiber) throw new Error("position error, look like a bug for @my-react");

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);

  fiber.patch = remove(fiber.patch, PATCH_TYPE.__position__);

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  if (include(fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__text__)) {
    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    const maybeFiber = parentFiberWithNode as MyReactFiberNode;

    // const parentNode = config?.getPublicInstance?.(maybeFiber?.nativeNode || maybeContainer?.containerNode);
    const parentNode = maybeFiber?.nativeNode || maybeContainer?.containerNode;

    // const rootNode = config?.getPublicInstance?.(dispatch.rootNode);
    const rootNode = dispatch.rootNode;

    // the before dom will not have containerNode
    // const beforeNode = config?.getPublicInstance?.(beforeFiberWithNode.nativeNode);
    const beforeNode = beforeFiberWithNode.nativeNode;

    if (__DEV__ && !beforeNode) {
      console.error("not have a before node, look like a bug for @my-react");
    }

    // const childNode = config?.getPublicInstance?.(fiber.nativeNode);
    const childNode = fiber.nativeNode;

    const isContainer = !parentNode || (parentNode && parentNode === maybeContainer?.containerNode);

    if (isContainer) {
      if (config.insertInContainerBefore) {
        config.insertInContainerBefore?.(rootNode, childNode, beforeNode, fiber);
      } else {
        config.insertBefore?.(rootNode, childNode, beforeNode, fiber);
      }
    } else {
      config.insertBefore?.(parentNode, childNode, beforeNode, fiber);
    }

    return;
  }

  let child = fiber.child;

  while (child) {
    insertBefore(dispatch, config, child, beforeFiberWithNode, parentFiberWithNode);

    child = child.sibling;
  }
};

export const position = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode, _config: any) => {
  if (!include(_fiber.patch, PATCH_TYPE.__position__)) return;

  const rootFiber = _dispatch.rootFiber;

  const parentFiberWithNode = getValidParentFiberWithNode(_dispatch, _fiber);

  const beforeFiberWithNode = getInsertBeforeNodeFromSiblingAndParent(_fiber, parentFiberWithNode || rootFiber);

  if (beforeFiberWithNode && exclude(beforeFiberWithNode.patch, PATCH_TYPE.__append__ | PATCH_TYPE.__position__)) {
    insertBefore(_dispatch, _config, _fiber, beforeFiberWithNode, parentFiberWithNode);
  } else {
    append(_dispatch, _config, _fiber, parentFiberWithNode);
  }

  _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__position__);
};
