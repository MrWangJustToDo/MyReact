import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, include, type ListTreeNode } from "@my-react/react-shared";

import { currentDevFiber, enableFiberForLog } from "./env";
import { NODE_TYPE } from "./fiberType";

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

const { currentRenderPlatform, currentRunningFiber } = __my_react_internal__;

const { enableOptimizeTreeLog } = __my_react_shared__;

const warnMap = {};

const errorMap = {};

export const originalWarn = console.warn;

export const originalError = console.error;

export const devWarn = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentDevFiber.current || currentRunningFiber.current;

  if (renderFiber) {
    if (enableFiberForLog.current) {
      originalWarn.call(console, ...args, ...[renderPlatform.getFiberTree(renderFiber), "\n  ", renderFiber]);
    } else {
      originalWarn.call(console, ...args, renderPlatform.getFiberTree(renderFiber));
    }
  } else {
    originalWarn.call(console, ...args);
  }
};

export const devWarnWithFiber = (fiber: MyReactFiberNode, ...args) => {
  const renderPlatform = currentRenderPlatform.current;

  if (enableFiberForLog.current) {
    originalWarn.call(console, ...args, ...[renderPlatform.getFiberTree(fiber), "\n  ", fiber]);
  } else {
    originalWarn.call(console, ...args, renderPlatform.getFiberTree(fiber));
  }
};

export const devError = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentDevFiber.current || currentRunningFiber.current;

  if (!renderFiber || args.some((i) => typeof i === "object" || i === null || i === undefined)) {
    originalError.call(console, ...args);

    return;
  }

  if (enableFiberForLog.current) {
    originalError.call(console, ...args, ...[renderPlatform.getFiberTree(renderFiber), "\n  ", renderFiber]);
  } else {
    originalError.call(console, ...args, renderPlatform.getFiberTree(renderFiber));
  }
};

export const devErrorWithFiber = (fiber: MyReactFiberNode, ...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = fiber;

  if (args.some((i) => typeof i === "object" || i === null || i === undefined)) {
    originalError.call(console, ...args, renderFiber);
  } else {
    if (enableFiberForLog.current) {
      originalError.call(console, ...args, ...[renderPlatform.getFiberTree(renderFiber), "\n  ", renderFiber]);
    } else {
      originalError.call(console, ...args, renderPlatform.getFiberTree(renderFiber));
    }
  }
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
      const ownerElement = owner as MyReactFiberNode;
      const ownerElementType = ownerElement.elementType;
      if (include(ownerElement.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
        const typedOwnerElementType = ownerElementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
        const name = typedOwnerElementType.name || typedOwnerElementType.displayName;
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

// TODO
export const getElementName = (fiber: MyReactFiberNode) => {
  const typedFiber = fiber as MyReactFiberNodeDev;
  if (fiber.type & NODE_TYPE.__memo__) {
    const targetRender = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = "";
    let res = "memo";
    if (fiber.type & NODE_TYPE.__provider__) {
      const typedTargetRender = fiber.elementType as ReturnType<typeof createContext>["Provider"];
      name = typedTargetRender.Context.displayName || "anonymous" + "-" + typedTargetRender.Context.contextId;
      res += "-provider";
    } else if (fiber.type & NODE_TYPE.__consumer__) {
      const typedTargetRender = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
      name = typedTargetRender.Context.displayName || "anonymous" + "-" + typedTargetRender.Context.contextId;
      res += "-consumer";
    } else if (typeof targetRender === "function") {
      name = targetRender?.displayName || targetRender?.name || name;
    }
    if (__DEV__) {
      const element = typedFiber._debugElement as MyReactElement;
      const type = element.type as MixinMyReactObjectComponent;
      name = name || type.displayName;
    }
    if (fiber.type & NODE_TYPE.__forwardRef__) {
      res += "-forwardRef";
    }
    return `<${name ? name : "anonymous"} - (${res}) />`;
  }
  if (fiber.type & NODE_TYPE.__lazy__) {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    const typedRender = typedElementType?.render;
    let name = typedRender?.displayName || typedRender?.name || "";
    if (__DEV__) {
      const element = typedFiber._debugElement as MyReactElement;
      const type = element.type as MixinMyReactObjectComponent;
      name = name || type.displayName;
    }
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
  if (fiber.type & NODE_TYPE.__provider__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Provider"];
    const name = typedElementType.Context.displayName;
    return `<${name ? name : "anonymous" + "-" + typedElementType.Context.contextId} - (provider) />`;
  }
  if (fiber.type & NODE_TYPE.__consumer__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
    const name = typedElementType.Context.displayName;
    return `<${name ? name : "anonymous" + "-" + typedElementType.Context.contextId} - (consumer) />`;
  }
  if (fiber.type & NODE_TYPE.__comment__) return `<Comment />`;
  if (fiber.type & NODE_TYPE.__forwardRef__) {
    const targetRender = fiber.elementType as MixinMyReactFunctionComponent;
    let name = targetRender?.displayName || targetRender?.name || "";
    if (__DEV__) {
      const element = typedFiber._debugElement as MyReactElement;
      const type = element.type as MixinMyReactObjectComponent;
      name = name || type.displayName;
    }
    return `<${name ? name : "anonymous"} - (forwardRef) />`;
  }
  if (typeof fiber.elementType === "function") {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    const name = typedElementType.displayName || typedElementType.name || "anonymous";
    return `<${name} />`;
  }
  if (fiber.type & NODE_TYPE.__text__) return `<text (${fiber.elementType?.toString()}) />`;
  if (typeof fiber.elementType === "string") return `<${fiber.elementType} />`;
  return `<unknown (${fiber.elementType?.toString()}) />`;
};

export const getPlainFiberName = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    const name = typedElementType.displayName || typedElementType.name || "Anonymous";
    return name;
  }
  if (include(fiber.type, NODE_TYPE.__comment__)) return `Comment`;
  if (include(fiber.type, NODE_TYPE.__provider__)) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Provider"];
    const name = typedElementType.Context.displayName || "Context";
    return `${name}.Provider`;
  }
  if (include(fiber.type, NODE_TYPE.__consumer__)) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
    const name = typedElementType.Context.displayName || "Context";
    return `${name}.Consumer`;
  }
  if (include(fiber.type, NODE_TYPE.__fragment__)) return `Fragment`;
  if (include(fiber.type, NODE_TYPE.__suspense__)) return `Suspense`;
  if (include(fiber.type, NODE_TYPE.__profiler__)) return `Profiler`;
  if (include(fiber.type, NODE_TYPE.__lazy__)) return `Lazy`;
  if (include(fiber.type, NODE_TYPE.__scope__)) return `Scope`;
  if (include(fiber.type, NODE_TYPE.__portal__)) return `Portal`;
  if (include(fiber.type, NODE_TYPE.__strict__)) return `Strict`;
  if (include(fiber.type, NODE_TYPE.__null__ | NODE_TYPE.__empty__)) return `Null`;
};

const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)} ${getTrackDevLog(fiber)}`;

const getFiberNodeMaxRenderTime = (_fiber: MyReactFiberNode) => {
  // const typedFiber = fiber as MyReactFiberNodeDev;
  // if (typedFiber._debugRenderState) {
  //   const { maxTimeForRender, timeForRender } = typedFiber._debugRenderState;
  //   return ` - ${timeForRender}|${maxTimeForRender}ms`;
  // }
  return "";
};

const getFiberNodeNameWithFiber = (fiber: MyReactFiberNode) => `%c${getElementName(fiber)}${getFiberNodeMaxRenderTime(fiber)}%c (%o)`;

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

export const getFiberTreeWithFiber = (fiber: MyReactFiberNode) => {
  const preString = "at".padEnd(3);
  let res = "";
  const arr = [];
  let temp = fiber;
  while (temp) {
    res ? (res += `\n${preString}${getFiberNodeNameWithFiber(temp)}`) : (res = `${preString}${getFiberNodeNameWithFiber(temp)}`);
    const isMount = (temp as MyReactFiberNodeDev)._debugIsMount;
    arr.push(`color: white;background-color: ${isMount ? "rgba(10, 190, 235, 0.8)" : "red"}; border-radius: 2px; padding: 1px 5px; margin: 1px 0px`);
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

export const onceWarnWithKey = (key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentDevFiber.current || currentRunningFiber.current;

  if (!renderFiber) {
    if (warnMap?.[key]) return;

    warnMap[key] = true;

    devWarn(...args);

    return;
  }

  const tree = renderPlatform.getFiberTree(renderFiber);

  if (warnMap?.[tree]?.[key]) return;

  warnMap[tree] = { ...warnMap?.[tree], [key]: true };

  if (enableFiberForLog.current) {
    originalWarn.call(console, ...args, ...[tree, "\n  ", renderFiber]);
  } else {
    originalWarn.call(console, ...args, tree);
  }
};

export const onceErrorWithKey = (key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentDevFiber.current || currentRunningFiber.current;

  if (!renderFiber) {
    if (errorMap?.[key]) return;

    errorMap[key] = true;

    devError(...args);

    return;
  }

  const tree = renderPlatform.getFiberTree(renderFiber);

  if (errorMap?.[tree]?.[key]) return;

  errorMap[tree] = { ...errorMap?.[tree], [key]: true };

  if (enableFiberForLog.current) {
    originalError.call(console, ...args, ...[tree, "\n  ", renderFiber]);
  } else {
    originalError.call(console, ...args, tree);
  }
};

export const onceWarnWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const tree = renderPlatform.getFiberTree(fiber);

  if (warnMap?.[tree]?.[key]) return;

  warnMap[tree] = { ...warnMap?.[tree], [key]: true };

  if (enableFiberForLog.current) {
    originalWarn.call(console, ...args, ...[tree, "\n  ", fiber]);
  } else {
    originalWarn.call(console, ...args, tree);
  }
};

export const onceErrorWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const tree = renderPlatform.getFiberTree(fiber);

  if (errorMap?.[tree]?.[key]) return;

  errorMap[tree] = { ...errorMap?.[tree], [key]: true };

  if (enableFiberForLog.current) {
    originalError.call(console, ...args, ...[tree, "\n  ", fiber]);
  } else {
    originalError.call(console, ...args, tree);
  }
};
