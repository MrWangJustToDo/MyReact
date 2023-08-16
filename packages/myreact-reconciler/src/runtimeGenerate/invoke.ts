import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { currentRenderDispatch, debugWithNode, NODE_TYPE, safeCallWithFiber, setRefreshTypeMap } from "../share";

import { transformChildrenFiber } from "./generate";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactElementNode, MixinMyReactFunctionComponent, MaybeArrayMyReactElementNode, createContext, forwardRef } from "@my-react/react";

const { currentHookTreeNode, currentHookNodeIndex, currentComponentFiber, currentRenderPlatform } = __my_react_internal__;

const { enablePerformanceLog } = __my_react_shared__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  transformChildrenFiber(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  // for a comment element, will not have any children;
  // empty node normally a invalid node
  if (!(fiber.type & (NODE_TYPE.__empty__ | NODE_TYPE.__comment__ | NODE_TYPE.__null__ | NODE_TYPE.__text__)) && "children" in fiber.pendingProps) {
    const { children } = fiber.pendingProps;

    transformChildrenFiber(fiber, children);
  }
};

export const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = classComponentMount(fiber);

    nextWorkCommon(fiber, children);
  } else {
    const { updated, children } = classComponentUpdate(fiber);

    if (updated) nextWorkCommon(fiber, children);
  }
};

export const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  currentHookTreeNode.current = fiber.hookList?.head;

  currentHookNodeIndex.current = 0;

  currentComponentFiber.current = fiber;

  const typedElementType = fiber.elementType as MixinMyReactFunctionComponent;

  let children: MyReactElementNode = null;

  if (fiber.type & NODE_TYPE.__forwardRef__) {
    const typedElementTypeWithRef = typedElementType as ReturnType<typeof forwardRef>["render"];

    children = safeCallWithFiber({ fiber, action: () => typedElementTypeWithRef(fiber.pendingProps, fiber.ref) });
  } else {
    children = safeCallWithFiber({ fiber, action: () => typedElementType(fiber.pendingProps) });
  }

  currentComponentFiber.current = null;

  currentHookNodeIndex.current = 0;

  currentHookTreeNode.current = null;

  nextWorkCommon(fiber, children);
};

export const nextWorkComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__function__) {
    currentComponentFiber.current = fiber;

    nextWorkFunctionComponent(fiber);

    currentComponentFiber.current = null;
  } else {
    currentComponentFiber.current = fiber;

    nextWorkClassComponent(fiber);

    currentComponentFiber.current = null;
  }
};

export const nextWorkLazy = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const children = renderDispatch.resolveLazyElementSync(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkLazyAsync = async (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const children = await renderDispatch.resolveLazyElementAsync(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedElementType.Internal();

  fiber.instance._setOwner(fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  if (!fiber.instance._contextFiber || fiber.instance._contextFiber.state & STATE_TYPE.__unmount__) {
    const ProviderFiber = renderDispatch.resolveContextFiber(fiber, Context);

    const context = renderDispatch.resolveContextValue(ProviderFiber, Context);

    fiber.instance.context = context;

    fiber.instance._setContext(ProviderFiber);
  } else {
    const context = renderDispatch.resolveContextValue(fiber.instance._contextFiber as MyReactFiberNode, Context);

    fiber.instance.context = context;
  }

  const typedChildren = fiber.pendingProps.children as (p: any) => MyReactElementNode;

  const children = typedChildren(fiber.instance.context);

  currentComponentFiber.current = null;

  nextWorkCommon(fiber, children);
};

export const runtimeNextWork = (fiber: MyReactFiberNode) => {
  if (fiber.type & (NODE_TYPE.__class__ | NODE_TYPE.__function__)) return nextWorkComponent(fiber);

  if (fiber.type & NODE_TYPE.__lazy__) return nextWorkLazy(fiber);

  if (fiber.type & NODE_TYPE.__consumer__) return nextWorkConsumer(fiber);

  nextWorkNormal(fiber);
};

export const runtimeNextWorkDev = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  setRefreshTypeMap(fiber);

  const renderPlatform = currentRenderPlatform.current;

  const start = Date.now();

  const res = runtimeNextWork(fiber);

  const end = Date.now();

  if (enablePerformanceLog.current && end - start > renderDispatch.performanceLogTimeLimit) {
    renderPlatform?.log({
      fiber,
      message: "render current component take a lot of time, there have a performance warning",
      level: "warn",
      triggerOnce: true,
    });
  }

  const typedFiber = fiber as MyReactFiberNodeDev;

  const timeNow = end;

  if (typedFiber.state === STATE_TYPE.__initial__) {
    typedFiber._debugRenderState = {
      mountTime: timeNow,
    };

    typedFiber._debugIsMount = true;
  } else {
    const prevRenderState = Object.assign({}, typedFiber._debugRenderState);

    const prevRenderTime = prevRenderState.updateTime || prevRenderState.mountTime;

    typedFiber._debugRenderState = {
      renderCount: (prevRenderState.renderCount || 0) + 1,
      mountTime: prevRenderState.mountTime,
      updateTime: timeNow,
      updateTimeInterval: timeNow - prevRenderTime,
    };
  }

  if (typedFiber.type & renderDispatch.runtimeRef.typeForNativeNode) {
    renderDispatch.pendingLayoutEffect(typedFiber, () => debugWithNode(typedFiber));
  }

  return res;
};

export const runtimeNextWorkAsync = async (fiber: MyReactFiberNode) => {
  if (fiber.type & (NODE_TYPE.__class__ | NODE_TYPE.__function__)) return nextWorkComponent(fiber);

  if (fiber.type & NODE_TYPE.__lazy__) return await nextWorkLazyAsync(fiber);

  if (fiber.type & NODE_TYPE.__consumer__) return nextWorkConsumer(fiber);

  nextWorkNormal(fiber);
};
