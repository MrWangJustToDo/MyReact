import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import {
  My_React_Portal as Portal,
  My_React_Element as Element,
  My_React_Strict as StrictMode,
  My_React_Fragment as Fragment,
  My_React_Provider as Provider,
  My_React_Consumer as Consumer,
  My_React_Suspense as Suspense,
  My_React_ForwardRef as ForwardRef,
  My_React_KeepLive as KeepLive,
  createElement,
  cloneElement,
  isValidElement,
  getTypeFromElement,
  forwardRef,
  createContext,
  memo,
  lazy,
} from "./element";
import { MyReactFiberNode, MyReactFiberNodeRoot, unmountFiberNode, createFiberNode, updateFiberNode, initialFiberNode } from "./fiber";
import {
  createHookNode,
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
import { jsx, jsxs, jsxDEV } from "./jsx";
import {
  log,
  logHook,
  createRef,
  currentRunningFiber,
  currentFunctionFiber,
  currentComponentFiber,
  currentHookDeepIndex,
  globalLoop,
  safeCall,
  safeCallWithFiber,
  enableAsyncUpdate,
  enableKeyDiff,
  enableStrictLifeCycle,
} from "./share";

const Component = MyReactComponent;

const PureComponent = MyReactPureComponent;

const version = __VERSION__;

const __my_react_shared__ = {
  log,
  logHook,
  safeCall,
  unmountFiberNode,
  createFiberNode,
  updateFiberNode,
  initialFiberNode,
  createHookNode,
  getTypeFromElement,
  safeCallWithFiber,
  enableAsyncUpdate,
  enableKeyDiff,
  enableStrictLifeCycle,
};

const __my_react_internal__ = {
  MyReactComponent,
  MyReactFiberNode,
  MyReactFiberNodeRoot,
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
  jsx,
  jsxs,
  jsxDEV,
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
  KeepLive,
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
  __my_react_internal__,
  __my_react_shared__,
  version,
};

export type { FiberDispatch } from "./dispatch";

export type { RenderScope } from "./scope";

export type { CreateHookParams, MyReactHookNode } from "./hook";

export type {
  MyReactElement,
  MyReactElementNode,
  ArrayMyReactElementNode,
  MaybeArrayMyReactElementNode,
  MyReactClassComponent,
  MyReactFunctionComponent,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
} from "./element";

export type { MyReactInternalInstance } from "./internal";

export type { MyReactFiberNode, MyReactFiberNodeDev, MyReactFiberNodeRoot, UpdateQueue } from "./fiber";

export type { MyReactComponent, MyReactComponentStaticType, MixinMyReactComponentType } from "./component";
