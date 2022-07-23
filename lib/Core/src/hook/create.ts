import { getHookTree } from '../share';

import { effect } from './effect';
import { MyReactHookNode } from './instance';

import type { MyReactFiberNode } from '../fiber';
import type { Reducer, Action, HOOK_TYPE } from './instance';

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === 'function' ? action(state) : action;
};

type CreateHookParams = {
  hookIndex: number;
  hookType: HOOK_TYPE;
  value: unknown;
  reducer: Reducer | null;
  deps: unknown[];
};

export const createHookNode = (
  { hookIndex, hookType, value, reducer, deps }: CreateHookParams,
  fiber: MyReactFiberNode
) => {
  const newHookNode = new MyReactHookNode(
    hookIndex,
    hookType,
    value,
    reducer || defaultReducer,
    deps
  );

  newHookNode.setFiber(fiber);

  fiber.addHook(newHookNode);

  fiber.checkHook(newHookNode);

  newHookNode.initialResult();

  return newHookNode;
};

export const getHookNode = (
  { hookIndex, hookType, value, reducer, deps }: CreateHookParams,
  fiber: MyReactFiberNode | null
) => {
  if (!fiber) throw new Error('can not use hook out of component');

  let currentHook: null | MyReactHookNode = null;
  if (fiber.hookList.length > hookIndex) {
    currentHook = fiber.hookList[hookIndex];

    if (currentHook.hookType !== hookType) {
      const array = fiber.hookType.slice(0, hookIndex);
      throw new Error(
        getHookTree([...array, currentHook.hookType], [...array, hookType])
      );
    }

    currentHook.setFiber(fiber);

    currentHook.updateResult(value, reducer || defaultReducer, deps);
  } else if (!fiber.__isUpdateRender__) {
    currentHook = createHookNode(
      { hookIndex, hookType, value, reducer, deps },
      fiber
    );
  } else {
    throw new Error(
      getHookTree([...fiber.hookType], [...fiber.hookType, hookType])
    );
  }

  effect(fiber, currentHook);

  return currentHook;
};
