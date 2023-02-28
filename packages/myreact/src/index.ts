import * as reactiveApi from "@my-react/react-reactive";

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
  My_React_Reactive as Reactive,
  My_React_Scope as Scope,
  My_React_Comment as Comment,
  createElement,
  cloneElement,
  isValidElement,
  getTypeFromElement,
  forwardRef,
  createContext,
  memo,
  lazy,
} from "./element";
import { MyReactFiberNode, MyReactFiberNodeRoot, createFiberNode, updateFiberNode, initialFiberNode } from "./fiber";
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
import { createReactive, MyReactReactiveInstance, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from "./reactive";
import {
  getElementName,
  getFiberNodeName,
  getFiberTree,
  getHookTree,
  createRef,
  currentRunningFiber,
  currentFunctionFiber,
  currentComponentFiber,
  currentHookDeepIndex,
  currentReactiveInstance,
  globalLoop,
  enableConcurrentMode,
  enableKeyDiff,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
} from "./share";

const Component = MyReactComponent;

const PureComponent = MyReactPureComponent;

const version = __VERSION__;

const __my_react_shared__ = {
  getHookTree,
  getFiberTree,
  getElementName,
  getFiberNodeName,
  createFiberNode,
  updateFiberNode,
  initialFiberNode,
  getTypeFromElement,
  enableKeyDiff,
  enableConcurrentMode,
  enableLegacyLifeCycle,
  enableStrictLifeCycle,
};

const __my_react_internal__ = {
  MyReactHookNode,
  MyReactComponent,
  MyReactFiberNode,
  MyReactFiberNodeRoot,
  MyReactInternalInstance,
  globalLoop,
  currentRunningFiber,
  currentHookDeepIndex,
  currentFunctionFiber,
  currentComponentFiber,
  currentReactiveInstance,
};

// reactive component
// 实验性🧪
const __my_react_reactive__ = {
  MyReactReactiveInstance,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactiveApi,
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
  createReactive,
  Scope,
  Portal,
  Element,
  Provider,
  Consumer,
  Fragment,
  Suspense,
  Reactive,
  KeepLive,
  StrictMode,
  ForwardRef,
  Comment,
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
  __my_react_reactive__,
  version,
};

export type { RenderPlatform } from "./platform";

export type { FiberDispatch } from "./dispatch";

export type { RenderScope } from "./scope";

export type { CreateHookParams, MyReactHookNode, Action, Reducer } from "./hook";

export type {
  Props,
  CreateElementProps,
  MyReactElement,
  MyReactElementType,
  MyReactElementNode,
  ArrayMyReactElementNode,
  ArrayMyReactElementChildren,
  MaybeArrayMyReactElementNode,
  MyReactObjectComponent,
  MyReactClassComponent,
  MyReactFunctionComponent,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
} from "./element";

export type { MyReactInternalInstance } from "./internal";

export type { MyReactFiberNode, MyReactFiberNodeDev, MyReactFiberNodeRoot, UpdateQueue } from "./fiber";

export type { MyReactComponent, MyReactComponentStaticType, MixinMyReactComponentType } from "./component";

export type { MyReactReactiveInstance } from "./reactive";
