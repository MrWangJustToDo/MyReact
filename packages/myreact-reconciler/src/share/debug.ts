import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, include, type ListTreeNode } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";

import { currentCallingFiber, enableFiberForLog } from "./env";
import { NODE_TYPE } from "./fiberType";
import { getCurrentDispatchFromFiber } from "./refresh";
import { safeCallWithCurrentFiber } from "./safeCall";

import type { MyReactFiberContainer, MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type {
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
  MixinMyReactObjectComponent,
  MyReactElement,
  createContext,
  lazy,
} from "@my-react/react";

const { currentRenderPlatform, currentRunningFiber, currentScopeFiber } = __my_react_internal__;

const { enableOptimizeTreeLog } = __my_react_shared__;

const typeColor = {
  normal: "rgba(10, 190, 235, 0.8)",
  plain: "rgba(100, 230, 40, 0.8)",
  unmount: "rgba(230, 40, 40, 0.8)",
};

const warnMap = {};

const errorMap = {};

const fiberWarn = (fiber: MyReactFiberNode, ...args) => {
  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberWarnListener() {
      try {
        listenerMap.get(renderDispatch)?.fiberWarn?.forEach((listener) => listener(fiber, ...args));
      } catch {
        void 0;
      }
    },
  });
};

const fiberError = (fiber: MyReactFiberNode, ...args) => {
  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberErrorListener() {
      try {
        listenerMap.get(renderDispatch)?.fiberError?.forEach((listener) => listener(fiber, ...args));
      } catch {
        void 0;
      }
    },
  });
};

// TODO! improve log

export const originalWarn = console.warn;

export const originalError = console.error;

let warnFiber: MyReactFiberNode | null = null;

let errorFiber: MyReactFiberNode | null = null;

export const devWarn = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = warnFiber || currentCallingFiber.current || currentScopeFiber.current || currentRunningFiber.current;

  renderFiber && fiberWarn(renderFiber as MyReactFiberNode, ...args);

  const treeLog = renderFiber ? renderPlatform.getFiberTree(renderFiber) : "";

  if (enableFiberForLog.current && renderFiber) {
    originalWarn.call(console, ...args, treeLog + "\n", renderFiber);
  } else {
    originalWarn.call(console, ...args, treeLog);
  }
};

export const devWarnWithFiber = (fiber: MyReactFiberNode, ...args) => {
  warnFiber = fiber;

  devWarn(...args);

  // TODO
  warnFiber = null;
};

export const devError = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = errorFiber || currentCallingFiber.current || currentScopeFiber.current || currentRunningFiber.current;

  renderFiber && fiberError(renderFiber as MyReactFiberNode, ...args);

  const treeLog = renderFiber ? renderPlatform.getFiberTree(renderFiber) : "";

  if (enableFiberForLog.current && renderFiber) {
    originalError.call(console, ...args, "", treeLog + "\n", renderFiber);
  } else {
    originalError.call(console, ...args, "", treeLog);
  }
};

export const devErrorWithFiber = (fiber: MyReactFiberNode, ...args) => {
  errorFiber = fiber;

  devError(...args);

  errorFiber = null;
};

export const setLogScope = () => {
  if (__DEV__) {
    console.warn = devWarn;

    console.error = devError;
  }
};

export const resetLogScope = () => {
  if (__DEV__) {
    console.warn = originalWarn;

    console.error = originalError;
  }
};

export const debugWithNode = (fiber: MyReactFiberNode) => {
  const mayFiberContainer = fiber as MyReactFiberContainer;
  if (fiber.nativeNode || mayFiberContainer.containerNode) {
    const node = (fiber.nativeNode || mayFiberContainer.containerNode) as any;
    node.__fiber__ = fiber;
    node.__props__ = fiber.pendingProps;
  }
};

const getTrackDevLog = (fiber: MyReactFiberNode) => {
  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;
    const element = typedFiber._debugElement;
    const source = typeof element === "object" ? (element as MyReactElement)?.["_source"] : null;
    const owner = typeof element === "object" ? (element as MyReactElement)?.["_owner"] : null;
    let preString = "";
    if (source) {
      const { fileName, lineNumber } = source || {};
      preString = `${preString}(${fileName}:${lineNumber}) `;
    }
    if (owner) {
      const ownerFiber = owner as MyReactFiberNodeDev;
      const ownerFiberElementType = ownerFiber.elementType;
      if (include(ownerFiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
        const ownerElement = ownerFiber._debugElement as MyReactElement;
        const typedOwnerElementType = ownerFiberElementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
        let name = typedOwnerElementType.displayName || typedOwnerElementType.name;
        name = typeof ownerElement.type === "object" ? ownerElement.type.displayName : name;
        preString = name ? `${preString}(render dy ${name})` : preString;
      }
    }
    return preString;
  } else {
    return "";
  }
};

const shouldIncludeLog = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    return true;
  }
  return false;
};

const getFiberTagName = (fiber: MyReactFiberNode) => {
  const tag: string[] = [];
  if (fiber.type & NODE_TYPE.__memo__) {
    tag.push("memo");
  }
  if (fiber.type & NODE_TYPE.__forwardRef__) {
    tag.push("forwardRef");
  }
  if (fiber.type & NODE_TYPE.__lazy__) {
    tag.push("lazy");
  }
  if (fiber.type & NODE_TYPE.__fragment__ && fiber.pendingProps["wrap"]) {
    tag.push("auto-wrap");
  }
  return tag.join("-");
};

export const getPlainFiberName = (fiber: MyReactFiberNode) => {
  const typedFiber = fiber as MyReactFiberNodeDev;
  if (fiber.type & NODE_TYPE.__provider__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Provider"];
    const name = typedElementType.Context.displayName;
    return `${name || "Context"}.Provider`;
  }
  if (fiber.type & NODE_TYPE.__context__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>;
    const name = typedElementType.displayName;
    return `${name || "Context"}`;
  }
  if (fiber.type & NODE_TYPE.__consumer__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
    const name = typedElementType.Context.displayName;
    return `${name || "Context"}.Consumer`;
  }
  if (fiber.type & NODE_TYPE.__lazy__) {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    const typedRender = typedElementType?.render;
    let name = typedRender?.displayName || typedRender?.name || "";
    if (__DEV__) {
      const element = typedFiber._debugElement as MyReactElement;
      // may be a Suspense element
      const type = element?.type as MixinMyReactObjectComponent;
      name = type?.displayName || name;
    }
    return `${name || "Anonymous"}`;
  }
  if (fiber.type & NODE_TYPE.__portal__) return `Portal`;
  if (fiber.type & NODE_TYPE.__null__) return `Null`;
  if (fiber.type & NODE_TYPE.__empty__) return `Empty`;
  if (fiber.type & NODE_TYPE.__scope__) return `Scope`;
  if (fiber.type & NODE_TYPE.__scopeLazy__) return `ScopeLazy`;
  if (fiber.type & NODE_TYPE.__scopeSuspense__) return `ScopeSuspense`;
  if (fiber.type & NODE_TYPE.__strict__) return `Strict`;
  if (fiber.type & NODE_TYPE.__profiler__) return `Profiler`;
  if (fiber.type & NODE_TYPE.__suspense__) return `Suspense`;
  if (fiber.type & NODE_TYPE.__comment__) return `Comment`;
  if (fiber.type & NODE_TYPE.__keepLive__) return `KeepAlive`;
  if (fiber.type & NODE_TYPE.__fragment__) return `Fragment`;
  if (fiber.type & NODE_TYPE.__text__) return `text`;
  if (typeof fiber.elementType === "string") return `${fiber.elementType}`;
  if (typeof fiber.elementType === "function") {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = typedElementType.displayName || typedElementType.name || "Anonymous";
    if (__DEV__) {
      const element = typedFiber._debugElement as MyReactElement;
      const type = element?.type as MixinMyReactObjectComponent;
      name = type?.displayName || name;
    }
    return `${name}`;
  }
  return `unknown`;
};

// TODO
export const getElementName = (fiber: MyReactFiberNode) => {
  const name = getPlainFiberName(fiber);
  const tag = getFiberTagName(fiber);
  return `<${name}${tag ? ` - (${tag})` : ""} />`;
};

const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)} ${getTrackDevLog(fiber)}`;

const getFiberNodeNameWithFiber = (fiber: MyReactFiberNode) => `%c${getElementName(fiber)}%c (%o)`;

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (fiber) {
    const preString = "".padEnd(4) + "at".padEnd(3);
    let res = "";
    let temp = fiber;
    if (enableOptimizeTreeLog.current) {
      while (temp) {
        if (shouldIncludeLog(temp)) {
          res ? (res += `\n${preString}${getFiberNodeName(temp)}`) : (res = `${preString}${getFiberNodeName(temp)}`);
        }
        temp = temp.parent;
      }
    } else {
      while (temp) {
        res ? (res += `\n${preString}${getFiberNodeName(temp)}`) : (res = `${preString}${getFiberNodeName(temp)}`);
        temp = temp.parent;
      }
    }
    return `\n${res}`;
  }
  return "";
};

export const getStackTree = (fiber: MyReactFiberNode) => {
  const preString = "".padEnd(4) + "at".padEnd(3);
  let res = "";
  let temp = fiber;
  while (temp) {
    res ? (res += `\n${preString}${getElementName(temp)}`) : (res = `${preString}${getElementName(temp)}`);
    temp = temp.parent;
  }
  return `\n${res}`;
};

export const getFiberTreeWithFiber = (fiber: MyReactFiberNode) => {
  const preString = "at".padEnd(3);
  let res = "";
  const arr = [];
  let temp = fiber;
  while (temp) {
    res ? (res += `\n${preString}${getFiberNodeNameWithFiber(temp)}`) : (res = `${preString}${getFiberNodeNameWithFiber(temp)}`);
    const isMount = (temp as MyReactFiberNodeDev)._debugIsMount;
    const isPlain = temp.type & NODE_TYPE.__plain__;
    arr.push(
      `color: white;background-color: ${isMount ? (isPlain ? typeColor.plain : typeColor.normal) : typeColor.unmount}; border-radius: 2px; padding: 1px 5px; margin: 1px 0px`
    );
    arr.push("");
    arr.push(temp);
    temp = temp.parent;
  }
  return { str: `${res}`, arr };
};

export const getHookTree = (
  treeHookNode: ListTreeNode<MyReactHookNode>,
  errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }
) => {
  const pre = "".toString().padEnd(3);
  const message = "[@my-react/react] hook for current component has a different state on current render and previous render, this is not a valid usage.";
  const re = "\n" + pre + "Last render:".padEnd(28) + "Next render:".padEnd(10) + "\n" + pre + "-".repeat(44) + "\n";
  let stack = pre + HOOK_TYPE[errorType.lastRender].padEnd(28) + HOOK_TYPE[errorType.nextRender].padEnd(10) + "\n";
  while (treeHookNode && treeHookNode.value) {
    const t = treeHookNode.value.type;
    stack = pre + HOOK_TYPE[t].padEnd(28) + HOOK_TYPE[t].padEnd(10) + "\n" + stack;
    treeHookNode = treeHookNode.prev;
  }
  stack += pre + "^".repeat(44);
  return message + re + stack;
};

export const onceWarnWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: string[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const tree = renderPlatform.getFiberTree(fiber);

  if (warnMap?.[tree]?.[key]) return;

  warnMap[tree] = { ...warnMap?.[tree], [key]: true };

  warnFiber = fiber;

  devWarn(...args);

  warnFiber = null;
};

export const onceErrorWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: string[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const tree = renderPlatform.getFiberTree(fiber);

  if (errorMap?.[tree]?.[key]) return;

  errorMap[tree] = { ...errorMap?.[tree], [key]: true };

  errorFiber = fiber;

  devError(...args);

  errorFiber = null;
};
