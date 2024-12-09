import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, include, isPromise } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";
import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { currentRenderDispatch, currentTriggerFiber, NODE_TYPE, onceWarnWithKeyAndFiber, safeCallWithCurrentFiber, setRefreshTypeMap } from "../share";

import { transformChildrenFiber } from "./generate";
import { getInstanceContextFiber, initInstance, setContextForInstance, setOwnerForInstance } from "./instance";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type {
  MyReactElementNode,
  MixinMyReactFunctionComponent,
  MaybeArrayMyReactElementNode,
  createContext,
  forwardRef,
  MyReactFunctionComponent,
} from "@my-react/react";

const { currentHookTreeNode, currentHookNodeIndex, currentComponentFiber } = __my_react_internal__;

const { enablePerformanceLog, enableDebugFiled } = __my_react_shared__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  if (__DEV__ && isPromise(children)) {
    console.error(`[@my-react/react] render function should not return a promise, please check your code`);
  }

  transformChildrenFiber(fiber, children);
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  if (
    "children" in fiber.pendingProps ||
    "children" in fiber.memoizedProps ||
    "dangerouslySetInnerHTML" in fiber.pendingProps ||
    "dangerouslySetInnerHTML" in fiber.memoizedProps
  ) {
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

    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallForwardRefFunctionalComponent() {
        return typedElementTypeWithRef(fiber.pendingProps, fiber.ref);
      },
    });
  } else {
    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFunctionalComponent() {
        return typedElementType(fiber.pendingProps);
      },
    });
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

  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new typedElementType.Internal();

  !isUpdate && initInstance(fiber.instance);

  setOwnerForInstance(fiber.instance, fiber);

  const Context = typedElementType.Context as ReturnType<typeof createContext>;

  currentComponentFiber.current = fiber;

  const contextFiber = getInstanceContextFiber(fiber.instance);

  let finalContext = null;

  if (!contextFiber || include(contextFiber.state, STATE_TYPE.__unmount__)) {
    const providerFiber = renderDispatch.resolveContextFiber(fiber, Context);

    const context = renderDispatch.resolveContextValue(providerFiber, Context);

    finalContext = context;

    setContextForInstance(fiber.instance, providerFiber);
  } else {
    const context = renderDispatch.resolveContextValue(contextFiber, Context);

    setContextForInstance(fiber.instance, contextFiber);

    finalContext = context;
  }

  const typedChildren = fiber.pendingProps.children as MyReactFunctionComponent;

  const children = typedChildren(finalContext);

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

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberRunListener() {
      listenerMap.get(renderDispatch)?.beforeFiberRun?.forEach((cb) => cb(fiber));
    },
  });

  setRefreshTypeMap(fiber);

  const typedFiber = fiber as MyReactFiberNodeDev;

  const start = Date.now();

  runtimeNextWork(fiber);

  const end = Date.now();

  const renderTime = end - start;

  const hasPerformanceWarn = renderTime > renderDispatch.performanceLogTimeLimit;

  if (enablePerformanceLog.current && hasPerformanceWarn) {
    onceWarnWithKeyAndFiber(fiber, "performance", `[@my-react/react] render current component take a lot of time, there have a performance warning`);
  }

  if (hasPerformanceWarn) {
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallPerformanceWarnListener() {
        listenerMap.get(renderDispatch)?.performanceWarn?.forEach((cb) => cb(fiber));
      },
    });
  }

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

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberRunListener() {
      listenerMap.get(renderDispatch)?.afterFiberRun?.forEach((cb) => cb(fiber));
    },
  });
};
