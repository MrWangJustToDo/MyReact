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

// export const getHookNode = (
//   { hookIndex, hookType, value, reducer, deps }: CreateHookParams,
//   fiber: MyReactFiberNode | null
// ) => {
//   if (!fiber) throw new Error("can not use hook out of component");

//   let currentHook: null | MyReactHookNode = null;

//   if (fiber.hookNodeArray.length > hookIndex) {
//     currentHook = fiber.hookNodeArray[hookIndex];

//     if (currentHook.hookType !== hookType) {
//       const array = fiber.hookTypeArray.slice(0, hookIndex);
//       throw new Error(getHookTree([...array, currentHook.hookType], [...array, hookType]));
//     }

//     currentHook.setOwner(fiber);

//     currentHook.updateResult(value, reducer || defaultReducer, deps);
//   } else if (!(fiber.mode & UPDATE_TYPE.__update__)) {
//     // not a update so it is a initial fiber
//     currentHook = createHookNode({ hookIndex, hookType, value, reducer, deps }, fiber);
//   } else {
//     throw new Error(getHookTree([...fiber.hookTypeArray], [...fiber.hookTypeArray, hookType]));
//   }

//   effect(fiber, currentHook);

//   return currentHook;
// };
