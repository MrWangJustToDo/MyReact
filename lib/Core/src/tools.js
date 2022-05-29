import { logCurrentRunningFiber } from "./debug.js";
import {
  asyncUpdateTimeLimit,
  asyncUpdateTimeStep,
  currentRunningFiber,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactHookNode } from "./hook.js";
import { MyReactVDom } from "./vdom.js";

export const isEvent = (key) => key.startsWith("on");

export const isProperty = (key) =>
  key !== "children" &&
  !isEvent(key) &&
  !isStyle(key) &&
  // 编译之后加上的props
  key !== "__self" &&
  key !== "__source" &&
  key !== "dangerouslySetInnerHTML";

export const isNew = (oldProps, newProps) => (key) =>
  oldProps[key] !== newProps[key];

export const isGone = (newProps) => (key) => !(key in newProps);

export const isStyle = (key) => key === "style";

export const Memo = Symbol.for("Memo");

export const ForwardRef = Symbol.for("ForwardRef");

export const Portal = Symbol.for("Portal");

export const Fragment = Symbol.for("Fragment");

export const Context = Symbol.for("Context");

export const Provider = Symbol.for("Context.Provider");

export const Consumer = Symbol.for("Context.Consumer");

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {(f: MyReactFiberNode) => MyReactFiberNode} transfer
 * @returns
 */
export const getDom = (fiber, transfer = (fiber) => fiber.parent) => {
  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getDom(transfer(fiber), transfer);
    }
  }
};

export const createRef = (val) => ({ current: val });

/**
 *
 * @param {Function} action
 * @returns
 */
export const safeCall = (action) => {
  try {
    return action();
  } catch (e) {
    console.warn(
      "component tree:",
      logCurrentRunningFiber(),
      "\n",
      "-----------------------------------",
      "\n",
      e
    );
    throw e;
  }
};

export function isNormalEqual(src, target) {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;
    for (const key in src) {
      if (!key.startsWith("__")) {
        flag = flag && Object.is(src[key], target[key]);
        if (!flag) {
          return flag;
        }
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

export function isEqual(src, target) {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;
    for (const key in src) {
      if (key !== "children" && !key.startsWith("__")) {
        flag = flag && isEqual(src[key], target[key]);
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

export const flattenChildren = (arrayLike) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p.concat(flattenChildren(c)), []);
  }
  return [arrayLike];
};

export const map = (arrayLike, judge, action) => {
  const arrayChildren = flattenChildren(arrayLike);

  return arrayChildren.map((v, index, thisArgs) => {
    if (judge(v)) {
      return action.apply(thisArgs, [v, index]);
    } else {
      return v;
    }
  });
};

export const childrenCount = (arrayLike) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p + childrenCount(c), 0);
  }

  return 1;
};

export const mapVDom = (arrayLike, action) =>
  map(arrayLike, (v) => v instanceof MyReactVDom, action);

export const mapFiber = (arrayLike, action) =>
  map(arrayLike, (f) => f instanceof MyReactFiberNode, action);

export const only = (child) => {
  if (child instanceof MyReactVDom) {
    return child;
  }
  throw new Error("multiply child found!");
};

// in progress
export const getNativeEventName = (eventName) => {
  let isCapture = false;
  if (eventName.endsWith("Capture")) {
    isCapture = true;
    eventName = eventName.split("Capture")[0];
  }
  if (eventName === "DoubleClick") {
    eventName = "dblclick";
  } else {
    eventName = eventName.toLowerCase();
  }
  return {
    isCapture,
    eventName,
  };
};

export const updateAsyncTimeStep = () => {
  asyncUpdateTimeStep.current = new Date().getTime();
};

export const shouldYieldAsyncUpdateOrNot = () => {
  return (
    new Date().getTime() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit
  );
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const findLatestDomFromFiber = (fiber) => {
  let currentLoopFiberArray = [fiber];
  while (currentLoopFiberArray.length) {
    const _fiber = currentLoopFiberArray.shift();
    if (_fiber.dom) return _fiber.dom;
    if (_fiber.children.length) currentLoopFiberArray.push(..._fiber.children);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
export const findLatestDomFromComponentFiber = (fiber) => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    let re = null;
    for (let i = 0; i < fiber.children.length; i++) {
      re = findLatestDomFromFiber(fiber.children[i]);
      if (re) break;
    }
    return re;
  }
};

export class PriorityQueueByArrayAboutJudge extends Array {
  constructor(
    judgeFun = (o1, o2) => o1 < o2,
    transferFun = (it) => it,
    ...args
  ) {
    super(...args);
    this.judgeFun = judgeFun;
    this.transferFun = transferFun;
    this._init();
  }

  get length() {
    return this.length;
  }

  peek() {
    return this[0];
  }

  pushValue(val) {
    this.push(val);
    let current = this.length - 1;
    let pre = ((current - 1) / 2) | 0;
    while (
      pre >= 0 &&
      this.judgeFun(
        this.transferFun(this[pre]),
        this.transferFun(this[current])
      )
    ) {
      this._swap(pre, current);
      current = pre;
      pre = ((current - 1) / 2) | 0;
    }
  }

  popTop() {
    let re = this[0];
    this[0] = this[this.length - 1];
    this.pop();
    this._heapDown(0);
    return re;
  }

  _swap(i, j) {
    let temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  _heapDown(current) {
    let max = current;
    let left = current * 2 + 1;
    let right = current * 2 + 2;
    if (
      left < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[left]))
    ) {
      max = left;
    }
    if (
      right < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[right]))
    ) {
      max = right;
    }
    if (max !== current) {
      this._swap(max, current);
      this._heapDown(max);
    }
  }

  _init() {
    let start = ((this.length - 1) / 2) | 0;
    for (let i = start; i >= 0; i--) {
      this._heapDown(i);
    }
  }
}
