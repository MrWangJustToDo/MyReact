import { map, toArray, count, forEach, only } from "./children.js";
import { MyReactComponent, MyReactPureComponent } from "./component.js";
import { safeCall } from "./debug.js";
import { findDOMNode, render } from "./dom.js";
import { createContext, createPortal, forwardRef, memo } from "./element.js";
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
} from "./hook.js";
import { hydrate } from "./hydrate.js";
import { renderToString } from "./server.js";
import { createRef } from "./share.js";
import { Fragment, Portal, Provider, Consumer, ForwardRef } from "./symbol.js";
import { cloneElement, createElement, isValidElement } from "./vdom.js";

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
  toArray,
  count,
  forEach,
  only,
};

const Component = MyReactComponent;
const PureComponent = MyReactPureComponent;

const React = {
  // core
  createElement,
  Component,
  PureComponent,
  // feature
  memo,
  cloneElement,
  isValidElement,
  createRef,
  createContext,
  forwardRef,
  // element type
  Fragment,
  Portal,
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
};

export {
  // ======== React =============
  // core
  createElement,
  Component,
  PureComponent,
  // feature
  memo,
  cloneElement,
  isValidElement,
  createRef,
  createContext,
  forwardRef,
  // element type
  Fragment,
  Portal,
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
