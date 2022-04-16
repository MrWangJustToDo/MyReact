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
} from "./hook.js";
import {
  Fragment,
  Portal,
  Provider,
  Consumer,
  ForwardRef,
  createRef,
  map,
} from "./tools.js";
import {
  cloneElement,
  createElement,
  isValidElement,
  MyReactVDom,
} from "./vdom.js";

const React = {
  // core
  render,
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
  Children: {
    map: (children, action) =>
      map(children, (vDom) => vDom instanceof MyReactVDom, action),
  },
};

export {
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
window.ReactDOM = React;

export default React;
