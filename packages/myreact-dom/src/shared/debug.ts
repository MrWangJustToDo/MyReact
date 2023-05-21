import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE, originalError, originalWarn } from "@my-react/react-reconciler";

import type { MyReactElement, MixinMyReactClassComponent, MixinMyReactFunctionComponent, lazy, LogProps } from "@my-react/react";
import type { MyReactFiberNode, MyReactHookNode } from "@my-react/react-reconciler";
import type { ListTreeNode } from "@my-react/react-shared";
import type { ClientDomDispatch } from "@my-react-dom-client";

const { enableOptimizeTreeLog } = __my_react_shared__;

const { currentRunningFiber } = __my_react_internal__;

const cache: Record<string, Record<string, boolean>> = {};

const getTrackDevLog = (fiber: MyReactFiberNode) => {
  if (__DEV__) {
    const element = fiber.element;
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
      if (ownerElement.type & (NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
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
  if (typeof fiber.elementType === "function" && !(fiber.type & NODE_TYPE.__forwardRef__)) {
    return true;
  } else {
    return false;
  }
};

const getRenderFiber = (fiber: MyReactFiberNode) => {
  if (!fiber) return "";
  if (shouldIncludeLog(fiber)) return fiber;
  return getRenderFiber(fiber.parent);
};

export const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__memo__) {
    const targetRender = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = "";
    if (typeof targetRender === "function") {
      name = targetRender?.displayName || targetRender?.name || name;
    }
    return name ? `<Memo - (${name}) />` : `<Memo />`;
  }
  if (fiber.type & NODE_TYPE.__lazy__) {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    const typedRender = typedElementType?.render;
    const name = typedRender?.displayName || typedRender?.name || "";
    return name ? `<Lazy - (${name}) />` : `<Lazy />`;
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
    return name ? `<ForwardRef - (${name}) />` : `<ForwardRef />`;
  }
  if (typeof fiber.elementType === "string") return `<${fiber.elementType} />`;
  if (typeof fiber.elementType === "function") {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    const name = typedElementType.displayName || typedElementType.name || "anonymous";
    return `<${name} />`;
  }
  if (typeof fiber.element === "object" && fiber.element !== null) {
    return `<unknown />`;
  } else {
    return `<text (${fiber.element?.toString()}) />`;
  }
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
  const re = "\n" + pre + "Last render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
  let stack = pre + errorType.lastRender.padEnd(20) + errorType.nextRender.padEnd(10) + "\n";
  while (treeHookNode && treeHookNode.value) {
    const t = treeHookNode.value.type;
    stack = pre + t.padEnd(20) + t.padEnd(10) + "\n" + stack;
    treeHookNode = treeHookNode.prev;
  }
  stack += pre + "^".repeat(30) + "\n";
  return re + stack;
};

export const log = ({ fiber, message, level = "warn", triggerOnce = false }: LogProps) => {
  if (__DEV__) {
    const currentFiber = fiber || currentRunningFiber.current;
    const tree = getFiberTree(currentFiber as MyReactFiberNode);
    if (triggerOnce) {
      const messageKey = message.toString();
      cache[messageKey] = cache[messageKey] || {};
      if (cache[messageKey][tree]) return;
      cache[messageKey][tree] = true;
    }
    if (level === "warn") {
      originalWarn(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree
      );
    }
    if (level === "error") {
      originalError(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree,
        "\n-----------------------------------------\n",
        "fiber: ",
        fiber
      );
    }
    return;
  }
  const currentFiber = fiber || currentRunningFiber.current;
  const renderFiber = getRenderFiber(currentFiber as MyReactFiberNode);
  const tree = renderFiber ? getFiberNodeName(renderFiber) : "<unknown />";
  if (triggerOnce) {
    const messageKey = message.toString();
    cache[messageKey] = cache[messageKey] || {};
    if (cache[messageKey][tree]) return;
    cache[messageKey][tree] = true;
  }
  // look like a ts bug
  if (level === "warn") {
    originalWarn(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "render by:",
      tree
    );
  }
  if (level === "error") {
    originalError(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "render by:",
      tree
    );
  }
};

export const prepareDevContainer = (renderDispatch: ClientDomDispatch) => {
  Reflect.defineProperty(renderDispatch, "_dev_shared", { value: __my_react_shared__ });
  Reflect.defineProperty(renderDispatch, "_dev_internal", { value: __my_react_internal__ });
};
