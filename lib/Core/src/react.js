import { MyReactComponent, MyReactPureComponent } from "./component.js";
import { render, findDOMNode } from "./dom.js";
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

const ReactDOM = {
  render,
  findDOMNode,
  unstable_batchedUpdates: safeCall,
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
  ReactDOM,
  React,
  render,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
  memo,
  createElement,
  cloneElement,
  isValidElement,
  createRef,
  createContext,
  createPortal,
  forwardRef,
  Children,
  Component,
  PureComponent,
};

window.React = React;
window.ReactDOM = ReactDOM;

Object.keys(React).forEach((key) => {
  window[key] = React[key];
});

const mixIn = {
  ...React,
  ...ReactDOM,
};

export default mixIn;
