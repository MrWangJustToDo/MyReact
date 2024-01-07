import { __my_react_internal__, __my_react_shared__, type MyReactComponent } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, exclude, include } from "@my-react/react-shared";

import { syncComponentStateToFiber } from "../runtimeComponent";
import { currentRenderDispatch, NODE_TYPE, safeCallWithFiber } from "../share";

import type { UpdateQueueDev } from "../processState";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactHookNodeDev } from "../runtimeHook";

const { enableDebugFiled } = __my_react_shared__;
const { currentRenderPlatform } = __my_react_internal__;

export const processClassComponentUpdateQueue = (
  fiber: MyReactFiberNode,
  enableTaskPriority?: boolean
): { needUpdate: boolean; isForce: boolean; isSync: boolean; callback?: () => void } => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__class__)) throw new Error("[@my-react/react] current fiber is not a class component, look like a bug for @my-react");

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let isSync = false;

  let isForce = false;

  const callbacks: Array<() => void> = [];

  const typedInstance = fiber.instance as MyReactComponent;

  const baseState = Object.assign({}, typedInstance.state);

  const baseProps = Object.assign({}, typedInstance.props);

  const pendingState = Object.assign({}, fiber.pendingState);

  if (enableTaskPriority && allQueue.some((l) => l.isSync)) {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component && updater.isSync) {
        if (__DEV__ && updater.trigger !== typedInstance) {
          throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
        }

        allQueue.delete(node);

        const { payLoad } = updater;

        fiber.pendingState = safeCallWithFiber({
          fiber,
          fallback: () => pendingState,
          action: () => Object.assign({}, fiber.pendingState, typeof payLoad === "function" ? payLoad(baseState, baseProps) : payLoad),
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          typedNode._debugUpdateState = { needUpdate: true, isSync, isForce, callbacks: callbacks.slice(0) };

          typedFiber._debugUpdateQueue.push(typedNode);
        }
      }
      node = nextNode;
    }

    if (allQueue.length) renderPlatform.microTask(() => fiber._prepare());

    return {
      needUpdate: true,
      isSync,
      isForce,
      callback: callbacks.length ? () => callbacks.forEach((cb) => cb?.()) : void 0,
    };
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component) {
        if (__DEV__ && updater.trigger !== typedInstance) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        const { payLoad } = updater;

        fiber.pendingState = safeCallWithFiber({
          fiber,
          fallback: () => pendingState,
          action: () => Object.assign({}, fiber.pendingState, typeof payLoad === "function" ? payLoad(baseState, baseProps) : payLoad),
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          typedNode._debugUpdateState = { needUpdate: true, isSync, isForce, callbacks: callbacks.slice(0) };

          typedFiber._debugUpdateQueue.push(typedNode);
        }
      }
      node = nextNode;
    }

    return {
      needUpdate: true,
      isSync,
      isForce,
      callback: callbacks.length ? () => callbacks.forEach((cb) => cb?.()) : void 0,
    };
  }
};

export const processFunctionComponentUpdateQueue = (fiber: MyReactFiberNode, enableTaskPriority?: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__function__))
    throw new Error("[@my-react/react] current fiber is not a function component, look like a bug for @my-react");

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current && allQueue) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let needUpdate = false;

  let isSync = false;

  let isForce = false;

  const callbacks: Array<() => void> = [];

  if (enableTaskPriority && allQueue.some((l) => l.isSync)) {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.hook && updater.isSync) {
        if (__DEV__ && updater.trigger._ownerFiber !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        const { trigger, payLoad } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        const lastResult = typedTrigger.result;

        typedTrigger.result = safeCallWithFiber({
          fiber,
          fallback: () => lastResult,
          action: () => typedTrigger.reducer(lastResult, payLoad),
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          typedNode._debugUpdateState = { needUpdate, isSync, isForce, callbacks: callbacks.slice(0) };

          typedFiber._debugUpdateQueue.push(typedNode);

          typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

          typedTrigger._debugUpdateQueue.push(typedNode);
        }
      }

      node = nextNode;
    }

    if (allQueue.length) renderPlatform.microTask(() => fiber._prepare());

    return {
      needUpdate,
      isSync,
      isForce,
      callback: callbacks.length ? () => callbacks.forEach((cb) => cb?.()) : void 0,
    };
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.hook) {
        if (__DEV__ && updater.trigger._ownerFiber !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        const { trigger, payLoad } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        const lastResult = typedTrigger.result;

        typedTrigger.result = safeCallWithFiber({
          fiber,
          fallback: () => lastResult,
          action: () => typedTrigger.reducer(lastResult, payLoad),
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          typedNode._debugUpdateState = { needUpdate, isSync, isForce, callbacks: callbacks.slice(0) };

          typedFiber._debugUpdateQueue.push(typedNode);

          typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

          typedTrigger._debugUpdateQueue.push(typedNode);
        }
      }

      node = nextNode;
    }

    return {
      needUpdate,
      isSync,
      isForce,
      callback: callbacks.length ? () => callbacks.forEach((cb) => cb?.()) : void 0,
    };
  }
};

export const processLazyComponentUpdate = (fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__lazy__)) throw new Error("[@my-react/react] current fiber is not a lazy component, look like a bug for @my-react");

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current && allQueue) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let needUpdate = false;

  let isSync = false;

  let isForce = false;

  const callbacks: Array<() => void> = [];

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === UpdateQueueType.lazy) {
      if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      const { payLoad } = updater;

      isSync = isSync || updater.isSync;

      isForce = isForce || updater.isForce;

      needUpdate = true;

      updater.callback && callbacks.push(updater.callback);

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = node.value as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = null;

        typedNode._debugAfterValue = payLoad;

        typedNode._debugUpdateState = { needUpdate, isSync, isForce, callbacks: callbacks.slice(0) };

        typedFiber._debugUpdateQueue.push(typedNode);
      }
    }

    node = nextNode;
  }

  return {
    needUpdate,
    isSync,
    isForce,
    callback: callbacks.length ? () => callbacks.forEach((cb) => cb?.()) : void 0,
  };
};

/**
 * @deprecated
 */
export const syncFiberStateToComponent = (fiber: MyReactFiberNode, callback?: () => void) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedPendingState = fiber.pendingState;

  typedInstance.state = Object.assign({}, typedInstance.state, typedPendingState);

  const renderDispatch = currentRenderDispatch.current;

  callback && renderDispatch.pendingLayoutEffect(fiber, callback, { stickyToFoot: true });
};

/**
 * @deprecated
 */
export const syncFlushComponentQueue = (fiber: MyReactFiberNode) => {
  const { needUpdate, callback } = processClassComponentUpdateQueue(fiber);

  needUpdate && syncFiberStateToComponent(fiber, callback);

  syncComponentStateToFiber(fiber);
};
