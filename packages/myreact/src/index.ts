import * as reactiveApi from "@my-react/react-reactive";
import { Strict as StrictMode, Fragment, Suspense } from "@my-react/react-shared";

import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, isValidElement, getTypeFromElement, forwardRef, createContext, memo, lazy } from "./element";
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
  __my_react_reactive__,
  version,
};

export type { RenderScope } from "./renderScope";

export type { RenderPlatform } from "./renderPlatform";

export type { RenderDispatch } from "./renderDispatch";

export type { RenderController } from "./renderController";

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

export type { MyReactFiberNode, MyReactFiberNodeRoot, UpdateQueue } from "./fiber";

export type { MyReactComponent, MyReactComponentStaticType, MixinMyReactComponentType } from "./component";

export type { MyReactReactiveInstance } from "./reactive";
