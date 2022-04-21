import { MyReactComponent, MyReactPureComponent } from "./component.js";
import { render } from "./dom.js";
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
} from "./tools.js";
import { cloneElement, createElement, isValidElement } from "./vdom.js";

const ReactDOM = {
  render,
  unstable_batchedUpdates: safeCall,
};

const React = {
  // core
  createElement,
  Component: MyReactComponent,
  PureComponent: MyReactPureComponent,
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
  Children: {
    map: mapVDom,
  },
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
  cloneElement,
  isValidElement,
  createRef,
  createContext,
  createPortal,
  forwardRef,
};

window.React = React;
window.ReactDOM = ReactDOM;

export default React;
