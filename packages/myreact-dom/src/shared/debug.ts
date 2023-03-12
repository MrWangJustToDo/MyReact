import { __my_react_internal__ } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-reconciler";

import type { DomElement, DomNode } from "./dom";
import type {
  MyReactElement,
  MyReactHookNode,
  MyReactFiberNode,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
  memo,
  lazy,
  forwardRef,
} from "@my-react/react";
import type { createReactive } from "@my-react/react-reactive";

const { currentRunningFiber } = __my_react_internal__;

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const debugDOM = fiber.node as DomElement | DomNode;
    debugDOM["__fiber__"] = fiber;
    debugDOM["__element__"] = fiber.element;
    debugDOM["__children__"] = fiber.children;
  }
};

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
      if (typeof ownerElementType === "function") {
        const typedOwnerElementType = ownerElementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
        const name = typedOwnerElementType.name || typedOwnerElementType.displayName;
        preString = `${preString} (render dy ${name})`;
      }
      if (typeof ownerElementType === "object") {
        // todo
        void 0;
      }
    }
    return preString;
  } else {
    return "";
  }
};

export const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) {
    const typedElementType = fiber.elementType as ReturnType<typeof memo>;
    const targetRender = typedElementType?.render;
    if (typeof targetRender === "function") {
      if (targetRender?.name) return `<Memo - (${targetRender.name}) />`;
      if (targetRender?.displayName) return `<Memo -(${targetRender.displayName}) />`;
    }
    if (typeof targetRender === "object") {
      const typedTargetRender = targetRender as ReturnType<typeof createReactive>;
      if (typedTargetRender?.name) return `<Memo - (${typedTargetRender.name}) />`;
    }
    return `<Memo />`;
  }
  if (fiber.type & NODE_TYPE.__isLazy__) {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    const typedRender = typedElementType?.render;
    if (typedRender?.name) return `<Lazy - (${typedRender.name}) />`;
    if (typedRender?.displayName) return `<Lazy -(${typedRender.displayName}) />`;
    return `<Lazy />`;
  }
  if (fiber.type & NODE_TYPE.__isReactive__) {
    const typedElementType = fiber.elementType as ReturnType<typeof createReactive>;
    if (typedElementType?.name) return `<Reactive* - (${typedElementType.name}) />`;
    return `<Reactive* />`;
  }
  if (fiber.type & NODE_TYPE.__isPortal__) return `<Portal />`;
  if (fiber.type & NODE_TYPE.__isNullNode__) return `<Null />`;
  if (fiber.type & NODE_TYPE.__isEmptyNode__) return `<Empty />`;
  if (fiber.type & NODE_TYPE.__isScopeNode__) return `<Scope />`;
  if (fiber.type & NODE_TYPE.__isStrictNode__) return `<Strict />`;
  if (fiber.type & NODE_TYPE.__isSuspenseNode__) return `<Suspense />`;
  if (fiber.type & NODE_TYPE.__isFragmentNode__) return `<Fragment />`;
  if (fiber.type & NODE_TYPE.__isKeepLiveNode__) return `<KeepAlive />`;
  if (fiber.type & NODE_TYPE.__isContextProvider__) return `<Provider />`;
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return `<Consumer />`;
  if (fiber.type & NODE_TYPE.__isCommentNode__) return `<Comment />`;
  if (fiber.type & NODE_TYPE.__isForwardRef__) {
    const typedElementType = fiber.elementType as ReturnType<typeof forwardRef>;
    if (typedElementType.render.name) return `<ForwardRef - (${typedElementType.render.name}) />`;
    if (typedElementType.render.displayName) return `<ForwardRef -(${typedElementType.render.displayName}) />`;
    return `<ForwardRef />`;
  }
  if (typeof fiber.elementType === "string") return `<${fiber.elementType} />`;
  if (typeof fiber.elementType === "function") {
    const typedElementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    let name = typedElementType.displayName || typedElementType.name || "anonymous";
    name = fiber.root === fiber ? `${name} (root)` : name;
    return `<${name}* />`;
  }
  if (typeof fiber.element === "object" && fiber.element !== null) {
    return `<unknown* />`;
  } else {
    return `<text (${fiber.element?.toString()}) />`;
  }
};

export const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)}${getTrackDevLog(fiber)}`;

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (__DEV__) {
    if (fiber) {
      const preString = "".padEnd(4) + "at".padEnd(4);
      let parent = fiber.parent;
      let res = `${preString}${getFiberNodeName(fiber)}`;
      while (parent) {
        res += `\n${preString}${getFiberNodeName(parent)}`;
        parent = parent.parent;
      }
      return `\n${res}`;
    }
    return "";
  } else {
    if (fiber) {
      return getFiberNodeName(fiber);
    } else {
      return "";
    }
  }
};

export const getHookTree = (hookNodes: MyReactHookNode[], currentIndex: number, newHookType: MyReactHookNode["hookType"]) => {
  let re = "\n" + "".padEnd(6) + "Prev render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
  for (let index = 0; index <= currentIndex; index++) {
    if (index < currentIndex) {
      const currentType = hookNodes[index]?.hookType || "undefined";
      re += (index + 1).toString().padEnd(6) + currentType.padEnd(20) + currentType.padEnd(10) + "\n";
    } else {
      const currentType = hookNodes[index]?.hookType || "undefined";
      re += (index + 1).toString().padEnd(6) + currentType.padEnd(20) + newHookType.padEnd(10) + "\n";
    }
  }
  re += "".padEnd(6) + "^".repeat(30) + "\n";
  return re;
};

const cache: Record<string, Record<string, boolean>> = {};

type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

export const log = ({ fiber, message, level = "warn", triggerOnce = false }: LogProps) => {
  if (__DEV__) {
    const tree = getFiberTree(fiber || currentRunningFiber.current);
    if (triggerOnce) {
      const messageKey = message.toString();
      cache[messageKey] = cache[messageKey] || {};
      if (cache[messageKey][tree]) return;
      cache[messageKey][tree] = true;
    }
    if (level === "warn") {
      console.warn(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree
      );
      return;
    }
    if (level === "error") {
      console.error(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree
      );
    }
    return;
  }
  const currentFiber = fiber || currentRunningFiber.current;
  const tree = getFiberTree(currentFiber);
  if (triggerOnce) {
    const messageKey = message.toString();
    cache[messageKey] = cache[messageKey] || {};
    if (cache[messageKey][tree]) return;
    cache[messageKey][tree] = true;
  }
  // look like a ts bug
  if (level === "warn") {
    console.warn(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "cause by:",
      tree
    );
    return;
  }
  if (level === "error") {
    console.error(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "cause by:",
      tree
    );
  }
};
