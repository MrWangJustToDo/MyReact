import { isValidElement, __my_react_internal__ } from "@my-react/react";

import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { isCommentElement } from "../runtimeScope";
import { NODE_TYPE, safeCallWithFiber } from "../share";

import { transformChildrenFiber } from "./generate";

import type { RenderDispatch } from "../renderDispatch";
import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type {
  MyReactFiberNode,
  MyReactElementNode,
  MixinMyReactFunctionComponent,
  MaybeArrayMyReactElementNode,
  createContext,
  forwardRef,
} from "@my-react/react";

const { currentHookTreeNode, currentFunctionFiber, currentComponentFiber } = __my_react_internal__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  transformChildrenFiber(fiber, children);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugDynamicChildren = children;
  }
};

export const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = classComponentMount(fiber);

    return nextWorkCommon(fiber, children);
  } else {
    const { updated, children } = classComponentUpdate(fiber);

    if (updated) {
      return nextWorkCommon(fiber, children);
    } else {
      fiber._afterUpdate();

      return void 0;
    }
  }
};

export const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  currentHookTreeNode.current = fiber.hookList.head;

  currentFunctionFiber.current = fiber;

  const typedElementType = fiber.elementType as MixinMyReactFunctionComponent;

  let children: MyReactElementNode = null;

  if (fiber.type & NODE_TYPE.__isForwardRef__) {
    const typedElementTypeWithRef = typedElementType as ReturnType<typeof forwardRef>["render"];
    children = safeCallWithFiber({ fiber, action: () => typedElementTypeWithRef(fiber.pendingProps, fiber.ref) });
  } else {
    children = safeCallWithFiber({ fiber, action: () => typedElementType(fiber.pendingProps) });
  }

  currentFunctionFiber.current = null;

  currentHookTreeNode.current = null;

  return nextWorkCommon(fiber, children);
};

export const nextWorkComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isFunctionComponent__) {
    currentComponentFiber.current = fiber;

    const res = nextWorkFunctionComponent(fiber);

    currentComponentFiber.current = null;

    return res;
  } else {
    currentComponentFiber.current = fiber;

    const res = nextWorkClassComponent(fiber);

    currentComponentFiber.current = null;

    return res;
  }
};

export const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const children = renderDispatch.resolveLazyElement(fiber);

  return nextWorkCommon(fiber, children);
};

export const nextWorkLazySync = async (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const children = await renderDispatch.resolveLazyElementAsync(fiber);

  return nextWorkCommon(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  // for a comment element, will not have any children;
  // empty node normally a invalid node
  if (isValidElement(fiber.element) && !(fiber.type & NODE_TYPE.__isEmptyNode__) && !isCommentElement(fiber)) {
    const { children } = fiber.pendingProps;

    const childrenFiber = transformChildrenFiber(fiber, children);

    return childrenFiber;
  } else {
    fiber._afterUpdate();

    return void 0;
  }
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedElementType.Internal();

  fiber.instance._setOwner(fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  if (!fiber.instance._contextFiber || !fiber.instance._contextFiber.isMounted) {
    const ProviderFiber = renderDispatch.resolveContextFiber(fiber, Context);

    const context = renderDispatch.resolveContextValue(ProviderFiber, Context);

    fiber.instance.context = context;

    fiber.instance._setContext(ProviderFiber);
  } else {
    const context = renderDispatch.resolveContextValue(fiber.instance._contextFiber, Context);

    fiber.instance.context = context;
  }

  const typedChildren = fiber.pendingProps.children as (p: any) => MyReactElementNode;

  const children = typedChildren(fiber.instance.context);

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

export const runtimeNextWork = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isDynamicNode__) return nextWorkComponent(fiber);
  if (fiber.type & NODE_TYPE.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return nextWorkConsumer(fiber);
  return nextWorkNormal(fiber);
};

export const runtimeNextWorkAsync = async (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isDynamicNode__) return nextWorkComponent(fiber);
  if (fiber.type & NODE_TYPE.__isLazy__) return await nextWorkLazySync(fiber);
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return nextWorkConsumer(fiber);
  return nextWorkNormal(fiber);
};
