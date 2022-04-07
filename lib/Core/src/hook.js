import { currentFunctionFiber, currentHookDeepIndex } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactInstance } from "./share.js";
import { createRef, isNormalEqual, logHook } from "./tools.js";
import { pushEffect, pushLayoutEffect } from "./update.js";

class MyReactHookNode extends MyReactInstance {
  __pendingEffect__ = false;

  constructor(
    hookIndex,
    value,
    depArray,
    hookType,
    /**
     * @type MyReactHookNode
     */
    hookNext,
    /**
     * @type MyReactHookNode
     */
    hookPrev,
    cancel,
    effect
  ) {
    super();
    this.hookIndex = hookIndex;
    this.value = value;
    this.depArray = depArray;
    this.hookType = hookType;
    this.hookNext = hookNext;
    this.hookPrev = hookPrev;
    this.cancel = cancel;
    this.effect = effect;
    this._initialResult();
    this._checkValidHook();
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

  _processContext() {
    const providerFiber = this.processContext(this.value);
    this.result = providerFiber.__vdom__.props.value;
  }

  initialResult() {
    if (this.hookType === "useState") {
      this.result =
        typeof this.value === "function" ? this.value.call(null) : this.value;
    } else if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect"
    ) {
      this.effect = true;
    } else if (this.hookType === "useCallback") {
      this.result = this.value;
    } else if (this.hookType === "useMemo") {
      this.result = this.value.call(null);
    } else if (this.hookType === "useContext") {
      this._processContext();
    } else if (this.hookType === "useRef") {
      this.result = this.value;
    } else {
      throw new Error("无效的hook");
    }
  }

  update(newAction, newDepArray, newHookType, newFiber) {
    this.updateDependence(newFiber);
    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useMemo" ||
      this.hookType === "useCallback"
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
        console.log(this.depArray, newDepArray);
        this.value = newAction;
        this.depArray = newDepArray;
        this.effect = true;
      }
    }

    if (this.hookType === "useCallback") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.result = newAction;
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useMemo") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newAction;
        this.result = newAction.call(null);
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useContext") {
      if (!this.__context__.mount || !Object.is(this.value, newAction)) {
        this.value = newAction;
        this._processContext();
      }
    }
  }

  setValue = (value) => {
    this.value = value;

    this.prevResult = this.result;

    if (typeof value === "function") {
      this.result = value(this.result);
    } else {
      this.result = value;
    }
    if (!Object.is(this.result, this.prevResult)) {
      Promise.resolve().then(() => this.__fiber__.update());
    }
  };
}

/**
 *
 * @param {{hookIndex: number, value: any, depArray: any[], hookType: string}} param
 * @param {MyReactFiberNode} fiber
 */
function createHookNode({ hookIndex, value, depArray, hookType }, fiber) {
  const newHookNode = new MyReactHookNode(hookIndex, value, depArray, hookType);

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
function getHookNode(fiber, hookIndex, value, depArray, hookType) {
  if (!fiber) throw new Error("hook使用必须在函数组件中");
  let currentHookNode = null;
  if (fiber.hookList.length > hookIndex) {
    currentHookNode = fiber.hookList[hookIndex];

    if (currentHookNode.hookType !== hookType) {
      throw new Error("\n" + logHook(currentHookNode, hookType));
    }

    currentHookNode.update(value, depArray, hookType, fiber);
  } else {
    currentHookNode = createHookNode(
      { hookIndex, hookType, value, depArray },
      fiber
    );
  }

  if (currentHookNode.effect) {
    pushHookEffect(currentHookNode);
  }

  return currentHookNode;
}

function useState(initialValue) {
  const currentHookNode = getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    initialValue,
    null,
    "useState"
  );

  return [currentHookNode.result, currentHookNode.setValue];
}

function useEffect(action, depArray) {
  getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    depArray,
    "useEffect"
  );
}

function useLayoutEffect(action, depArray) {
  getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    depArray,
    "useLayoutEffect"
  );
}

function useCallback(action, depArray) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
    depArray,
    "useCallback"
  ).result;
}

function useMemo(action, depArray) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    action,
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
    "useRef"
  ).result;
}

function useContext(Context) {
  return getHookNode(
    currentFunctionFiber.current,
    currentHookDeepIndex.current++,
    Context,
    null,
    "useContext"
  ).result;
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
};
