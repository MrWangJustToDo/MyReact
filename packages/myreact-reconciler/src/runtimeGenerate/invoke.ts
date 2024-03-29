import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, include, isPromise } from "@my-react/react-shared";

import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { currentRenderDispatch, currentTriggerFiber, NODE_TYPE, onceWarnWithKeyAndFiber, safeCallWithFiber, setRefreshTypeMap } from "../share";

import { transformChildrenFiber } from "./generate";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactElementNode, MixinMyReactFunctionComponent, MaybeArrayMyReactElementNode, createContext, forwardRef } from "@my-react/react";

const { currentHookTreeNode, currentHookNodeIndex, currentComponentFiber } = __my_react_internal__;

const { enablePerformanceLog, enableDebugFiled } = __my_react_shared__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  if (__DEV__ && isPromise(children)) {
    console.error(`[@my-react/react] render function should not return a promise, please check your code`);
  }

  transformChildrenFiber(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  if ("children" in fiber.pendingProps || "children" in fiber.memoizedProps) {
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

  if (include(fiber.type, NODE_TYPE.__forwardRef__)) {
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
  if (include(fiber.type, NODE_TYPE.__function__)) {
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

  const children = renderDispatch.resolveLazyElement(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  fiber.instance = fiber.instance || new typedElementType.Internal();

  fiber.instance._setOwner(fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  if (!fiber.instance._contextFiber || include(fiber.instance._contextFiber.state, STATE_TYPE.__unmount__)) {
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
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) return nextWorkComponent(fiber);

  if (include(fiber.type, NODE_TYPE.__lazy__)) return nextWorkLazy(fiber);

  if (include(fiber.type, NODE_TYPE.__consumer__)) return nextWorkConsumer(fiber);

  nextWorkNormal(fiber);
};

export const runtimeNextWorkDev = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  setRefreshTypeMap(fiber);

  const start = Date.now();

  const res = runtimeNextWork(fiber);

  const end = Date.now();

  const renderTime = end - start;

  if (enablePerformanceLog.current && renderTime > renderDispatch.performanceLogTimeLimit) {
    onceWarnWithKeyAndFiber(fiber, "performance", `[@my-react/react] render current component take a lot of time, there have a performance warning`);
  }

  const typedFiber = fiber as MyReactFiberNodeDev;

  const timeNow = end;

  if (enableDebugFiled.current) {
    if (typedFiber.state === STATE_TYPE.__create__) {
      typedFiber._debugRenderState = {
        mountTimeStep: timeNow,
        timeForRender: renderTime,
        maxTimeForRender: renderTime,
      };

      typedFiber._debugIsMount = true;
    } else {
      const prevRenderState = Object.assign({}, typedFiber._debugRenderState);

      const prevRenderTime = prevRenderState.updateTimeStep || prevRenderState.mountTimeStep;

      typedFiber._debugRenderState = {
        renderCount: (prevRenderState.renderCount || 0) + 1,
        mountTimeStep: prevRenderState.mountTimeStep,
        updateTimeStep: timeNow,
        trigger: currentTriggerFiber.current,
        timeForRender: renderTime,
        timeForUpdate: timeNow - prevRenderTime,
        maxTimeForRender: Math.max(prevRenderState.maxTimeForRender, renderTime),
      };
    }
  }

  return res;
};
