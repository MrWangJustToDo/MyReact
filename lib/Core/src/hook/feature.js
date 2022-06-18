import { createRef } from "../share.js";
import { getHookNode } from "./create.js";
import { getFiberTree } from "../debug.js";
import { MyReactHookNode } from "./instance.js";
import { pushEffect, pushLayoutEffect } from "../effect.js";
import {
  currentFunctionFiber,
  currentHookDeepIndex,
  enableDebugLog,
} from "../env.js";

function useState(initialValue) {
  const currentHookNode = getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    typeof initialValue === "function" ? initialValue : () => initialValue,
    null,
    null,
    "useState"
  );

  return [currentHookNode.result, currentHookNode.dispatch];
}

function useEffect(action, depArray) {
  getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    null,
    depArray,
    "useEffect"
  );
}

function useLayoutEffect(action, depArray) {
  getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    null,
    depArray,
    "useLayoutEffect"
  );
}

function useCallback(action, depArray) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    null,
    depArray,
    "useCallback"
  ).result;
}

function useMemo(action, depArray) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    null,
    depArray,
    "useMemo"
  ).result;
}

function useRef(value) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    createRef(value),
    null,
    null,
    "useRef"
  ).result;
}

function useContext(Context) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    Context,
    null,
    null,
    "useContext"
  ).result;
}

function useReducer(reducer, initialArg, init) {
  const currentHook = getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    typeof init === "function" ? () => init(initialArg) : () => initialArg,
    reducer,
    null,
    "useReducer"
  );

  return [currentHook.result, currentHook.dispatch];
}

function useImperativeHandle(ref, createHandle, deps) {
  getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    ref,
    createHandle,
    deps,
    "useImperativeHandle"
  );
}

function useDebugValue(...args) {
  if (enableDebugLog.current) {
    console.log(
      `[debug value]: \n`,
      ...args,
      "\ncomponent tree:",
      getFiberTree(currentFunctionFiber.current)
    );
  }
}

/**
 *
 * @param {MyReactHookNode} hookNode
 */
const pushHookEffect = (hookNode) => {
  if (!hookNode.__pendingEffect__) {
    hookNode.__pendingEffect__ = true;
    if (hookNode.hookType === "useEffect") {
      pushEffect(hookNode.__fiber__, hookNode);
    } else if (hookNode.hookType === "useLayoutEffect") {
      pushLayoutEffect(hookNode.__fiber__, hookNode);
    } else {
      pushLayoutEffect(hookNode.__fiber__, () => {
        if (hookNode.value && typeof hookNode.value === "object") {
          hookNode.value.current = hookNode.reducer.call(null);
        }
        hookNode.effect = false;
        hookNode.__pendingEffect = false;
      });
    }
  }
};

export {
  useRef,
  useMemo,
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  useDebugValue,
  pushHookEffect,
  useLayoutEffect,
  useImperativeHandle,
};
