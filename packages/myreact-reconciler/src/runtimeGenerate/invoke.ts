import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, exclude, include, isPromise } from "@my-react/react-shared";

import { processClassComponentMount, processClassComponentUpdate } from "../processClass";
import { processConsumer, processProvider } from "../processContext";
import { processFunction } from "../processFunction";
import { processLazy } from "../processLazy";
import { processSuspense } from "../processSuspense";
import { listenerMap } from "../renderDispatch";
import { currentRenderDispatch, currentTriggerFiber, NODE_TYPE, onceWarnWithKeyAndFiber, safeCallWithCurrentFiber, setRefreshTypeMap } from "../share";

import { transformChildrenFiber } from "./generate";
import { getInstanceFieldByInstance, initInstance, initVisibleInstance } from "./instance";

import type { VisibleInstanceField } from "./instance";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MaybeArrayMyReactElementNode } from "@my-react/react";

const { currentComponentFiber, MyReactInternalInstance } = __my_react_internal__;

const { enablePerformanceLog, enableDebugFiled } = __my_react_shared__;

export const nextWorkCommon = (fiber: MyReactFiberNode, children: MaybeArrayMyReactElementNode) => {
  if (__DEV__ && isPromise(children)) {
    console.error(`[@my-react/react] render function should not return a promise, please check your code`);
  }

  if (exclude(fiber.patch, PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallTransformChildrenFiber() {
      transformChildrenFiber(fiber, children);
    },
  });
};

export const nextWorkNormal = (fiber: MyReactFiberNode) => {
  if (
    "children" in fiber.pendingProps ||
    "children" in fiber.memoizedProps ||
    "dangerouslySetInnerHTML" in fiber.pendingProps ||
    "dangerouslySetInnerHTML" in fiber.memoizedProps
  ) {
    const { children } = fiber.pendingProps;

    nextWorkCommon(fiber, children);
  }
};

export const nextWorkClassComponent = (fiber: MyReactFiberNode) => {
  if (!fiber.instance) {
    const children = processClassComponentMount(fiber);

    nextWorkCommon(fiber, children);
  } else {
    const { updated, children } = processClassComponentUpdate(fiber);

    if (updated) nextWorkCommon(fiber, children);
  }
};

export const nextWorkFunctionComponent = (fiber: MyReactFiberNode) => {
  const children = processFunction(fiber);

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
  const children = processLazy(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkSuspense = (fiber: MyReactFiberNode) => {
  const children = processSuspense(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkProvider = (fiber: MyReactFiberNode) => {
  processProvider(fiber);

  nextWorkNormal(fiber);
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const children = processConsumer(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkRoot = (fiber: MyReactFiberNode) => {
  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

  !isUpdate && initInstance(fiber.instance);

  !isUpdate && initVisibleInstance(fiber.instance);

  const instanceField = getInstanceFieldByInstance(fiber.instance) as VisibleInstanceField;

  if (instanceField.isHidden) {
    nextWorkCommon(fiber, null);
  } else {
    nextWorkNormal(fiber);
  }
};

export const runtimeNextWork = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  renderDispatch.dispatchFiber(fiber);
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
