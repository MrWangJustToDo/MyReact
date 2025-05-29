import { Strict as StrictMode, Fragment, Suspense, Profiler } from "@my-react/react-shared";

import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, createFactory, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
import {
  use,
  useId,
  useRef,
  useMemo,
  useState,
  useEffect,
  useSignal,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useTransition,
  useLayoutEffect,
  useDeferredValue,
  useInsertionEffect,
  useImperativeHandle,
  useSyncExternalStore,
} from "./hook";
import { MyReactInternalInstance } from "./internal";
import {
  createRef,
  createReadonlyRef,
  startTransition,
  currentRunningFiber,
  currentHookTreeNode,
  currentHookNodeIndex,
  currentComponentFiber,
  currentCallingFiber,
  currentError,
  globalLoop,
  enableDebugLog,
  enableSyncFlush,
  enableHMRForDev,
  enableDebugFiled,
  enableDoubleRender,
  enableLoopFromRoot,
  enableScopeTreeLog,
  enableOptimizeTreeLog,
  enableConcurrentMode,
  enableLegacyLifeCycle,
  enablePerformanceLog,
  enableMockReact,
  yieldTask,
  macroTask,
  microTask,
  currentScopeFiber,
  cache,
  Dispatcher,
  fiberToDispatchMap,
  dispatchToListenerMap,
  instanceToInitialFieldMap,
  currentScheduler,
} from "./share";

/**
 * @public
 */
const Component = MyReactComponent;

/**
 * @public
 */
const PureComponent = MyReactPureComponent as typeof MyReactComponent;

/**
 * @public
 */
const version = enableMockReact.current ? "18.2.0" : __VERSION__;

/**
 * @beta
 */
const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  ReactCurrentActQueue: {},
  ReactCurrentBatchConfig: {},
  ReactCurrentDispatcher: Dispatcher,
  ReactCurrentOwner: { current: null },
  ReactDebugCurrentFrame: {},
};

/**
 * @public
 */
const __my_react_shared__ = {
  enableMockReact,
  enableDebugLog,
  enableSyncFlush,
  enableHMRForDev,
  enableDebugFiled,
  enableScopeTreeLog,
  enableLoopFromRoot,
  enableDoubleRender,
  enableConcurrentMode,
  enableLegacyLifeCycle,
  enableOptimizeTreeLog,
  enablePerformanceLog,
};

/**
 * @public
 */
const __my_react_scheduler__ = {
  yieldTask,
  macroTask,
  microTask,
};

/**
 * @public
 */
const __my_react_internal__ = {
  MyReactInternalInstance,
  globalLoop,

  createReadonlyRef,
  Dispatcher,

  fiberToDispatchMap,
  dispatchToListenerMap,
  instanceToInitialFieldMap,

  currentScheduler,
  currentScopeFiber,
  currentRunningFiber,
  currentCallingFiber,
  currentHookTreeNode,
  currentHookNodeIndex,
  currentComponentFiber,
  currentError,
};

/**
 * @public
 */
const Children = {
  map,
  only,
  count,
  toArray,
  forEach,
};

const isMyReact = true;

export {
  Component,
  PureComponent,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  startTransition,
  lazy,
  memo,
  cache,
  createRef,
  forwardRef,
  createContext,
  // symbol
  Profiler,
  Fragment,
  Suspense,
  StrictMode,
  // hook
  use,
  useId,
  useRef,
  useMemo,
  useState,
  useSignal,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useTransition,
  useLayoutEffect,
  useDeferredValue,
  useInsertionEffect,
  useImperativeHandle,
  useSyncExternalStore,
  Children,
  __my_react_scheduler__,
  __my_react_internal__,
  __my_react_shared__,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  version,
  
  isMyReact,
};

export type { Action, Reducer, RenderHook, RenderHookParams, DefaultRenderHook } from "./renderHook";

export type { RenderFiber, DefaultRenderFiber } from "./renderFiber";

export type { RenderScheduler, DefaultRenderScheduler } from "./renderScheduler";

export type { Dispatcher } from "./share";

export type {
  UpdateQueue,
  ComponentUpdateQueue,
  HookUpdateQueue,
  HMRUpdateQueue,
  TriggerUpdateQueue,
  ContextUpdateQueue,
  SuspenseUpdateQueue,
} from "./renderQueue";

export type {
  LikeJSX,
  LikeReactNode,
  Props,
  MemoType,
  LazyType,
  ForwardRefType,
  ContextObjectType,
  CreateElementProps,
  CreateElementConfig,
  MyReactElement,
  MyReactElementType,
  MyReactElementNode,
  MyReactComponentType,
  ArrayMyReactElementNode,
  ArrayMyReactElementChildren,
  MaybeArrayMyReactElementNode,
  MyReactClassComponent,
  MyReactObjectComponent,
  MyReactFunctionComponent,
  MixinMyReactClassComponent,
  MixinMyReactObjectComponent,
  MixinMyReactFunctionComponent,
} from "./element";

export type { MyReactInternalInstance } from "./internal";

export type { MyReactComponent, ErrorInfo } from "./component";
