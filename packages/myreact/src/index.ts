import { Strict as StrictMode, Fragment, Suspense } from "@my-react/react-shared";

import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
import { MyReactFiberNode } from "./fiber";
import {
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
  MyReactHookNode,
} from "./hook";
import { MyReactInternalInstance } from "./internal";
import {
  createRef,
  currentRunningFiber,
  currentFunctionFiber,
  currentComponentFiber,
  currentHookDeepIndex,
  globalLoop,
  enableKeyDiff,
  enableDebugLog,
  enableConcurrentMode,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
} from "./share";

const Component = MyReactComponent;

const PureComponent = MyReactPureComponent;

const version = __VERSION__;

const __my_react_shared__ = {
  enableKeyDiff,
  enableDebugLog,
  enableConcurrentMode,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
};

const __my_react_internal__ = {
  MyReactHookNode,
  MyReactComponent,
  MyReactFiberNode,
  MyReactInternalInstance,
  globalLoop,
  currentRunningFiber,
  currentHookDeepIndex,
  currentFunctionFiber,
  currentComponentFiber,
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

export type { RenderScope } from "./renderScope";

export type { RenderPlatform } from "./renderPlatform";

export type { RenderDispatch } from "./renderDispatch";

export type { RenderController } from "./renderController";

export type { CreateHookParams, MyReactHookNode, Action, Reducer } from "./hook";

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

export type { MyReactFiberNode, MyReactFiberNodeRoot, UpdateQueue } from "./fiber";

export type { MyReactComponent } from "./component";
