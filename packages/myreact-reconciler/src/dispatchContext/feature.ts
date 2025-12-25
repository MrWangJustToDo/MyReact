import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, exclude, include } from "@my-react/react-shared";

import { type CustomRenderDispatch } from "../renderDispatch";
import { type MyReactFiberNode, type MyReactFiberNodeDev } from "../runtimeFiber";
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

  const updater: UpdateQueue = {
    type: UpdateQueueType.context,
    trigger: fiber,
    payLoad: afterValue,
    isSync: true,
    isForce: true,
    isImmediate: true,
    isRetrigger: true,
  };

  if (__DEV__ && enableDebugFiled.current) {
    const now = Date.now();

    updater._debugBeforeValue = beforeValue;
    updater._debugAfterValue = afterValue;
    updater._debugCreateTime = now;
    updater._debugRunTime = now;
    updater._debugType = UpdateQueueType[UpdateQueueType.context];

    if (enableDebugUpdateQueue.current) {
      typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree(10);

      typedFiber._debugUpdateQueue.push(updater);

      typedFiber._debugLatestUpdateQueue = new ListTree();

      typedFiber._debugLatestUpdateQueue.push(updater);
    }
  }

  processedNodes.push(updater);

  const updateState: UpdateState = {
    needUpdate: true,
    nodes: processedNodes,
    isSync: true,
    isForce: true,
    isImmediate: true,
    isRetrigger: true,
  };

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberTriggerListener() {
      renderDispatch.callOnFiberTrigger(fiber, updateState);
    },
  });
};
