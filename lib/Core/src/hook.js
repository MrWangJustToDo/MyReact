import { logCurrentRunningFiber, logHook } from "./debug.js";
import { pushEffect, pushLayoutEffect } from "./effect.js";
import {
  currentFunctionFiber,
  currentHookDeepIndex,
  enableDebugLog,
  isServerRender,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactInstance } from "./instance.js";
import { createRef } from "./share.js";
import { isNormalEqual } from "./tools.js";

// from react source code
function defaultReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}
class MyReactHookNode extends MyReactInstance {
  /**
   * @type MyReactHookNode
   */
  hookNext = null;
  /**
   * @type MyReactHookNode
   */
  hookPrev = null;

  /**
   * @type Function
   */
  cancel = null;

  /**
   * @type boolean
   */
  effect = false;

  __pendingEffect__ = false;

  constructor(hookIndex, value, reducer, depArray, hookType) {
    super();
    this.hookIndex = hookIndex;
    this.value = value;
    this.reducer = reducer;
    this.depArray = depArray;
    this.hookType = hookType;
    this._checkValidHook();
    this._initialResult();
  }

  _initialResult() {
    this.result = null;
    this.prevResult = null;
  }

  _checkValidHook() {
    if (
      this.hookType === "useMemo" ||
      this.hookType === "seEffect" ||
      this.hookType === "useCallback" ||
      this.hookType === "useLayoutEffect"
    ) {
      if (typeof this.value !== "function") {
        throw new Error(`${this.hookType} 初始化错误`);
      }
    }

    if (this.hookType === "useContext") {
      if (typeof this.value !== "object" || this.value === null) {
        throw new Error(`${this.hookType} 初始化错误`);
      }
    }
  }

  _getContextValue() {
    const providerFiber = this.processContext(this.value);
    return providerFiber?.__vdom__.props.value || this.value.Provider.value;
  }

  initialResult() {
    if (
      this.hookType === "useState" ||
      this.hookType === "useMemo" ||
      this.hookType === "useReducer"
    ) {
      this.result = this.value.call(null);
      return;
    }

    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
      this.effect = true;
      return;
    }

    if (this.hookType === "useCallback" || this.hookType === "useRef") {
      this.result = this.value;
      return;
    }

    if (this.hookType === "useContext") {
      this.result = this._getContextValue();
      return;
    }

    if (this.hookType === "useImperativeHandle") {
      // value is ref, reducer is createHandle
      if (this.value && this.value.current) {
        this.value.current = this.reducer.call(null);
      }
      return;
    }

    throw new Error("无效的hook");
  }

  update(newAction, newReducer, newDepArray, newHookType, newFiber) {
    this.updateDependence(newFiber);
    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useMemo" ||
      this.hookType === "useCallback" ||
      this.hookType === "useImperativeHandle"
    ) {
      if (newDepArray && !this.depArray) {
        throw new Error("依赖状态变更");
      }
      if (!newDepArray && this.depArray) {
        throw new Error("依赖状态变更");
      }
    }

    if (this.hookType === "useEffect" || this.hookType === "useLayoutEffect") {
      if (!newDepArray) {
        this.value = newAction;
        this.effect = true;
      } else if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.depArray = newDepArray;
        this.effect = true;
      }
    }

    if (this.hookType === "useCallback") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = newAction;
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useMemo") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = newAction.call(null);
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useContext") {
      if (
        !this.__context__ ||
        !this.__context__.mount ||
        !Object.is(this.value, newAction)
      ) {
        this.value = newAction;
        this.prevResult = this.result;
        this.result = this._getContextValue();
      }
    }

    if (this.hookType === "useReducer") {
      this.value = newAction;
      this.reducer = newReducer;
    }

    if (this.hookType === "useImperativeHandle") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.reducer = newReducer;
        this.depArray = newDepArray;
        if (this.value && this.value.current) {
          this.value.current = this.reducer.call(null);
        }
      }
    }
  }

  dispatch = (action) => {
    this.prevResult = this.result;

    this.result = this.reducer(this.result, action);

    if (!Object.is(this.result, this.prevResult)) {
      Promise.resolve().then(() => this.__fiber__.update());
    }
  };
}

/**
 *
 * @param {{hookIndex: number, value: any, reducer: Function, depArray: any[], hookType: string}} param
 * @param {MyReactFiberNode} fiber
 */
function createHookNode(
  { hookIndex, value, reducer, depArray, hookType },
  fiber
) {
  const newHookNode = new MyReactHookNode(
    hookIndex,
    value,
    reducer || defaultReducer,
    depArray,
    hookType
  );

  newHookNode.updateDependence(fiber);

  newHookNode.initialResult();

  fiber.installHook(newHookNode);

  return newHookNode;
}

/**
 *
 * @param {MyReactHookNode} hookNode
 */
function pushHookEffect(hookNode) {
  if (!hookNode.__pendingEffect__) {
    hookNode.__pendingEffect__ = true;
    if (hookNode.hookType === "useEffect") {
      pushEffect(hookNode.__fiber__, hookNode);
    } else {
      pushLayoutEffect(hookNode.__fiber__, hookNode);
    }
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {number} hookIndex
 * @param {any} value
 * @param {any[]} depArray
 * @param {string} hookType
 */
function getHookNode(fiber, hookIndex, value, reducer, depArray, hookType) {
  if (!fiber) throw new Error("hook使用必须在函数组件中");
  let currentHookNode = null;
  if (fiber.hookList.length > hookIndex) {
    currentHookNode = fiber.hookList[hookIndex];

    if (currentHookNode.hookType !== hookType) {
      throw new Error("\n" + logHook(currentHookNode, hookType));
    }

    currentHookNode.update(value, reducer, depArray, hookType, fiber);
  } else if (!fiber.fiberAlternate) {
    // new create
    currentHookNode = createHookNode(
      { hookIndex, hookType, value, depArray, reducer },
      fiber
    );
  } else {
    const temp = { hookType: "undefined" };
    temp.hookPrev = fiber.hookFoot;
    throw new Error("\n" + logHook(temp, hookType));
  }

  if (!isServerRender.current && currentHookNode.effect) {
    pushHookEffect(currentHookNode);
  }

  return currentHookNode;
}

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
      `[debug] --> `,
      `value`,
      ...args,
      "\n",
      `tree:`,
      logCurrentRunningFiber()
    );
  }
}

export {
  MyReactHookNode,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useDebugValue,
  useImperativeHandle,
};
