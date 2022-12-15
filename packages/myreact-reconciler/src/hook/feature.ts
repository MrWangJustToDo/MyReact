import { __my_react_shared__ } from "@my-react/react";

import { createHookNode } from "./create";
import { effect } from "./effect";
import { updateHookNode } from "./update";

import type { CreateHookParams, MyReactFiberNode, MyReactHookNode } from "@my-react/react";

const { getHookTree } = __my_react_shared__;

export const processHookNode = (fiber: MyReactFiberNode | null, { hookIndex, hookType, reducer, value, deps }: CreateHookParams) => {
  if (!fiber) throw new Error("can not use hook outside of component");

  let currentHook: MyReactHookNode | null = null;

  if (fiber.hookNodes.length > hookIndex) {
    currentHook = updateHookNode({ hookIndex, hookType, reducer, value, deps }, fiber);
  } else if (!fiber.isInvoked) {
    currentHook = createHookNode({ hookIndex, hookType, reducer, value, deps }, fiber);
  } else {
    throw new Error(getHookTree(fiber.hookNodes, hookIndex, hookType));
  }

  effect(fiber, currentHook);

  return currentHook;
};
