import { PATCH_TYPE, STATE_TYPE, ListTree, include, remove } from "@my-react/react-shared";

import { unmountFiberNode } from "../runtimeFiber";
import { fiberToDispatchMap, generateFiberToList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateUnmountMap = (fiber: MyReactFiberNode, unmount: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  const list = map.get(fiber) || new ListTree();

  const newList = generateFiberToList(unmount);

  list.concat(newList);

  map.set(fiber, list);
};

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: CustomRenderDispatch) => {
  list.listToFoot((f) => safeCallWithFiber({ fiber: f, action: () => f._unmount() }));

  // will happen when app crash
  list.listToFoot((f) => unmount(f, renderDispatch));

  list.listToFoot((f) => unmountFiberNode(f, renderDispatch));
};

// unmount current fiber
export const unmountFiber = (fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  const list = generateFiberToList(fiber);

  unmountList(list, renderDispatch);
};

export const unmount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__unmount__)) {
    const unmountMap = renderDispatch.runtimeMap.unmountMap;

    const allUnmount = unmountMap.get(fiber);

    unmountMap.delete(fiber);

    if (allUnmount && allUnmount.length) safeCallWithFiber({ fiber, action: () => unmountList(allUnmount, renderDispatch) });

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__unmount__);
  }
};
