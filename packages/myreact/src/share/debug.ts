import { NODE_TYPE } from "@my-react/react-shared";

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
    if (owner) {
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

export const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof memo>;
    const targetRender = typedType?.render;
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
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof lazy>;
    const typedRender = typedType?.render;
    if (typedRender?.name) return `<Lazy - (${typedRender.name}) />`;
    if (typedRender?.displayName) return `<Lazy -(${typedRender.displayName}) />`;
    return `<Lazy />`;
  }
  if (fiber.type & NODE_TYPE.__isReactive__) {
    const typedElement = fiber.element as MyReactElement;
    const typedType = typedElement.type as ReturnType<typeof createReactive>;
    if (typedType?.name) return `<Reactive* - (${typedType.name}) />`;
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
