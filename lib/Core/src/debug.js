import { currentRunningFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactHookNode } from "./hook.js";

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
