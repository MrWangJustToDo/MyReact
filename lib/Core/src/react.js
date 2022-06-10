import { safeCall } from "./debug.js";
import { createRef } from "./share.js";
import { map, toArray, count, forEach, only } from "./children.js";
import { createContext, createPortal, forwardRef, memo } from "./element.js";
import { cloneElement, createElement, isValidElement } from "./vdom/index.js";
import { MyReactComponent, MyReactPureComponent } from "./component/index.js";
import { render, renderToString, hydrate, findDOMNode } from "./dom/index.js";
import { Fragment, Portal, Provider, Consumer, ForwardRef } from "./symbol.js";
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
} from "./hook/index.js";

const unstable_batchedUpdates = safeCall;

const ReactDOM = {
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unstable_batchedUpdates,
};

const Children = {
  map,
  only,
  count,
  toArray,
  forEach,
};

const Component = MyReactComponent;
const PureComponent = MyReactPureComponent;

const React = {
  // core
  Component,
  PureComponent,
  createElement,
  // feature
  memo,
  createRef,
  forwardRef,
  cloneElement,
  createContext,
  isValidElement,
  // element type
  Portal,
  Provider,
  Consumer,
  Fragment,
  ForwardRef,
  // hook
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
  // children api
  Children,
};

export {
  // ======== React =============
  // core
  Component,
  PureComponent,
  createElement,
  // feature
  memo,
  createRef,
  forwardRef,
  cloneElement,
  createContext,
  isValidElement,
  // element type
  Portal,
  Fragment,
  Provider,
  Consumer,
  ForwardRef,
  // hook
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
  // children api
  Children,
  // ===== ReactDOM ======
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unstable_batchedUpdates,
};

globalThis.React = React;
globalThis.ReactDOM = ReactDOM;

Object.keys(React).forEach((key) => {
  globalThis[key] = React[key];
});

const mixIn = {
  ...React,
  ...ReactDOM,
};

export default mixIn;
