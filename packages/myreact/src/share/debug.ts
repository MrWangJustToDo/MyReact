import { NODE_TYPE } from "@my-react/react-shared";

import { currentRunningFiber } from "./env";

import type { forwardRef, lazy, memo, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "../hook";
import type { createReactive } from "../reactive";

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
    if (!(fiber.type & NODE_TYPE.__isDynamicNode__) && owner) {
      const ownerElement = owner.element as MyReactElement;
      const ownerElementType = ownerElement.type;
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

const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof memo>;
    const targetRender = typedType.render;
    if (typeof targetRender === "function") {
      if (targetRender.name) return `<Memo - (${targetRender.name}) />`;
      if (targetRender.displayName) return `<Memo -(${targetRender.displayName}) />`;
    }
    if (typeof targetRender === "object") {
      const typedTargetRender = targetRender as ReturnType<typeof createReactive>;
      if (typedTargetRender.name) return `<Memo - (${typedTargetRender.name}) />`;
    }
    return `<Memo />`;
  }
  if (fiber.type & NODE_TYPE.__isLazy__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof lazy>;
    if (typedType.render.name) return `<Lazy - (${typedType.render.name}) />`;
    if (typedType.render.displayName) return `<Lazy -(${typedType.render.displayName}) />`;
    return `<Lazy />`;
  }
  if (fiber.type & NODE_TYPE.__isReactive__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof createReactive>;
    if (typedType.name) return `<Reactive* - (${typedType.name}) />`;
    return `<Reactive* />`;
  }
  if (fiber.type & NODE_TYPE.__isPortal__) return `<Portal />`;
  if (fiber.type & NODE_TYPE.__isNullNode__) return `<Null />`;
  if (fiber.type & NODE_TYPE.__isEmptyNode__) return `<Empty />`;
  if (fiber.type & NODE_TYPE.__isStrictNode__) return `<Strict />`;
  if (fiber.type & NODE_TYPE.__isSuspenseNode__) return `<Suspense />`;
  if (fiber.type & NODE_TYPE.__isFragmentNode__) return `<Fragment />`;
  if (fiber.type & NODE_TYPE.__isKeepLiveNode__) return `<KeepAlive />`;
  if (fiber.type & NODE_TYPE.__isContextProvider__) return `<Provider />`;
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return `<Consumer />`;
  if (fiber.type & NODE_TYPE.__isForwardRef__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof forwardRef>;
    if (typedType.render.name) return `<ForwardRef - (${typedType.render.name}) />`;
    if (typedType.render.displayName) return `<ForwardRef -(${typedType.render.displayName}) />`;
    return `<ForwardRef />`;
  }
  if (typeof fiber.element === "object" && fiber.element !== null) {
    if (typeof fiber.element.type === "string") {
      return `<${fiber.element.type} />`;
    }
    if (typeof fiber.element.type === "function") {
      const typedType = fiber.element.type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
      let name = typedType.displayName || fiber.element.type.name || "anonymous";
      name = fiber.root === fiber ? `${name} (root)` : name;
      return `<${name}* />`;
    }
    return `<unknown* />`;
  } else {
    return `<text (${fiber.element?.toString()}) />`;
  }
};

const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)}${getTrackDevLog(fiber)}`;

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (fiber) {
    const preString = "".padEnd(4) + "at".padEnd(4);
    let parent = fiber.parent;
    let res = `${preString}${getFiberNodeName(fiber)}`;
    while (parent) {
      res = `${preString}${getFiberNodeName(parent)}\n${res}`;
      parent = parent.parent;
    }
    return `\n${res}`;
  }
  return "";
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

const cache: Record<string, boolean> = {};

type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

export const log = ({ fiber, message, level = "warn", triggerOnce = false }: LogProps) => {
  const tree = getFiberTree(fiber || currentRunningFiber.current);
  if (triggerOnce) {
    if (cache[tree]) return;
    cache[tree] = true;
  }
  console[level](
    `[${level}]:`,
    "\n-----------------------------------------\n",
    `${typeof message === "string" ? message : message.stack || message.message}`,
    "\n-----------------------------------------\n",
    "Render Tree:",
    tree
  );
};

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    log({ message: e as Error, level: "error" });

    const fiber = currentRunningFiber.current;

    if (fiber) fiber.root.globalScope.isAppCrash = true;

    throw new Error((e as Error).message);
  }
};

export const safeCallWithFiber = <T extends any[] = any[], K = any>({ action, fiber }: { action: (...args: T) => K; fiber: MyReactFiberNode }, ...args: T) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    log({ message: e as Error, level: "error", fiber });

    fiber.root.globalScope.isAppCrash = true;

    throw new Error((e as Error).message);
  }
};
