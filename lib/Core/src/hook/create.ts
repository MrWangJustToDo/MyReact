import { getHookTree } from '../share';

import { pushHookEffect } from './feature';
import { MyReactHookNode } from './instance';

import type { MyReactFiberNode } from '../fiber';
import type { HOOK_TYPE, Reducer, Action } from './instance';

const defaultReducer: Reducer = (state?: any, action?: Action) => {
  return typeof action === 'function' ? action(state) : action;
};

type CreateHookParams = {
  hookIndex: number;
  hookType: HOOK_TYPE;
  value: any;
  reducer: Reducer | null;
  deps: any[];
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
  } else if (!fiber.__isUpdateRender__ || fiber.__isIgnoreHook__) {
    currentHook = createHookNode(
      { hookIndex, hookType, value, reducer, deps },
      fiber
    );
  } else {
    throw new Error(
      getHookTree([...fiber.hookType], [...fiber.hookType, hookType])
    );
  }

  if (currentHook.effect) {
    pushHookEffect(currentHook);
  }

  return currentHook;
};
