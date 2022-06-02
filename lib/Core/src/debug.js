import { currentRunningFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactHookNode } from "./hook.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const trackDevLog = (fiber) => {
  const vdom = fiber.__vdom__;
  const source = vdom.props.__source;
  if (source) {
    const { fileName, columnNumber, lineNumber } = source;
    return `(${fileName}:${lineNumber})`;
  } else {
    return "";
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
export const getFiberNodeName = (fiber) => {
  if (fiber.__root__) return `<Root /> ${trackDevLog(fiber)}`;
  if (fiber.__isTextNode__) return `<text - (${fiber.__vdom__}) />`;
  if (fiber.__isPlainNode__)
    return `<${fiber.__vdom__.type} /> ${trackDevLog(fiber)}`;
  if (fiber.__isDynamicNode__)
    return `<${fiber.__vdom__.type.name || "Unknown"} * /> ${trackDevLog(
      fiber
    )}`;
  if (fiber.__isFragmentNode__) return `<Fragment /> ${trackDevLog(fiber)}`;
  if (fiber.__isObjectNode__) {
    if (fiber.__isForwardRef__) return `<ForwardRef /> ${trackDevLog(fiber)}`;
    if (fiber.__isPortal__) return `<Portal /> ${trackDevLog(fiber)}`;
    if (fiber.__isContextProvider__)
      return `<Provider /> ${trackDevLog(fiber)}`;
    if (fiber.__isContextConsumer__)
      return `<Consumer /> ${trackDevLog(fiber)}`;
    if (fiber.__isMemo__) return `<Memo /> ${trackDevLog(fiber)}`;
  }
  if (fiber.__isEmptyNode__) return `<Empty /> ${trackDevLog(fiber)}`;
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

export const logCurrentRunningFiber = () => {
  return logFiber(currentRunningFiber.current);
};

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

export const safeCall = (action) => {
  try {
    return action();
  } catch (e) {
    console.error(
      "component tree:",
      logCurrentRunningFiber(),
      "\n--------------------------------\n"
    );
    throw e;
  }
};
