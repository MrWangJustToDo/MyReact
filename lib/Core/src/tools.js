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
  key !== "children" && !isEvent(key) && !isStyle(key);

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
 * @param {MyReactFiberNode} fiber
 */
export const getFiberNodeName = (fiber) => {
  if (fiber.__root__) return "<Root />";
  if (fiber.__isTextNode__) return `<text - (${fiber.__vdom__}) />`;
  if (fiber.__isPlainNode__) return `<${fiber.__vdom__.type} />`;
  if (fiber.__isDynamicNode__)
    return `<${fiber.__vdom__.type.name || "Unknown"} * />`;
  if (fiber.__isFragmentNode__) return `<Fragment />`;
  if (fiber.__isObjectNode__) {
    if (fiber.__isForwardRef__) return `<ForwardRef />`;
    if (fiber.__isPortal__) return `<Portal />`;
    if (fiber.__isContextProvider__) return `<Provider />`;
    if (fiber.__isContextConsumer__) return `<Consumer />`;
    if (fiber.__isMemo__) return `<Memo />`;
  }
  if (fiber.__isEmptyNode__) return `<Empty />`;
  throw new Error("unknow fiber type");
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
export const logFiber = (fiber) => {
  if (fiber) {
    let parent = fiber.fiberParent;
    let res = `fond in --> ${getFiberNodeName(fiber)}`;
    while (parent) {
      res = "".padStart(12) + `${getFiberNodeName(parent)}\n${res}`;
      parent = parent.fiberParent;
    }
    return "\n" + res;
  } else {
    return "";
  }
};

export const logCurrentRunningFiber = () =>
  logFiber(currentRunningFiber.current);

/**
 *
 * @param {MyReactHookNode} hookNode
 * @param {string} newHookType
 */
export const logHook = (hookNode, newHookType) => {
  let re = "";
  let prevHook = hookNode.hookPrev;
  while (prevHook) {
    re =
      (prevHook.hookIndex + 1).toString().padEnd(6) +
      prevHook.hookType.padEnd(20) +
      prevHook.hookType.padEnd(10) +
      "\n" +
      re;

    prevHook = prevHook.hookPrev;
  }

  re = "".padEnd(6) + "-".padEnd(30, "-") + "\n" + re;

  re =
    "".padEnd(6) +
    "Previous render".padEnd(20) +
    "Next render".padEnd(10) +
    "\n" +
    re;

  re =
    re +
    "--->".padEnd(6) +
    hookNode.hookType.padEnd(20) +
    newHookType.padEnd(10);

  return re;
};

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
      flag = flag && Object.is(src[key], target[key]);
      if (!flag) {
        return flag;
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
      if (key !== "children") {
        flag = flag && isEqual(src[key], target[key]);
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns {MyReactFiberNode | null}
 */
const getProviderFiber = (fiber, providerObject) => {
  if (fiber) {
    if (
      fiber.__isObjectNode__ &&
      fiber.__isContextProvider__ &&
      fiber.__vdom__.type === providerObject
    ) {
      return fiber;
    } else {
      return getProviderFiber(fiber.fiberParent, providerObject);
    }
  }
};

export const getContextFiber = (fiber, ContextObject) => {
  if (!ContextObject) return;
  if (ContextObject.type !== Context) throw new Error("错误的用法");
  const providerFiber = getProviderFiber(fiber, ContextObject.Provider);
  if (!providerFiber) throw new Error("context need provider");
  return providerFiber;
};

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
export const debuggerFiber = (fiber) => {
  if (fiber?.dom) {
    fiber.dom.__fiber__ = fiber;
    fiber.dom.__vdom__ = fiber.__vdom__;
    fiber.dom.__children__ = fiber.children;
  }
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
