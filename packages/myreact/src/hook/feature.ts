import { HOOK_TYPE } from "@my-react/react-shared";

import { createRef, currentRenderPlatform } from "../share";

import type { createContext } from "../element";
import type { Action, Reducer } from "../renderHook";

const defaultDeps: unknown[] = [];

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

export const useState = <T = any>(initial: T | (() => T)): [T, (t?: T | ((t: T) => T)) => void] => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useState,
    value: typeof initial === "function" ? initial : () => initial,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as [T, (t?: T | ((t: T) => T)) => void];
};

export const useEffect = (action: () => any, deps?: any[]): void => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as void;
};

export const useLayoutEffect = (action: () => any, deps?: any[]): void => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useLayoutEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as void;
};

export const useCallback = <T extends (...args: any) => any = (...args: any) => any>(callback: T, deps?: any[]): T => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useCallback,
    value: callback,
    reducer: defaultReducer,
    deps,
  }) as T;
};

export const useMemo = <T = any>(action: () => T, deps?: any[]): T => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useMemo,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as T;
};

export const useRef = <T = any>(value: T): { current: T } => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useRef,
    value: createRef(value),
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as { current: T };
};

export const useContext = <T = any>(Context: ReturnType<typeof createContext<T>>): T => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useContext,
    value: Context,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as T;
};

export const useReducer = (reducer: Reducer, initialArgs: any, init?: (...args: any) => any) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useReducer,
    value: typeof init === "function" ? () => init(initialArgs) : () => initialArgs,
    reducer,
    deps: defaultDeps,
  });
};

export const useImperativeHandle = (ref: any, createHandle: Reducer, deps: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useImperativeHandle,
    value: ref,
    reducer: createHandle,
    deps,
  });
};

export const useDebugValue = (...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useDebugValue,
    value: args,
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

export const useSignal = <T = any>(initial: T | (() => T)) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useSignal,
    value: typeof initial === "function" ? initial : () => initial,
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

// TODO
export const useDeferredValue = <T = any>(value: T): T => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useDeferredValue,
    value: value,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as T;
};

export const useId = (): string => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useId,
    value: null,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as string;
};

export const useInsertionEffect = (action: () => any, deps: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useInsertionEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  });
};

export const useSyncExternalStore = (subscribe: () => any, getSnapshot: () => any, getServerSnapshot?: () => any) => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderPlatform.dispatchHook({
    type: HOOK_TYPE.useSyncExternalStore,
    value: { subscribe, getSnapshot, getServerSnapshot },
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

// TODO
export const useTransition = (): [boolean, (cb: () => void) => void] => {
  const renderPlatform = currentRenderPlatform.current;

  if (!renderPlatform)
    throw new Error(
      `current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  const isPending = useRef(false);

  const startTransition = useCallback((cb: () => void) => {
    renderPlatform.yieldTask(() => {
      isPending.current = true;
      cb();
    });
  }, []);

  useEffect(() => {
    isPending.current = false;
  });

  // return renderPlatform.dispatchHook({
  //   type: HOOK_TYPE.useTransition,
  //   value: createRef(false),
  //   reducer: defaultReducer,
  //   deps: defaultDeps,
  // }) as [boolean, (cb: () => void) => void];

  return [isPending.current, startTransition];
};
