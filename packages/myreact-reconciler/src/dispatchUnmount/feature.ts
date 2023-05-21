import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { unmountFiberNode } from "../runtimeFiber";
import { fiberToDispatchMap, generateFiberToList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

export const defaultGenerateUnmountMap = (
  fiber: MyReactFiberNode,
  unmount: MyReactFiberNode,
  map: WeakMap<MyReactFiberNode, Array<ListTree<MyReactFiberNode>>>
) => {
  const exist = map.get(fiber) || [];

  const newPending = generateFiberToList(unmount);

  exist.push(newPending);

  map.set(fiber, exist);
};

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: CustomRenderDispatch) => {
  list.listToFoot((f) => f._unmount());

  if (list.head.value) renderDispatch.commitClearNode(list.head.value);

  list.listToFoot((f) => unmountFiberNode(f, renderDispatch));
};

// unmount current fiber
export const unmountFiber = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  const list = generateFiberToList(fiber);

  unmountList(list, renderDispatch);
};

export const unmount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (fiber.patch & PATCH_TYPE.__unmount__) {
    const unmountMap = renderDispatch.runtimeMap.unmountMap;

    const allUnmountFiber = unmountMap.get(fiber) || [];

    unmountMap.delete(fiber);

    if (allUnmountFiber.length) safeCallWithFiber({ fiber, action: () => allUnmountFiber.forEach((l) => unmountList(l, renderDispatch)) });

    if (fiber.patch & PATCH_TYPE.__unmount__) fiber.patch ^= PATCH_TYPE.__unmount__;
  }
};
