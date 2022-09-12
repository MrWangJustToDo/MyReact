import { MyReactHookNode } from "./instance";

import type { MyReactFiberNode } from "../fiber";
import type { Reducer, Action, CreateHookParams } from "./instance";

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const createHookNode = (
  { hookIndex, hookType, value, reducer, deps }: CreateHookParams,
  fiber: MyReactFiberNode
) => {
  const newHookNode = new MyReactHookNode(hookIndex, hookType, value, reducer || defaultReducer, deps);

  newHookNode.setOwner(fiber);

  fiber.addHook(newHookNode);

  if (__DEV__) {
    fiber.checkHook();
  }

  return newHookNode;
};
