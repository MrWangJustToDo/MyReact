import { MyReactComponent, MyReactPureComponent } from "./component.js";
import { render, findDOMNode, renderToString, hydrate } from "./dom.js";
import { createContext, createPortal, forwardRef, memo } from "./element.js";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
  useDebugValue,
} from "./hook.js";
import {
  Fragment,
  Portal,
  Provider,
  Consumer,
  ForwardRef,
  createRef,
  mapVDom,
  safeCall,
  flattenChildren,
  childrenCount,
  only,
} from "./tools.js";
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
  map: mapVDom,
  toArray: flattenChildren,
  count: childrenCount,
  forEach: mapVDom,
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
  createPortal,
  forwardRef,
  // element type
  Fragment,
  Portal,
  Provider,
  Consumer,
  ForwardRef,
  // hook
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
  useReducer,
  useDebugValue,
  Children,
};

export {
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
  createPortal,
  forwardRef,
  // element type
  Fragment,
  Portal,
  Provider,
  Consumer,
  ForwardRef,
  // hook
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
  useReducer,
  useDebugValue,
  Children,
  // ===== render ======
  render,
  hydrate,
  findDOMNode,
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
