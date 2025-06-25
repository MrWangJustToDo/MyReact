import { resolveDispatcher } from "../share";

import type { createContext } from "../element";
import type { Reducer } from "../renderHook";

/**
 * @public
 */
export const useState = <T = any>(initial: T | (() => T)): [T, (t?: T | ((t: T) => T)) => void] => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useState(initial);
};

/**
 * @public
 */
export const useEffect = (action: () => any, deps?: any[]): void => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useEffect(action, deps);
};

/**
 * @public
 */
export const useLayoutEffect = (action: () => any, deps?: any[]): void => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useLayoutEffect(action, deps);
};

/**
 * @public
 */
export const useCallback = <T extends (...args: any) => any = (...args: any) => any>(callback: T, deps?: any[]): T => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useCallback(callback, deps);
};

/**
 * @public
 */
export const useMemo = <T = any>(action: () => T, deps?: any[]): T => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useMemo(action, deps);
};

/**
 * @public
 */
export const useRef = <T = any>(value: T): { current: T } => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useRef(value);
};

/**
 * @public
 */
export const use = <T = any>(Context: ReturnType<typeof createContext<T>> | Promise<T>): T => {
  const dispatcher = resolveDispatcher();

  return dispatcher.use(Context);
};

/**
 * @public
 */
export const useContext = <T = any>(Context: ReturnType<typeof createContext<T>>): T => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useContext(Context);
};

/**
 * @public
 */
export const useReducer = (reducer: Reducer, initialArgs: any, init?: (...args: any) => any) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useReducer(reducer, initialArgs, init);
};

/**
 * @public
 */
export const useImperativeHandle = (ref: any, createHandle: Reducer, deps: any[]) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useImperativeHandle(ref, createHandle, deps);
};

/**
 * @public
 */
export const useDebugValue = (...args: any[]) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useDebugValue(...args);
};

/**
 * @public
 */
export const useSignal = <T = any>(initial: T | (() => T)) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useSignal(initial);
};

// TODO
/**
 * @public
 */
export const useDeferredValue = <T = any>(value: T): T => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useDeferredValue(value);
};

/**
 * @public
 */
export const useId = (): string => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useId();
};

/**
 * @public
 */
export const useInsertionEffect = (action: () => any, deps: any[]) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useInsertionEffect(action, deps);
};

/**
 * @public
 */
export const useSyncExternalStore = (subscribe: () => any, getSnapshot: () => any, getServerSnapshot?: () => any) => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

/**
 * @public
 */
export const useTransition = (): [boolean, (cb: () => void) => void] => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useTransition();
};

/**
 * @public
 */
export const useOptimistic = <S, A>(passthrough: S, reducer?: (p: S, c: A) => S): [S, (p: A) => void] => {
  const dispatcher = resolveDispatcher();

  return dispatcher.useOptimistic(passthrough, reducer);
};
