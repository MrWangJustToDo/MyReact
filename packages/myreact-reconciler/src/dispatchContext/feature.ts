import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, exclude, include } from "@my-react/react-shared";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { triggerUpdateOnFiber, type MyReactFiberNode, type MyReactFiberNodeDev } from "../runtimeFiber";
import { getInstanceOwnerFiber, initInstance, setOwnerForInstance, setSubscribeForInstance } from "../runtimeGenerate";
import { enableDebugUpdateQueue, NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { UpdateState } from "../processQueue";
import type { createContext, UpdateQueue } from "@my-react/react";

const { enableDebugFiled } = __my_react_shared__;

const { currentRunningFiber, MyReactInternalInstance } = __my_react_internal__;

export const defaultGetContextValue = (fiber: MyReactFiberNode | null, ContextObject?: ReturnType<typeof createContext> | null) => {
  if (fiber) {
    return fiber.pendingProps["value"] as Record<string, unknown>;
  } else {
    return ContextObject?.Provider?.["value"] as Record<string, unknown>;
  }
};

export const defaultGetContextFiber = (fiber: MyReactFiberNode, ContextObject?: ReturnType<typeof createContext> | null) => {
  if (fiber?.parent && ContextObject) {
    let parent = fiber.parent;
    while (parent) {
      if (include(parent.type, NODE_TYPE.__provider__)) {
        const typedElementType = parent.elementType as ReturnType<typeof createContext>["Provider"];

        const contextObj = typedElementType["Context"];

        if (contextObj === ContextObject) {
          return parent;
        }
      }

      if (include(parent.type, NODE_TYPE.__context__)) {
        const typedElementType = parent.elementType as ReturnType<typeof createContext>;

        const contextObj = typedElementType;

        if (contextObj === ContextObject) {
          return parent;
        }
      }
      parent = parent.parent;
    }
  } else {
    return null;
  }
};

export const defaultReadContext = (Context: ReturnType<typeof createContext>) => {
  const fiber = currentRunningFiber.current;

  if (!Context) {
    throw new Error("the Context what you read is not exist");
  }

  if (!fiber) {
    throw new Error('current environment is not support "readContext"');
  }

  const isUpdate = !!fiber.instance;

  fiber.instance = fiber.instance || new MyReactInternalInstance();

  !isUpdate && initInstance(fiber.instance);

  !isUpdate && setOwnerForInstance(fiber.instance, fiber as MyReactFiberNode);

  const contextFiber = defaultGetContextFiber(fiber as MyReactFiberNode, Context);

  setSubscribeForInstance(fiber.instance, contextFiber);

  return defaultGetContextValue(contextFiber, Context);
};

export const prepareUpdateAllDependence = (
  renderDispatch: CustomRenderDispatch,
  fiber: MyReactFiberNode,
  beforeValue: Record<string, unknown>,
  afterValue: Record<string, unknown>
) => {
  const consumerList = new Set(fiber?.dependence || []);

  consumerList.forEach(function prepareUpdateSingleConsumer(i) {
    const owner = getInstanceOwnerFiber(i);
    if (owner && exclude(owner.state, STATE_TYPE.__unmount__)) {
      const typedFiber = owner as MyReactFiberNodeDev;
      typedFiber.state = STATE_TYPE.__triggerSyncForce__;
    }
  });

  const typedFiber = fiber as MyReactFiberNodeDev;

  const processedNodes: Array<UpdateQueue> = [];

  if (__DEV__ && enableDebugFiled.current) {
    typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

    const now = Date.now();

    const updater: UpdateQueue = {
      type: UpdateQueueType.context,
      trigger: fiber,
      payLoad: afterValue,
      isSync: true,
      isForce: true,
      isImmediate: true,
      isRetrigger: true,
      _debugBeforeValue: beforeValue,
      _debugAfterValue: afterValue,
      _debugCreateTime: now,
      _debugRunTime: now,
      _debugType: UpdateQueueType[UpdateQueueType.context],
    };

    processedNodes.push(updater);

    if (enableDebugUpdateQueue.current) {
      typedFiber._debugUpdateQueue.push(updater);
    }
  }

  const devUpdater: UpdateState = {
    needUpdate: true,
    nodes: processedNodes,
    isSync: true,
    isSkip: false,
    isForce: true,
    isImmediate: true,
    isRetrigger: true,
  };

  const proUpdater: UpdateState = {
    needUpdate: true,
    isSync: true,
    isSkip: false,
    isForce: true,
    isImmediate: true,
    isRetrigger: true,
  };

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberTriggerListener() {
      listenerMap.get(renderDispatch)?.fiberTrigger?.forEach((cb) => cb(fiber, __DEV__ ? devUpdater : proUpdater));
    },
  });
};

export const prepareUpdateAllDependenceFromRoot = (
  renderDispatch: CustomRenderDispatch,
  fiber: MyReactFiberNode,
  beforeValue: Record<string, unknown>,
  afterValue: Record<string, unknown>
) => {
  const consumerList = new Set(fiber?.dependence || []);

  const now = Date.now();

  const updater: UpdateQueue = {
    type: UpdateQueueType.context,
    trigger: fiber,
    payLoad: afterValue,
    isSync: true,
    isForce: true,
    isImmediate: true,
    isRetrigger: false,
    _debugBeforeValue: beforeValue,
    _debugAfterValue: afterValue,
    _debugCreateTime: now,
    _debugRunTime: now,
    _debugType: UpdateQueueType[UpdateQueueType.context],
  };

  consumerList.forEach(function prepareUpdateSingleConsumer(i) {
    const owner = getInstanceOwnerFiber(i);
    if (owner && exclude(owner.state, STATE_TYPE.__unmount__)) {
      const typedFiber = owner as MyReactFiberNodeDev;
      typedFiber.state = STATE_TYPE.__triggerSyncForce__;
    }
  });

  const root = renderDispatch.rootFiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current && enableDebugUpdateQueue.current) {
    root._debugUpdateQueue = root._debugUpdateQueue || new ListTree();
    root._debugUpdateQueue.push(updater);
  }

  renderDispatch.pendingUpdateFiberArray.clear();

  triggerUpdateOnFiber(root, STATE_TYPE.__skippedSync__);
};

export const prepareUpdateAllDependenceFromProvider = (fiber: MyReactFiberNode, beforeValue: Record<string, unknown>, afterValue: Record<string, unknown>) => {
  const consumerList = new Set(fiber?.dependence || []);

  const now = Date.now();

  const updater: UpdateQueue = {
    type: UpdateQueueType.context,
    trigger: fiber,
    payLoad: afterValue,
    isSync: true,
    isForce: true,
    isImmediate: true,
    isRetrigger: true,
    _debugBeforeValue: beforeValue,
    _debugAfterValue: afterValue,
    _debugCreateTime: now,
    _debugRunTime: now,
    _debugType: UpdateQueueType[UpdateQueueType.context],
  };

  consumerList.forEach(function prepareUpdateSingleConsumer(i) {
    const owner = getInstanceOwnerFiber(i);
    if (owner && exclude(owner.state, STATE_TYPE.__unmount__)) {
      const typedFiber = owner as MyReactFiberNodeDev;
      typedFiber.state = STATE_TYPE.__triggerSyncForce__;
    }
  });

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current && enableDebugUpdateQueue.current) {
    typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();
    typedFiber._debugUpdateQueue.push(updater);
  }

  triggerUpdateOnFiber(typedFiber, STATE_TYPE.__skippedSync__);
};
