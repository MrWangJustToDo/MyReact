import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { HOOK_TYPE, include, type ListTreeNode } from "@my-react/react-shared";

import { NODE_TYPE } from "./fiberType";

import type { MyReactFiberContainer, MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement, createContext, lazy } from "@my-react/react";

const { currentRenderPlatform, currentRunningFiber } = __my_react_internal__;

const { enableOptimizeTreeLog } = __my_react_shared__;

const warnMap = {};

const errorMap = {};

export const originalWarn = console.warn;

export const originalError = console.error;

export const devWarn = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentRunningFiber.current;

  const logObj = [];

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  if (renderFiber) {
    originalWarn.call(console, ...args, ...logObj.concat([renderPlatform.getFiberTree(currentRunningFiber.current), "\n", renderFiber]));
  } else {
    originalWarn.call(console, ...args, ...logObj);
  }
};

export const devWarnWithFiber = (fiber: MyReactFiberNode, ...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = fiber;

  const logObj = [];

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  originalWarn.call(console, ...args, ...logObj.concat([renderPlatform.getFiberTree(fiber), "\n", renderFiber]));
};

export const devError = (...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentRunningFiber.current;

  if (!renderFiber) {
    originalError.call(console, ...args);

    return;
  }

  const logObj = [];

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  if (renderFiber) {
    originalError.call(console, ...args, ...logObj.concat([renderPlatform.getFiberTree(currentRunningFiber.current), "\n", renderFiber]));
  } else {
    originalError.call(console, ...args, ...logObj);
  }
};

export const devErrorWithFiber = (fiber: MyReactFiberNode, ...args) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = fiber;

  const logObj = [];

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  if (logObj.some((i) => i instanceof Error)) {
    originalError.call(console, ...args, ...logObj.concat(["\n", renderFiber]));
  } else {
    originalError.call(console, ...args, ...logObj.concat([renderPlatform.getFiberTree(fiber), "\n", renderFiber]));
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
  if (fiber.type & NODE_TYPE.__memo__) {
    const targetRender = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = "";
    let res = "memo";
    if (fiber.type & NODE_TYPE.__provider__) {
      const typedTargetRender = fiber.elementType as ReturnType<typeof createContext>["Provider"];
      name = typedTargetRender.Context.displayName;
      res += "-provider";
    } else if (fiber.type & NODE_TYPE.__consumer__) {
      const typedTargetRender = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
      name = typedTargetRender.Context.displayName;
      res += "-consumer";
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
  if (fiber.type & NODE_TYPE.__provider__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Provider"];
    const name = typedElementType.Context.displayName;
    return `<${name ? name : "anonymous"} - (provider) />`;
  }
  if (fiber.type & NODE_TYPE.__consumer__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];
    const name = typedElementType.Context.displayName;
    return `<${name ? name : "anonymous"} - (consumer) />`;
  }
  if (fiber.type & NODE_TYPE.__comment__) return `<Comment />`;
  if (fiber.type & NODE_TYPE.__forwardRef__) {
    const targetRender = fiber.elementType as MixinMyReactFunctionComponent;
    const name = targetRender?.displayName || targetRender?.name || "";
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

export const getFiberTreeWithFiber = (fiber: MyReactFiberNode) => {
  const preString = "at".padEnd(3);
  let res = "";
  const arr = [];
  let temp = fiber;
  while (temp) {
    res ? (res += `\n${preString}${getFiberNodeNameWithFiber(temp)}`) : (res = `${preString}${getFiberNodeNameWithFiber(temp)}`);
    arr.push("color: white;background-color: rgba(10, 190, 235, 0.8); border-radius: 2px; padding: 1px 5px; margin: 1px 0px");
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
  const pre = "".toString().padEnd(4);
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

  const renderFiber = currentRunningFiber.current;

  if (!renderFiber) {
    if (warnMap?.[key]) return;

    warnMap[key] = true;

    devWarn(...args);

    return;
  }

  const logObj = [];

  const tree = renderPlatform.getFiberTree(renderFiber);

  if (warnMap?.[tree]?.[key]) return;

  warnMap[tree] = { ...warnMap?.[tree], [key]: true };

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  originalWarn.call(console, ...args, ...logObj.concat([tree, "\n", renderFiber]));
};

export const onceErrorWithKey = (key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderFiber = currentRunningFiber.current;

  if (!renderFiber) {
    if (errorMap?.[key]) return;

    errorMap[key] = true;

    devError(...args);

    return;
  }

  const logObj = [];

  const tree = renderPlatform.getFiberTree(renderFiber);

  if (errorMap?.[tree]?.[key]) return;

  errorMap[tree] = { ...errorMap?.[tree], [key]: true };

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  originalError.call(console, ...args, ...logObj.concat([tree, "\n", renderFiber]));
};

export const onceWarnWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const logObj = [];

  const tree = renderPlatform.getFiberTree(fiber);

  if (warnMap?.[tree]?.[key]) return;

  warnMap[tree] = { ...warnMap?.[tree], [key]: true };

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  originalWarn.call(console, ...args, ...logObj.concat([tree, "\n", fiber]));
};

export const onceErrorWithKeyAndFiber = (fiber: MyReactFiberNode, key: string, ...args: any[]) => {
  const renderPlatform = currentRenderPlatform.current;

  const logObj = [];

  const tree = renderPlatform.getFiberTree(fiber);

  if (errorMap?.[tree]?.[key]) return;

  errorMap[tree] = { ...errorMap?.[tree], [key]: true };

  // const logString = args
  //   .map((i) => {
  //     if (isObject(i)) {
  //       logObj.push(i);
  //       return "%o";
  //     } else {
  //       return i;
  //     }
  //   })
  //   .join(" ");

  originalError.call(console, ...args, ...logObj.concat([tree, "\n", fiber]));
};
