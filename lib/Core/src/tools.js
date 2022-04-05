import { currentRunningFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";

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

export const safeCall = (action) => {
  try {
    return action();
  } catch (e) {
    console.warn(logFiber(currentRunningFiber.current), "\n", e);
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
    for (let key in src) {
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
  if (typeof src === "object" && typeof target === "object") {
    let flag = true;
    for (let key in src) {
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

export const map = (arrayLike, judge, action) => {
  if (Array.isArray(arrayLike)) {
    arrayLike.forEach((item) => map(item, judge, action));
  }
  if (judge(arrayLike)) {
    action.call(null, arrayLike);
  }
};

// in progress
export const getNativeEventName = (eventName) => {
  if (eventName === "DoubleClick") {
    return "dblclick";
  }
  return eventName.toLowerCase();
};
