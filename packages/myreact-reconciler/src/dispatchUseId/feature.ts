import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentHookNodeIndex } = __my_react_internal__;

const isFiberWithUseId = (fiber: MyReactFiberNode) => {
  let withUseId = false;
  if (fiber.type & NODE_TYPE.__function__) {
    fiber.hookList?.listToFoot((h) => {
      if (h.type === HOOK_TYPE.useId) {
        withUseId = true;
      }
    });
  }
  return withUseId;
};

export const defaultGenerateUseIdMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, { initial: number; latest: number }>) => {
  const parent = fiber.parent;

  if (parent) {
    if (isFiberWithUseId(parent)) {
      map.set(fiber, { initial: (map.get(parent)?.initial || 0) + 1, latest: (map.get(parent)?.initial || 0) + 1 });
    } else if (map.get(parent)) {
      map.set(fiber, map.get(parent));
    }
  }
};

export const defaultGetCurrentId = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, { initial: number; latest: number }>) => {
  const config = map.get(fiber);

  if (config) {
    return `${config.latest++}--${currentHookNodeIndex.current}`;
  } else {
    return `0--${currentHookNodeIndex.current}`;
  }
};
