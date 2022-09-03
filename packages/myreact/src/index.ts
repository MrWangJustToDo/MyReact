import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
import {
  MyReactFiberNode,
  unmountFiber,
  createFiberNode,
  updateFiberNode,
  getContextFiber,
  getContextValue,
} from "./fiber";
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useLayoutEffect,
  useImperativeHandle,
} from "./hook";
import { MyReactInternalInstance } from "./internal";
import {
  My_React_Portal as Portal,
  My_React_Element as Element,
  My_React_Strict as StrictMode,
  My_React_Fragment as Fragment,
  My_React_Provider as Provider,
  My_React_Consumer as Consumer,
  My_React_Suspense as Suspense,
  My_React_ForwardRef as ForwardRef,
  createRef,
  log,
  LinkTreeList,
  globalDispatch,
  currentRunningFiber,
  currentFunctionFiber,
  currentHookDeepIndex,
  rootFiber,
  globalLoop,
  rootContainer,
  isAppCrash,
  isAppMounted,
  safeCall,
  safeCallWithFiber,
  enableAsyncUpdate,
} from "./share";

const Component = MyReactComponent;

const PureComponent = MyReactPureComponent;

const version = __VERSION__;

const __myreact_shared__ = {
  log,
  safeCall,
  LinkTreeList,
  unmountFiber,
  createFiberNode,
  updateFiberNode,
  getContextFiber,
  getContextValue,
  safeCallWithFiber,
  enableAsyncUpdate,
};

const __myreact_internal__ = {
  MyReactComponent,
  MyReactFiberNode,
  MyReactInternalInstance,
  globalLoop,
  globalDispatch,
  currentRunningFiber,
  currentHookDeepIndex,
  currentFunctionFiber,
  rootFiber,
  rootContainer,
  isAppCrash,
  isAppMounted,
};

const Children = {
  map,
  only,
  count,
  toArray,
  forEach,
};

const React = {
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

  Portal,
  Element,
  Provider,
  Consumer,
  Fragment,
  Suspense,
  StrictMode,
  ForwardRef,

  useRef,
  useMemo,
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useLayoutEffect,
  useImperativeHandle,

  Children,

  __myreact_internal__,
  __myreact_shared__,

  version,
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
  Portal,
  Element,
  Provider,
  Consumer,
  Fragment,
  Suspense,
  StrictMode,
  ForwardRef,
  useRef,
  useMemo,
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  useLayoutEffect,
  useImperativeHandle,
  Children,
  __myreact_internal__,
  __myreact_shared__,
  React as default,
};

export type { FiberDispatch } from "./dispatch";

export type {
  Element as MyReactElement,
  ElementNode as MyReactElementNode,
  ArrayElementNode,
  MaybeArrayElementNode,
  ClassComponent,
  FunctionComponent,
  MixinClassComponent,
  MixinFunctionComponent,
} from "./element";

export type { MyReactInternalInstance, MyReactInternalType } from "./internal";

export type { MyReactFiberNode } from "./fiber";

export type { MyReactComponent, MyReactComponentStaticType, MixinMyReactComponentType } from "./component";
