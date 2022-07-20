import { pushEffect, pushLayoutEffect } from '../effect';
import {
  createRef,
  currentFunctionFiber,
  currentHookDeepIndex,
  enableAllCheck,
  getFiberTree,
} from '../share';

import { getHookNode } from './create';
import { HOOK_TYPE } from './instance';

import type { createContext } from '../element';
import type { Reducer, MyReactHookNode } from './instance';

export const useState = <T = any>(initial: T | (() => T)) => {
  const currentHookNode = getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useState,
      value: typeof initial === 'function' ? initial : () => initial,
      reducer: null,
      deps: [],
    },
    currentFunctionFiber.current
  );

  return [currentHookNode.result, currentHookNode.dispatch];
};

export const useEffect = (action: () => any, deps: any[]) => {
  getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useEffect,
      value: action,
      reducer: null,
      deps,
    },
    currentFunctionFiber.current
  );
};

export const useLayoutEffect = (action: () => any, deps: any[]) => {
  getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useLayoutEffect,
      value: action,
      reducer: null,
      deps,
    },
    currentFunctionFiber.current
  );
};

export const useCallback = <
  T extends (...args: any[]) => any = (...args: any[]) => any
>(
  callback: T,
  deps: any[]
) => {
  return getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useCallback,
      value: callback,
      reducer: null,
      deps,
    },
    currentFunctionFiber.current
  ).result;
};

export const useMemo = <T extends () => any = () => any>(
  action: T,
  deps: any[]
) => {
  return getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useMemo,
      value: action,
      reducer: null,
      deps,
    },
    currentFunctionFiber.current
  ).result;
};

export const useRef = <T = any>(value: T) => {
  return getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useRef,
      value: createRef(value),
      reducer: null,
      deps: [],
    },
    currentFunctionFiber.current
  ).result;
};

export const useContext = (Context: ReturnType<typeof createContext>) => {
  return getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useContext,
      value: Context,
      reducer: null,
      deps: [],
    },
    currentFunctionFiber.current
  ).result;
};

export const useReducer = (
  reducer: Reducer,
  initialArgs: any,
  init?: (...args: any) => any
) => {
  const currentHookNode = getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useReducer,
      value:
        typeof init === 'function'
          ? () => init(initialArgs)
          : () => initialArgs,
      reducer,
      deps: [],
    },
    currentFunctionFiber.current
  );

  return [currentHookNode.result, currentHookNode.dispatch];
};

export const useImperativeHandle = (
  ref: any,
  createHandle: Reducer,
  deps: any[]
) => {
  getHookNode(
    {
      hookIndex: currentHookDeepIndex.current++,
      hookType: HOOK_TYPE.useImperativeHandle,
      value: ref,
      reducer: createHandle,
      deps,
    },
    currentFunctionFiber.current
  );
};

export const useDebugValue = (...args: any[]) => {
  if (enableAllCheck.current) {
    console.log(
      `[debug]: `,
      ...args,
      getFiberTree(currentFunctionFiber.current)
    );
  }
};

export const pushHookEffect = (hookNode: MyReactHookNode) => {
  if (!hookNode.__pendingEffect__ && hookNode.__fiber__) {
    hookNode.__pendingEffect__ = true;
    if (hookNode.hookType === HOOK_TYPE.useEffect) {
      pushEffect(hookNode.__fiber__, hookNode);
    } else {
      pushLayoutEffect(hookNode.__fiber__, hookNode);
    }
  }
};
