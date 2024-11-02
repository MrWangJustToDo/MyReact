import { Strict as StrictMode, Fragment, Suspense, Profiler } from "@my-react/react-shared";

import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, createFactory, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
import {
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
  currentRenderPlatform,
  initRenderPlatform,
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
  enableHookStack,
  currentScopeFiber,
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
  ReactCurrentDispatcher: { current: {} },
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
  enableHookStack,
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

  initRenderPlatform,
  createReadonlyRef,

  currentScopeFiber,
  currentRunningFiber,
  currentHookTreeNode,
  currentHookNodeIndex,
  currentComponentFiber,
  currentRenderPlatform,
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
  createRef,
  forwardRef,
  createContext,
  // symbol
  Profiler,
  Fragment,
  Suspense,
  StrictMode,
  // hook
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
};

export type { Action, Reducer, RenderHook, RenderHookParams, DefaultRenderHook } from "./renderHook";

export type { RenderPlatform, DefaultRenderPlatform } from "./renderPlatform";

export type { RenderFiber, DefaultRenderFiber } from "./renderFiber";

export type { UpdateQueue, ComponentUpdateQueue, HookUpdateQueue } from "./renderQueue";

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
