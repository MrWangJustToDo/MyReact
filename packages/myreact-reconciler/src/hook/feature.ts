import { __my_react_shared__ } from "@my-react/react";

import { createHookNode } from "./create";
import { effect } from "./effect";
import { updateHookNode } from "./update";

import type { CreateHookParams, MyReactFiberNode, MyReactHookNode } from "@my-react/react";

const { logHook } = __my_react_shared__;

export const processHookNode = (
  fiber: MyReactFiberNode | null,
  { hookIndex, hookType, reducer, value, deps }: CreateHookParams
) => {
  if (!fiber) throw new Error("can not use hook outside of component");

  let currentHook: MyReactHookNode | null = null;

  if (fiber.hookNodeArray.length > hookIndex) {
    currentHook = updateHookNode({ hookIndex, hookType, reducer, value, deps }, fiber);
  } else if (!fiber.invoked) {
    currentHook = createHookNode({ hookIndex, hookType, reducer, value, deps }, fiber);
  } else {
    throw new Error(logHook([...fiber.hookTypeArray], [...fiber.hookTypeArray, hookType]));
  }

  effect(fiber, currentHook);

  return currentHook;
};
