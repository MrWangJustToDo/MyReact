import { HOOK_TYPE, isPromise } from "@my-react/react-shared";

import { createRef, currentScheduler } from ".";

import type { createContext } from "../element";
import type { Action, Reducer } from "../renderHook";

const defaultDeps: unknown[] = [];

const defaultReducer: Reducer = (state?: unknown, action?: Action) => {
  return typeof action === "function" ? action(state) : action;
};

/**
 * @public
 */
export const useStateHook = <T = any>(initial: T | (() => T)): [T, (t?: T | ((t: T) => T)) => void] => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useState,
    value:
      typeof initial === "function"
        ? initial
        : function initState() {
            return initial;
          },
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as [T, (t?: T | ((t: T) => T)) => void];
};

/**
 * @public
 */
export const useEffectHook = (action: () => any, deps?: any[]): void => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as void;
};

/**
 * @public
 */
export const useLayoutEffectHook = (action: () => any, deps?: any[]): void => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useLayoutEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as void;
};

/**
 * @public
 */
export const useCallbackHook = <T extends (...args: any) => any = (...args: any) => any>(callback: T, deps?: any[]): T => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useCallback,
    value: callback,
    reducer: defaultReducer,
    deps,
  }) as T;
};

/**
 * @public
 */
export const useMemoHook = <T = any>(action: () => T, deps?: any[]): T => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useMemo,
    value: action,
    reducer: defaultReducer,
    deps,
  }) as T;
};

/**
 * @public
 */
export const useRefHook = <T = any>(value: T): { current: T } => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useRef,
    value: createRef(value),
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as { current: T };
};

/**
 * @public
 */
export const useFunc = <T = any>(Context: ReturnType<typeof createContext<T>> | Promise<T>): T => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  if (isPromise(Context)) {
    return renderScheduler.readPromise(Context) as T;
  } else {
    return renderScheduler.readContext(Context) as T;
  }
};

/**
 * @public
 */
export const useContextHook = <T = any>(Context: ReturnType<typeof createContext<T>>): T => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useContext,
    value: Context,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as T;
};

/**
 * @public
 */
export const useReducerHook = (reducer: Reducer, initialArgs: any, init?: (...args: any) => any) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useReducer,
    value:
      typeof init === "function"
        ? function initReducer() {
            return init(initialArgs);
          }
        : function initReducer() {
            return initialArgs;
          },
    reducer,
    deps: defaultDeps,
  });
};

/**
 * @public
 */
export const useImperativeHandleHook = (ref: any, createHandle: Reducer, deps: any[]) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useImperativeHandle,
    value: ref,
    reducer: createHandle,
    deps,
  });
};

/**
 * @public
 */
export const useDebugValueHook = (...args: any[]) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useDebugValue,
    value: args,
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

/**
 * @public
 */
export const useSignalHook = <T = any>(initial: T | (() => T)) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useSignal,
    value:
      typeof initial === "function"
        ? initial
        : function initSignal() {
            return initial;
          },
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

// TODO
/**
 * @public
 */
export const useDeferredValueHook = <T = any>(value: T): T => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useDeferredValue,
    value: value,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as T;
};

/**
 * @public
 */
export const useIdHook = (): string => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useId,
    value: 0,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as string;
};

/**
 * @public
 */
export const useInsertionEffectHook = (action: () => any, deps: any[]) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useInsertionEffect,
    value: action,
    reducer: defaultReducer,
    deps,
  });
};

/**
 * @public
 */
export const useSyncExternalStoreHook = (subscribe: () => any, getSnapshot: () => any, getServerSnapshot?: () => any) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useSyncExternalStore,
    value: { subscribe, getSnapshot, getServerSnapshot },
    reducer: defaultReducer,
    deps: defaultDeps,
  });
};

/**
 * @public
 */
export const useTransitionHook = (): [boolean, (cb: () => void) => void] => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useTransition,
    value: null,
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as [boolean, (cb: () => void) => void];
};

/**
 * @public
 */
export const useOptimisticHook = <S, A>(passthrough: S, reducer?: (p: S, c: A) => S): [S, (p: A) => void] => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler)
    throw new Error(
      `[@my-react/react] current hook statement have been invoke in a invalid environment, you may: \n 1. using hook in a wrong way \n 2. current environment have multiple "@my-react/react" package \n 3. current environment not have a valid "Platform" package`
    );

  return renderScheduler.dispatchHook({
    type: HOOK_TYPE.useOptimistic,
    value: { value: passthrough, reducer },
    reducer: defaultReducer,
    deps: defaultDeps,
  }) as [S, (p: A) => void];
};
