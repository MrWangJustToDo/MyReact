import { PATCH_TYPE, ListTree, include, remove } from "@my-react/react-shared";

import { clearContainer, unmountFiber } from "../renderUnmount";
import { safeCallWithCurrentFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultGenerateUnmountMap = (fiber: MyReactFiberNode, unmount: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  let list = map.get(fiber);

  if (!list) {
    list = new ListTree<MyReactFiberNode>();

    map.set(fiber, list);
  }

  list.push(unmount);
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

    if (allUnmount && allUnmount.length) {
      allUnmount.listToFoot(function invokeUnmountFromCurrent(unmount) {
        safeCallWithCurrentFiber({
          fiber: unmount,
          action: function safeCallUnmountFromCurrent() {
            unmountFiber(renderDispatch, unmount);
          },
        });
      });
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__unmount__);
  }
};
