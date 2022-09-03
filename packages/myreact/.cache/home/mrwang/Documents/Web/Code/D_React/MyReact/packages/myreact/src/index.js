import { count, forEach, map, only, toArray } from "./children";
import { MyReactComponent, MyReactPureComponent } from "./component";
import { createElement, cloneElement, isValidElement, forwardRef, createContext, memo, lazy } from "./element";
import { MyReactFiberNode, unmountFiber, createFiberNode, updateFiberNode, getContextFiber, getContextValue, } from "./fiber";
import { useRef, useMemo, useState, useEffect, useReducer, useContext, useCallback, useDebugValue, useLayoutEffect, useImperativeHandle, } from "./hook";
import { MyReactInternalInstance } from "./internal";
import { My_React_Portal as Portal, My_React_Element as Element, My_React_Strict as StrictMode, My_React_Fragment as Fragment, My_React_Provider as Provider, My_React_Consumer as Consumer, My_React_Suspense as Suspense, My_React_ForwardRef as ForwardRef, createRef, log, LinkTreeList, globalDispatch, currentRunningFiber, currentFunctionFiber, currentHookDeepIndex, rootFiber, globalLoop, rootContainer, isAppCrash, isAppMounted, safeCall, safeCallWithFiber, enableAsyncUpdate, } from "./share";
var Component = MyReactComponent;
var PureComponent = MyReactPureComponent;
var version = __VERSION__;
var __myreact_shared__ = {
    log: log,
    safeCall: safeCall,
    LinkTreeList: LinkTreeList,
    unmountFiber: unmountFiber,
    createFiberNode: createFiberNode,
    updateFiberNode: updateFiberNode,
    getContextFiber: getContextFiber,
    getContextValue: getContextValue,
    safeCallWithFiber: safeCallWithFiber,
    enableAsyncUpdate: enableAsyncUpdate,
};
var __myreact_internal__ = {
    MyReactComponent: MyReactComponent,
    MyReactFiberNode: MyReactFiberNode,
    MyReactInternalInstance: MyReactInternalInstance,
    globalLoop: globalLoop,
    globalDispatch: globalDispatch,
    currentRunningFiber: currentRunningFiber,
    currentHookDeepIndex: currentHookDeepIndex,
    currentFunctionFiber: currentFunctionFiber,
    rootFiber: rootFiber,
    rootContainer: rootContainer,
    isAppCrash: isAppCrash,
    isAppMounted: isAppMounted,
};
var Children = {
    map: map,
    only: only,
    count: count,
    toArray: toArray,
    forEach: forEach,
};
var React = {
    Component: Component,
    PureComponent: PureComponent,
    createElement: createElement,
    cloneElement: cloneElement,
    isValidElement: isValidElement,
    lazy: lazy,
    memo: memo,
    createRef: createRef,
    forwardRef: forwardRef,
    createContext: createContext,
    Portal: Portal,
    Element: Element,
    Provider: Provider,
    Consumer: Consumer,
    Fragment: Fragment,
    Suspense: Suspense,
    StrictMode: StrictMode,
    ForwardRef: ForwardRef,
    useRef: useRef,
    useMemo: useMemo,
    useState: useState,
    useEffect: useEffect,
    useReducer: useReducer,
    useContext: useContext,
    useCallback: useCallback,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useImperativeHandle: useImperativeHandle,
    Children: Children,
    __myreact_internal__: __myreact_internal__,
    __myreact_shared__: __myreact_shared__,
    version: version,
};
export { Component, PureComponent, createElement, cloneElement, isValidElement, lazy, memo, createRef, forwardRef, createContext, Portal, Element, Provider, Consumer, Fragment, Suspense, StrictMode, ForwardRef, useRef, useMemo, useState, useEffect, useReducer, useContext, useCallback, useDebugValue, useLayoutEffect, useImperativeHandle, Children, __myreact_internal__, __myreact_shared__, React as default, };
//# sourceMappingURL=index.js.map