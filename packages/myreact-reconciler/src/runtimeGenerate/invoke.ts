import { isValidElement, __my_react_internal__ } from "@my-react/react";
import { ForwardRef, NODE_TYPE, Reactive, TYPEKEY } from "@my-react/react-shared";

import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { reactiveComponentMount, reactiveComponentUpdate } from "../runtimeReactive";
import { isCommentElement } from "../runtimeScope";

import { transformChildrenFiber } from "./generate";

import type { RenderDispatch } from "../runtimeDispatch";
import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type {
  MyReactFiberNode,
  MyReactElementNode,
  MyReactFunctionComponent,
  MaybeArrayMyReactElementNode,
  MixinMyReactFunctionComponent,
  memo,
  forwardRef,
  createContext,
} from "@my-react/react";

const { currentHookDeepIndex, currentFunctionFiber, currentComponentFiber } = __my_react_internal__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  const childrenFiber = transformChildrenFiber(fiber, children);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugDynamicChildren = children;
  }

  return childrenFiber;
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

      return [];
    }
  }
};

export const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const typedElementType = fiber.elementType as MyReactFunctionComponent;

  const children = typedElementType(fiber.pendingProps);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

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

export const nextWorkMemo = (fiber: MyReactFiberNode) => {
  const typedElementType = fiber.elementType as ReturnType<typeof memo>;

  const targetRender = typedElementType.render;

  if (typeof targetRender === "object") {
    if (targetRender[TYPEKEY] === ForwardRef) {
      const typedTargetRender = targetRender as ReturnType<typeof forwardRef>;

      const forwardRefRender = typedTargetRender.render;

      currentComponentFiber.current = fiber;

      currentHookDeepIndex.current = 0;

      // support hook for forwardRef render function
      currentFunctionFiber.current = fiber;

      const children = forwardRefRender(fiber.pendingProps, fiber.ref);

      currentFunctionFiber.current = null;

      currentHookDeepIndex.current = 0;

      currentComponentFiber.current = null;

      return nextWorkCommon(fiber, children);
    }

    if (targetRender[TYPEKEY] === Reactive) {
      currentComponentFiber.current = fiber;

      const res = nextWorkReactive(fiber);

      currentComponentFiber.current = fiber;

      return res;
    }

    throw new Error("unSupport memo() usage");
  }

  if (typeof targetRender === "function") {
    const isClassComponent = targetRender?.prototype?.isMyReactComponent;
    if (isClassComponent) {
      currentComponentFiber.current = fiber;

      const res = nextWorkClassComponent(fiber);

      currentComponentFiber.current = null;

      return res;
    } else {
      const typedTargetRender = targetRender as MixinMyReactFunctionComponent;

      currentComponentFiber.current = fiber;

      currentHookDeepIndex.current = 0;

      currentFunctionFiber.current = fiber;

      const children = typedTargetRender(fiber.pendingProps);

      currentFunctionFiber.current = null;

      currentHookDeepIndex.current = 0;

      currentComponentFiber.current = null;

      return nextWorkCommon(fiber, children);
    }
  }

  throw new Error("unSupport memo() usage");
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

export const nextWorkReactive = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = reactiveComponentMount(fiber);

    return nextWorkCommon(fiber, children);
  } else {
    const children = reactiveComponentUpdate(fiber);

    return nextWorkCommon(fiber, children);
  }
};

export const nextWorkReactiveComponent = (fiber: MyReactFiberNode) => {
  currentComponentFiber.current = fiber;

  const res = nextWorkReactive(fiber);

  currentComponentFiber.current = null;

  return res;
};

export const nextWorkForwardRef = (fiber: MyReactFiberNode) => {
  currentComponentFiber.current = fiber;

  const typedElementType = fiber.elementType as ReturnType<typeof forwardRef>;

  const typedRender = typedElementType.render;

  currentHookDeepIndex.current = 0;

  currentFunctionFiber.current = fiber;

  const children = typedRender(fiber.pendingProps, fiber.ref);

  currentFunctionFiber.current = null;

  currentHookDeepIndex.current = 0;

  currentComponentFiber.current = null;

  return nextWorkCommon(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  // for a comment element, will not have any children;
  if (isValidElement(fiber.element) && !isCommentElement(fiber)) {
    const { children } = fiber.pendingProps;

    const childrenFiber = transformChildrenFiber(fiber, children);

    return childrenFiber;
  } else {
    fiber._afterUpdate();

    return [];
  }
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedElementType.Internal();

  fiber.instance._setOwner(fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  // for deactivated context fiber, maybe will not update children context, but all the children has deactivated, so it will not matter
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

export const nextWorkObject = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) return nextWorkMemo(fiber);
  if (fiber.type & NODE_TYPE.__isLazy__) return nextWorkLazy(fiber);
  if (fiber.type & NODE_TYPE.__isPortal__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isReactive__) return nextWorkReactiveComponent(fiber);
  if (fiber.type & NODE_TYPE.__isForwardRef__) return nextWorkForwardRef(fiber);
  if (fiber.type & NODE_TYPE.__isContextProvider__) return nextWorkNormal(fiber);
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return nextWorkConsumer(fiber);
  throw new Error(`unknown element ${fiber.element}`);
};
