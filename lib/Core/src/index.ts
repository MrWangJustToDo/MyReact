import { count, forEach, map, only, toArray } from './children';
import { MyReactComponent, MyReactPureComponent } from './component';
import {
  render,
  renderToString,
  hydrate,
  createPortal,
  findDOMNode,
  unmountComponentAtNode,
} from './dom';
import {
  createElement,
  cloneElement,
  isValidElement,
  forwardRef,
  createContext,
  memo,
  lazy,
} from './element';
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
} from './hook';
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
  safeCall,
} from './share';

const unstable_batchedUpdates = safeCall;

const Component = MyReactComponent;
const PureComponent = MyReactPureComponent;

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

  version: '0.0.1',
};

const ReactDOM = {
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unmountComponentAtNode,
  unstable_batchedUpdates,

  version: '0.0.1',
};

const mixin = { ...React, ...ReactDOM };

(globalThis as any).React = React;

(globalThis as any).ReactDOM = ReactDOM;

export { React, ReactDOM };

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
  render,
  hydrate,
  findDOMNode,
  createPortal,
  renderToString,
  unmountComponentAtNode,
  unstable_batchedUpdates,
};

export default mixin;
