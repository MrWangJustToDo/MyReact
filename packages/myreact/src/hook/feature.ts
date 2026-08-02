import { resolveDispatcher } from "../share";

import type { createContext } from "../element";
import type { Reducer } from "../renderHook";

/**
 * @public
 */
export function useState<T = any>(initial: T | (() => T)): [T, (t?: T | ((t: T) => T)) => void] {
  const dispatcher = resolveDispatcher();

  return dispatcher.useState(initial);
}

/**
 * @public
 */
export function useEffect(action: () => any, deps?: any[]): void {
  const dispatcher = resolveDispatcher();

  return dispatcher.useEffect(action, deps);
}

/**
 * @public
 */
export function useLayoutEffect(action: () => any, deps?: any[]): void {
  const dispatcher = resolveDispatcher();

  return dispatcher.useLayoutEffect(action, deps);
}

/**
 * @public
 */
export function useCallback<T extends (...args: any) => any = (...args: any) => any>(callback: T, deps?: any[]): T {
  const dispatcher = resolveDispatcher();

  return dispatcher.useCallback(callback, deps);
}

/**
 * @public
 */
export function useMemo<T = any>(action: () => T, deps?: any[]): T {
  const dispatcher = resolveDispatcher();

  return dispatcher.useMemo(action, deps);
}

/**
 * @public
 */
export function useRef<T = any>(value: T): { current: T } {
  const dispatcher = resolveDispatcher();

  return dispatcher.useRef(value);
}

/**
 * @public
 */
export function use<T = any>(Context: ReturnType<typeof createContext<T>> | Promise<T>): T {
  const dispatcher = resolveDispatcher();

  return dispatcher.use(Context);
}

/**
 * @public
 */
export function useContext<T = any>(Context: ReturnType<typeof createContext<T>>): T {
  const dispatcher = resolveDispatcher();

  return dispatcher.useContext(Context);
}

/**
 * @public
 */
export function useReducer(reducer: Reducer, initialArgs: any, init?: (...args: any) => any) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useReducer(reducer, initialArgs, init);
}

/**
 * @public
 */
export function useImperativeHandle(ref: any, createHandle: Reducer, deps: any[]) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useImperativeHandle(ref, createHandle, deps);
}

/**
 * @public
 */
export function useDebugValue(...args: any[]) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useDebugValue(...args);
}

/**
 * @public
 */
export function useSignal<T = any>(initial: T | (() => T)) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useSignal(initial);
}

// TODO
/**
 * @public
 */
export function useDeferredValue<T = any>(value: T): T {
  const dispatcher = resolveDispatcher();

  return dispatcher.useDeferredValue(value);
}

/**
 * @public
 */
export function useId(): string {
  const dispatcher = resolveDispatcher();

  return dispatcher.useId();
}

/**
 * @public
 */
export function useInsertionEffect(action: () => any, deps: any[]) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useInsertionEffect(action, deps);
}

/**
 * @public
 */
export function useSyncExternalStore(subscribe: () => any, getSnapshot: () => any, getServerSnapshot?: () => any) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * @public
 */
export function useTransition(): [boolean, (cb: () => void) => void] {
  const dispatcher = resolveDispatcher();

  return dispatcher.useTransition();
}

/**
 * @public
 */
export function useOptimistic<S, A>(passthrough: S, reducer?: (p: S, c: A) => S): [S, (p: A) => void] {
  const dispatcher = resolveDispatcher();

  return dispatcher.useOptimistic(passthrough, reducer);
}

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useEffectEvent<T extends Function>(cb: T) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useEffectEvent(cb);
}
