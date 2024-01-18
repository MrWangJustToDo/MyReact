import { PATCH_TYPE, ListTree, include, remove } from "@my-react/react-shared";

import { unmountList } from "../renderUnmount";
import { generateFiberToList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateUnmountMap = (fiber: MyReactFiberNode, unmount: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  const list = map.get(fiber) || new ListTree();

  const newList = generateFiberToList(unmount);

  map.set(fiber, list.concat(newList));
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
