import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, include, type ListTreeNode } from "@my-react/react-shared";

import { NODE_TYPE } from "./fiberType";

import type { MyReactFiberContainer, MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement, lazy } from "@my-react/react";

const { currentRenderPlatform, currentRunningFiber } = __my_react_internal__;

const { enableOptimizeTreeLog } = __my_react_shared__;

export const originalWarn = console.warn;

export const originalError = console.error;

export const devWarn = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentRunningFiber.current;

  originalWarn.call(console, ...args.concat([renderPlatform.getFiberTree(currentRunningFiber.current), "\n", renderFiber]));
};

export const devError = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentRunningFiber.current;

  originalError.call(console, ...args.concat([renderPlatform.getFiberTree(currentRunningFiber.current), "\n", renderFiber]));
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
      preString = `${preString} (${fileName}:${lineNumber})`;
    }
    if (owner) {
      const ownerElement = owner as MyReactFiberNode;
      const ownerElementType = ownerElement.elementType;
      if (include(ownerElement.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
        const typedOwnerElementType = ownerElementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
        const name = typedOwnerElementType.name || typedOwnerElementType.displayName;
        preString = name ? `${preString} (render dy ${name})` : preString;
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

export const getRenderFiber = (fiber: MyReactFiberNode): MyReactFiberNode | null => {
  if (!fiber) return null;
  if (shouldIncludeLog(fiber)) return fiber;
  return getRenderFiber(fiber.parent);
};

export const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__memo__) {
    const targetRender = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = "";
    let res = "memo";
    if (fiber.type & NODE_TYPE.__provider__) {
      name = "Provider";
    } else if (fiber.type & NODE_TYPE.__consumer__) {
      name = "Consumer";
    } else if (typeof targetRender === "function") {
      name = targetRender?.displayName || targetRender?.name || name;
    }
    if (fiber.type & NODE_TYPE.__forwardRef__) {
      res += "-forwardRef";
    }
    return `<${name ? name : "anonymous"} - (${res}) />`;
  }
  if (fiber.type & NODE_TYPE.__lazy__) {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    const typedRender = typedElementType?.render;
    const name = typedRender?.displayName || typedRender?.name || "";
    return `<${name ? name : "anonymous"} - (lazy) />`;
  }
  if (fiber.type & NODE_TYPE.__portal__) return `<Portal />`;
  if (fiber.type & NODE_TYPE.__null__) return `<Null />`;
  if (fiber.type & NODE_TYPE.__empty__) return `<Empty />`;
  if (fiber.type & NODE_TYPE.__scope__) return `<Scope />`;
  if (fiber.type & NODE_TYPE.__strict__) return `<Strict />`;
  if (fiber.type & NODE_TYPE.__profiler__) return `<Profiler />`;
  if (fiber.type & NODE_TYPE.__suspense__) return `<Suspense />`;
  if (fiber.type & NODE_TYPE.__fragment__) {
    if (fiber.pendingProps["wrap"]) return `<Fragment - (auto-wrap) />`;
    return `<Fragment />`;
  }
  if (fiber.type & NODE_TYPE.__keepLive__) return `<KeepAlive />`;
  if (fiber.type & NODE_TYPE.__provider__) return `<Provider />`;
  if (fiber.type & NODE_TYPE.__consumer__) return `<Consumer />`;
  if (fiber.type & NODE_TYPE.__comment__) return `<Comment />`;
  if (fiber.type & NODE_TYPE.__forwardRef__) {
    const targetRender = fiber.elementType as MixinMyReactFunctionComponent;
    const name = targetRender?.displayName || targetRender?.name || "";
    return `<${name ? name : "anonymous"} - (forwardRef) />`;
  }
  if (typeof fiber.elementType === "string") return `<${fiber.elementType} />`;
  if (typeof fiber.elementType === "function") {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    const name = typedElementType.displayName || typedElementType.name || "anonymous";
    return `<${name} />`;
  }
  return `<text (${fiber.elementType?.toString()}) />`;
};

export const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)}${getTrackDevLog(fiber)}`;

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (fiber) {
    const preString = "".padEnd(4) + "at".padEnd(4);
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

export const getHookTree = (
  treeHookNode: ListTreeNode<MyReactHookNode>,
  errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }
) => {
  const pre = "".toString().padEnd(5);
  const message = "[@my-react/react] hook for current component has a different state on current render and previous render, this is not a valid usage.";
  const re = "\n" + pre + "Last render:".padEnd(28) + "Next render:".padEnd(10) + "\n" + pre + "-".repeat(44) + "\n";
  let stack = pre + HOOK_TYPE[errorType.lastRender].padEnd(28) + HOOK_TYPE[errorType.nextRender].padEnd(10) + "\n";
  while (treeHookNode && treeHookNode.value) {
    const t = treeHookNode.value.type;
    stack = pre + HOOK_TYPE[t].padEnd(28) + HOOK_TYPE[t].padEnd(10) + "\n" + stack;
    treeHookNode = treeHookNode.prev;
  }
  stack += pre + "^".repeat(44) + "\n";
  return message + re + stack;
};
