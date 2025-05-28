import { PATCH_TYPE, ListTree, include, remove } from "@my-react/react-shared";

import { clearContainer, unmountFiber, unmountList } from "../renderUnmount";
import { generateFiberToUnmountList, safeCallWithCurrentFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateUnmountMap = (fiber: MyReactFiberNode, unmount: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  const list = map.get(fiber) || new ListTree();

  const newList = generateFiberToUnmountList(unmount);

  map.set(fiber, list.concat(newList));
};

export const defaultDispatchUnmount = (renderDispatch: CustomRenderDispatch) => {
  if (renderDispatch.isAppUnmounted) return;

  const rootFiber = renderDispatch.rootFiber;

  unmountFiber(renderDispatch, rootFiber);

  clearContainer(renderDispatch);
};

export const defaultInvokeUnmountList = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__unmount__)) {
    const unmountMap = renderDispatch.runtimeMap.unmountMap;

    const allUnmount = unmountMap.get(fiber);

    unmountMap.delete(fiber);

    if (allUnmount && allUnmount.length)
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallUnmountList() {
          unmountList(renderDispatch, allUnmount);
        },
      });

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__unmount__);
  }
};
