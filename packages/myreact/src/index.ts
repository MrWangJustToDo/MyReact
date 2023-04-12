import { Strict as StrictMode, Fragment, Suspense } from "@my-react/react-shared";

import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
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
  useLayoutEffect,
  useImperativeHandle,
} from "./hook";
import { MyReactInternalInstance } from "./internal";
import {
  createRef,
  currentRunningFiber,
  currentHookTreeNode,
  currentHookNodeIndex,
  currentComponentFiber,
  currentRenderPlatform,
  setRenderPlatform,
  globalLoop,
  enableDebugLog,
  enableSyncFlush,
  enableHMRForDev,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
} from "./share";

const Component = MyReactComponent;

const PureComponent = MyReactPureComponent;

const version = __VERSION__;

const __my_react_shared__ = {
  enableDebugLog,
  enableSyncFlush,
  enableHMRForDev,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
};

const __my_react_internal__ = {
  MyReactInternalInstance,
  globalLoop,
  setRenderPlatform,
  currentRunningFiber,
  currentHookTreeNode,
  currentHookNodeIndex,
  currentComponentFiber,
  currentRenderPlatform,
};

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
  isValidElement,
  lazy,
  memo,
  createRef,
  forwardRef,
  createContext,
  Fragment,
  Suspense,
  StrictMode,
  useRef,
  useId,
  useMemo,
  useState,
  useSignal,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useLayoutEffect,
  useImperativeHandle,
  Children,
  __my_react_internal__,
  __my_react_shared__,
  version,
};

export type { Action, Reducer, RenderHook } from "./renderHook";

export type { RenderPlatform, LogProps } from "./renderPlatform";

export type { RenderFiber } from "./renderFiber";

export type { UpdateQueue, ComponentUpdateQueue, HookUpdateQueue } from "./renderQueue";

export type {
  LikeJSX,
  Props,
  CreateElementProps,
  MyReactElement,
  MyReactElementType,
  MyReactElementNode,
  ArrayMyReactElementNode,
  ArrayMyReactElementChildren,
  MaybeArrayMyReactElementNode,
  MyReactObjectComponent,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
} from "./element";

export type { MyReactInternalInstance } from "./internal";

export type { MyReactComponent } from "./component";
