import { PATCH_TYPE } from "@my-react/react-shared";

import { unmountFiberNode } from "../runtimeFiber";
import { generateFiberToList } from "../share";

import { flatten } from "./tools";

import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export const defaultGenerateUnmountArrayMap = (
  fiber: MyReactFiberNode,
  unmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>,
  map: WeakMap<MyReactFiberNode, Array<ListTree<MyReactFiberNode>>>
) => {
  const allUnmount = flatten(unmount);

  const exist = map.get(fiber) || [];

  const newPending = allUnmount.map(generateFiberToList);

  exist.push(...newPending);

  map.set(fiber, exist);
};

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: RenderDispatch, renderPlatform: RenderPlatform) => {
  list.listToFoot((f) => f._unmount());

  list.listToFoot((f) => renderPlatform.unsetRef(f));

  if (list.head.value) renderPlatform.clearNode(list.head.value);

  list.listToFoot((f) => unmountFiberNode(f));
};

export const unmountFiber = (fiber: MyReactFiberNode) => {
  const list = generateFiberToList(fiber);

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  unmountList(list, renderDispatch, renderPlatform);
};

export const unmount = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingUnmount__) {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

    const unmountMap = renderDispatch.unmountMap;

    const allUnmountFiber = unmountMap.get(fiber) || [];

    unmountMap.delete(fiber);

    if (allUnmountFiber.length) allUnmountFiber.forEach((l) => unmountList(l, renderDispatch, renderPlatform));

    if (fiber.patch & PATCH_TYPE.__pendingUnmount__) fiber.patch ^= PATCH_TYPE.__pendingUnmount__;
  }
};
