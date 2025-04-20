import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, exclude, include, isNormalEquals, isPromise } from "@my-react/react-shared";

import { prepareUpdateAllDependence, prepareUpdateAllDependenceFromRoot } from "../dispatchContext";
import { listenerMap } from "../renderDispatch";
import { classComponentMount, classComponentUpdate } from "../runtimeComponent";
import { WrapperBySuspense } from "../runtimeScope";
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

const { currentHookTreeNode, currentHookNodeIndex, currentComponentFiber, currentRenderPlatform, MyReactInternalInstance } = __my_react_internal__;

const { enablePerformanceLog, enableDebugFiled, enableLoopFromRoot } = __my_react_shared__;

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

  const typedElementType = fiber.elementType as MixinMyReactFunctionComponent;

  let children: MyReactElementNode = null;

  if (include(fiber.type, NODE_TYPE.__forwardRef__)) {
    const typedElementTypeWithRef = typedElementType as ReturnType<typeof forwardRef>["render"];

    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallForwardRefFunctionalComponent() {
        let re = undefined;
        try {
          re = typedElementTypeWithRef(fiber.pendingProps, fiber.ref);
        } catch (e) {
          if (isPromise(e)) {
            re = currentRenderPlatform.current?.dispatchPromise?.({ fiber, promise: e });
          } else {
            throw e;
          }
        }
        return re;
      },
    });
  } else {
    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFunctionalComponent() {
        let re = undefined;
        try {
          re = typedElementType(fiber.pendingProps);
        } catch (e) {
          if (isPromise(e)) {
            re = currentRenderPlatform.current?.dispatchPromise?.({ fiber, promise: e });
          } else {
            throw e;
          }
        }
        return re;
      },
    });
  }

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

  const children = renderDispatch.resolveSuspense(fiber);

  nextWorkCommon(fiber, children);
};

export const nextWorkSuspense = (fiber: MyReactFiberNode) => {
  const children = WrapperBySuspense(fiber.pendingProps.children);

  nextWorkCommon(fiber, children);
};

export const nextWorkProvider = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  if (renderDispatch.isAppMounted) {
    const prevProps = fiber.memoizedProps.value;

    const nextProps = fiber.pendingProps.value;

    if (!isNormalEquals(prevProps as Record<string, unknown>, nextProps as Record<string, unknown>)) {
      if (enableLoopFromRoot.current) {
        prepareUpdateAllDependence(renderDispatch, fiber, prevProps, nextProps);
      } else {
        renderDispatch.pendingLayoutEffect(fiber, function invokePrepareUpdateAllDependenceFromRoot() {
          prepareUpdateAllDependenceFromRoot(renderDispatch, fiber, prevProps, nextProps);
        });
      }
    }

    nextWorkNormal(fiber);
  } else {
    nextWorkNormal(fiber);
  }
};

export const nextWorkConsumer = (fiber: MyReactFiberNode) => {
  const renderDispatch = currentRenderDispatch.current;

  const typedElementType = fiber.elementType as ReturnType<typeof createContext>["Consumer"];

  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

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

  const children = safeCallWithCurrentFiber({
    fiber,
    action: function safeCallConsumerChildren() {
      return typedChildren(finalContext);
    },
  });

  currentComponentFiber.current = null;

  nextWorkCommon(fiber, children);
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
