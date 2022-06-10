import { currentRunningFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber/index.js";
import { MyReactHookNode } from "./hook/instance.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const trackDevLog = (fiber) => {
  const vdom = fiber.__vdom__;
  const source = vdom?.props?.__source;
  if (source) {
    const { fileName, lineNumber } = source;
    return ` (${fileName}:${lineNumber})`;
  } else {
    return "";
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const getFiberNodeName = (fiber) => {
  if (fiber.__root__) return `<Root />${trackDevLog(fiber)}`;
  if (fiber.__isMemo__) return `<Memo />${trackDevLog(fiber)}`;
  if (fiber.__isPortal__) return `<Portal />${trackDevLog(fiber)}`;
  if (fiber.__isEmptyNode__) return `<Empty />${trackDevLog(fiber)}`;
  if (fiber.__isForwardRef__) return `<ForwardRef />${trackDevLog(fiber)}`;
  if (fiber.__isFragmentNode__) return `<Fragment />${trackDevLog(fiber)}`;
  if (fiber.__isContextProvider__) return `<Provider />${trackDevLog(fiber)}`;
  if (fiber.__isContextConsumer__) return `<Consumer />${trackDevLog(fiber)}`;
  if (fiber.__isPlainNode__)
    return `<${fiber.__vdom__.type} />${trackDevLog(fiber)}`;
  if (fiber.__isTextNode__)
    return `<text - (${fiber.__vdom__}) />${trackDevLog(fiber)}`;
  if (fiber.__isDynamicNode__)
    return `<${
      fiber.__vdom__.type.displayName || fiber.__vdom__.type.name || "Unknown"
    } */> ${trackDevLog(fiber)}`;
  return `<Undefined />${trackDevLog(fiber)}`;
};

const preString = "".padEnd(4) + "at".padEnd(4);

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const getFiberTree = (fiber) => {
  if (fiber) {
    let parent = fiber.fiberParent;
    let res = preString + `${getFiberNodeName(fiber)}`;
    while (parent) {
      res = preString + `${getFiberNodeName(parent)}\n` + res;
      parent = parent.fiberParent;
    }
    return "\n" + res;
  }
  return "";
};

const cache = {};

/**
 *
 * @param {{message: string, fiber: MyReactFiberNode}} param
 */
const warning = ({ message, fiber, treeOnce }) => {
  const tree = getFiberTree(fiber || currentRunningFiber.current);
  if (treeOnce) {
    if (cache[tree]) return;
    cache[tree] = true;
  }
  console.warn(
    "[warning]:",
    "\n-----------------------------------------\n",
    `${message}`,
    "\n-----------------------------------------\n",
    "component tree:",
    tree
  );
};

/**
 *
 * @param {{message: string, fiber: MyReactFiberNode}} param
 */
const error = ({ message, fiber }) => {
  console.error(
    "[error]:",
    "\n-----------------------------------------\n",
    `${message}`,
    "\n-----------------------------------------\n",
    "component tree:",
    getFiberTree(fiber || currentRunningFiber.current)
  );
  throw new Error(message);
};

/**
 *
 * @param {MyReactHookNode} hookNode
 * @param {string} newHookType
 */
const getHookTree = (hookNode, newHookType) => {
  const fiber = hookNode.__fiber__;
  let currentHook = fiber.hookHead;
  let re =
    "\n" +
    "".padEnd(6) +
    "Prev render:".padEnd(20) +
    "Next render:".padEnd(10) +
    "\n";

  while (currentHook !== hookNode) {
    if (currentHook) {
      re +=
        (currentHook.hookIndex + 1).toString().padEnd(6) +
        currentHook.hookType.padEnd(20) +
        currentHook.hookType.padEnd(10) +
        "\n";
      currentHook = currentHook.hookNext;
    } else {
      break;
    }
  }

  re +=
    (hookNode.hookIndex + 1).toString().padEnd(6) +
    hookNode.hookType.padEnd(20) +
    newHookType.padEnd(10) +
    "\n";
  re += "".padEnd(6) + "^".repeat(30) + "\n";

  return re;
};

const safeCall = (action, ...args) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    error({ message: e?.stack ? e.stack : e.message });
  }
};

const safeCallWithFiber = ({ action, fiber }, ...args) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    error({
      message: e?.stack ? e.message + "\n" + e.stack : e.message,
      fiber,
    });
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const debugWithDom = (fiber) => {
  if (fiber?.dom) {
    fiber.dom.__fiber__ = fiber;
    fiber.dom.__vdom__ = fiber.__vdom__;
    fiber.dom.__children = fiber.children;
  }
};

export {
  error,
  warning,
  safeCall,
  getHookTree,
  getFiberTree,
  debugWithDom,
  safeCallWithFiber,
};
