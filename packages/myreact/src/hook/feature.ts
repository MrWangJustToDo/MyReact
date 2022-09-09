import {
  createRef,
  currentFunctionFiber,
  currentHookDeepIndex,
  enableDebugLog,
  getFiberTree,
  globalDispatch,
} from "../share";

import { HOOK_TYPE } from "./symbol";

import type { createContext } from "../element";
import type { MyReactHookNode, Reducer } from "./instance";

export const useState = <T = any>(initial: T | (() => T)) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useState,
    value: typeof initial === "function" ? initial : () => initial,
    reducer: null,
    deps: [],
  }) as MyReactHookNode;

  return [currentHookNode.result, currentHookNode.dispatch];
};

export const useEffect = (action: () => any, deps: any[]) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useEffect,
    value: action,
    reducer: null,
    deps,
  });
};

export const useLayoutEffect = (action: () => any, deps: any[]) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useLayoutEffect,
    value: action,
    reducer: null,
    deps,
  });
};

export const useCallback = <T extends (...args: any[]) => any = (...args: any[]) => any>(callback: T, deps: any[]) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useCallback,
    value: callback,
    reducer: null,
    deps,
  }) as MyReactHookNode;

  return currentHookNode.result;
};

export const useMemo = <T extends () => any = () => any>(action: T, deps: any[]) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useMemo,
    value: action,
    reducer: null,
    deps,
  }) as MyReactHookNode;

  return currentHookNode.result;
};

export const useRef = <T = any>(value: T) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useRef,
    value: createRef(value),
    reducer: null,
    deps: [],
  }) as MyReactHookNode;

  return currentHookNode.result;
};

export const useContext = (Context: ReturnType<typeof createContext>) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useContext,
    value: Context,
    reducer: null,
    deps: [],
  }) as MyReactHookNode;

  return currentHookNode.result;
};

export const useReducer = (reducer: Reducer, initialArgs: any, init?: (...args: any) => any) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  const currentHookNode = globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useReducer,
    value: typeof init === "function" ? () => init(initialArgs) : () => initialArgs,
    reducer,
    deps: [],
  }) as MyReactHookNode;

  return [currentHookNode.result, currentHookNode.dispatch];
};

export const useImperativeHandle = (ref: any, createHandle: Reducer, deps: any[]) => {
  const currentFiber = currentFunctionFiber.current;

  const currentIndex = currentHookDeepIndex.current++;

  globalDispatch.current.resolveHook(currentFiber, {
    hookIndex: currentIndex,
    hookType: HOOK_TYPE.useImperativeHandle,
    value: ref,
    reducer: createHandle,
    deps,
  }) as MyReactHookNode;
};

export const useDebugValue = (...args: any[]) => {
  if (enableDebugLog.current) {
    console.log(`[debug]: `, ...args, getFiberTree(currentFunctionFiber.current));
  }
};
