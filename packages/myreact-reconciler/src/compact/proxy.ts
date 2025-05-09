import {
  Component as ComponentCompact,
  PureComponent as PureComponentCompact,
  createElement as createElementCompact,
  cloneElement as cloneElementCompact,
  createFactory as createFactoryCompact,
  isValidElement as isValidElementCompact,
  startTransition as startTransitionCompact,
  lazy as lazyCompact,
  memo as memoCompact,
  createRef as createRefCompact,
  forwardRef as forwardRefCompact,
  createContext as createContextCompact,
  useId as useIdCompact,
  useRef as useRefCompact,
  useMemo as useMemoCompact,
  useState as useStateCompact,
  useEffect as useEffectCompact,
  useReducer as useReducerCompact,
  useContext as useContextCompact,
  useCallback as useCallbackCompact,
  useDebugValue as useDebugValueCompact,
  useTransition as useTransitionCompact,
  useLayoutEffect as useLayoutEffectCompact,
  useDeferredValue as useDeferredValueCompact,
  useInsertionEffect as useInsertionEffectCompact,
  useImperativeHandle as useImperativeHandleCompact,
  useSyncExternalStore as useSyncExternalStoreCompact,
  Children as ChildrenCompact,
  StrictMode as StrictModeCompact,
  Fragment as FragmentCompact,
  Suspense as SuspenseCompact,
} from "@my-react/react";

import { Reconciler } from "./feature";

import type { MyReactFiberNode } from "../runtimeFiber";
import type {
  Component as ComponentType,
  PureComponent as PureComponentType,
  createElement as createElementType,
  cloneElement as cloneElementType,
  createFactory as createFactoryType,
  isValidElement as isValidElementType,
  startTransition as startTransitionType,
  lazy as lazyType,
  memo as memoType,
  createRef as createRefType,
  forwardRef as forwardRefType,
  createContext as createContextType,
  useId as useIdType,
  useRef as useRefType,
  useMemo as useMemoType,
  useState as useStateType,
  useEffect as useEffectType,
  useReducer as useReducerType,
  useContext as useContextType,
  useCallback as useCallbackType,
  useDebugValue as useDebugValueType,
  useTransition as useTransitionType,
  useLayoutEffect as useLayoutEffectType,
  useDeferredValue as useDeferredValueType,
  useInsertionEffect as useInsertionEffectType,
  useImperativeHandle as useImperativeHandleType,
  useSyncExternalStore as useSyncExternalStoreType,
  Children as ChildrenType,
  StrictMode as StrictModeType,
  Fragment as FragmentType,
  Suspense as SuspenseType,
} from "react";
import type createReconcilerType from "react-reconciler";

export * from "../dispatchContext";
export * from "../dispatchEffect";
export * from "../dispatchErrorBoundaries";
export * from "../dispatchMount";
export * from "../dispatchScope";
export * from "../dispatchStrict";
export * from "../dispatchSuspense";
export * from "../dispatchUnmount";
export * from "../dispatchUpdate";
export * from "../processQueue";
export * from "../processHook";
export * from "../processState";
export * from "../processPromise";
export * from "../processLazy";
export * from "../processSuspense";
export * from "../processFunction";
export * from "../processContext";
export * from "../processClass";
export * from "../share";
export * from "../renderDispatch";
export * from "../renderMount";
export * from "../renderUnmount";
export * from "../renderNextWork";
export * from "../renderPlatform";
export * from "../renderUpdate";
export * from "../runtimeFiber";
export * from "../runtimeGenerate";
export * from "../runtimeHook";
export * from "../runtimeMount";
export * from "../runtimeScope";
export * from "../runtimeUpdate";

export const version = __VERSION__;

export const Component = ComponentCompact as unknown as typeof ComponentType;

export const PureComponent = PureComponentCompact as unknown as typeof PureComponentType;

export const createElement = createElementCompact as unknown as typeof createElementType;

export const cloneElement = cloneElementCompact as unknown as typeof cloneElementType;

/**
 * @deprecated
 */
export const createFactory = createFactoryCompact as unknown as typeof createFactoryType;

export const isValidElement = isValidElementCompact as unknown as typeof isValidElementType;

export const startTransition = startTransitionCompact as unknown as typeof startTransitionType;

export const lazy = lazyCompact as unknown as typeof lazyType;

export const memo = memoCompact as unknown as typeof memoType;

export const createRef = createRefCompact as unknown as typeof createRefType;

export const forwardRef = forwardRefCompact as unknown as typeof forwardRefType;

export const createContext = createContextCompact as unknown as typeof createContextType;

export const useId = useIdCompact as unknown as typeof useIdType;

export const useRef = useRefCompact as unknown as typeof useRefType;

export const useMemo = useMemoCompact as unknown as typeof useMemoType;

export const useState = useStateCompact as unknown as typeof useStateType;

export const useEffect = useEffectCompact as unknown as typeof useEffectType;

export const useReducer = useReducerCompact as unknown as typeof useReducerType;

export const useContext = useContextCompact as unknown as typeof useContextType;

export const useCallback = useCallbackCompact as unknown as typeof useCallbackType;

export const useDebugValue = useDebugValueCompact as unknown as typeof useDebugValueType;

export const useTransition = useTransitionCompact as unknown as typeof useTransitionType;

export const useLayoutEffect = useLayoutEffectCompact as unknown as typeof useLayoutEffectType;

export const useDeferredValue = useDeferredValueCompact as unknown as typeof useDeferredValueType;

export const useInsertionEffect = useInsertionEffectCompact as unknown as typeof useInsertionEffectType;

export const useImperativeHandle = useImperativeHandleCompact as unknown as typeof useImperativeHandleType;

export const useSyncExternalStore = useSyncExternalStoreCompact as unknown as typeof useSyncExternalStoreType;

export const Children = ChildrenCompact as unknown as typeof ChildrenType;

export const createReconciler = Reconciler as unknown as typeof createReconcilerType;

export const StrictMode = StrictModeCompact as unknown as typeof StrictModeType;

export const Fragment = FragmentCompact as unknown as typeof FragmentType;

export const Suspense = SuspenseCompact as unknown as typeof SuspenseType;

export interface FiberNode<T = Record<string, any>> extends MyReactFiberNode {
  stateNode: T;
  return: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  alternate?: FiberNode | null;
}
