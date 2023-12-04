import { __my_react_internal__, __my_react_shared__, type MyReactComponent } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include } from "@my-react/react-shared";

import { syncComponentStateToFiber } from "../runtimeComponent";
import { currentRenderDispatch, safeCallWithFiber } from "../share";

import type { UpdateQueueDev } from "../processState";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactHookNodeDev } from "../runtimeHook";

const { enableDebugFiled } = __my_react_shared__;
const { currentRenderPlatform } = __my_react_internal__;

export const processClassComponentUpdateQueue = (fiber: MyReactFiberNode, enableTaskPriority?: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  if (!node) return { needUpdate: false, isSync: false };

  if (__DEV__ && enableDebugFiled.current) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let sync = false;

  const typedInstance = fiber.instance as MyReactComponent;

  const baseState = Object.assign({}, typedInstance.state);

  const baseProps = Object.assign({}, typedInstance.props);

  const nextStateObj = fiber.pendingState;

  if (enableTaskPriority && allQueue.some((l) => l.isSync)) {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component && updater.isSync) {
        if (__DEV__ && updater.trigger !== typedInstance) {
          throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
        }

        allQueue.delete(node);

        // TODO
        const lastResult = nextStateObj.pendingState;

        nextStateObj.pendingState = safeCallWithFiber({
          fiber,
          fallback: () => nextStateObj.pendingState,
          action: () => Object.assign({}, lastResult, typeof updater.payLoad === "function" ? updater.payLoad(baseState, baseProps) : updater.payLoad),
        });

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = nextStateObj.pendingState;

          typedFiber._debugUpdateQueue.push(typedNode);
        }

        nextStateObj.isForce = nextStateObj.isForce || updater.isForce;

        updater.callback && nextStateObj.callback.push(updater.callback);
      }
      node = nextNode;
    }

    if (allQueue.length) renderPlatform.microTask(() => fiber._prepare());

    return { needUpdate: true, isSync: true };
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component) {
        if (__DEV__ && updater.trigger !== typedInstance) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        // TODO
        const lastResult = nextStateObj.pendingState;

        nextStateObj.pendingState = safeCallWithFiber({
          fiber,
          fallback: () => nextStateObj.pendingState,
          action: () => Object.assign({}, lastResult, typeof updater.payLoad === "function" ? updater.payLoad(baseState, baseProps) : updater.payLoad),
        });

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = nextStateObj.pendingState;

          typedFiber._debugUpdateQueue.push(typedNode);
        }

        nextStateObj.isForce = nextStateObj.isForce || updater.isForce;

        sync = sync || updater.isSync;

        updater.callback && nextStateObj.callback.push(updater.callback);
      }
      node = nextNode;
    }

    return { needUpdate: true, isSync: sync };
  }
};

export const processFunctionComponentUpdateQueue = (fiber: MyReactFiberNode, enableTaskPriority?: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && enableDebugFiled.current && allQueue) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let needUpdate = false;

  let sync = false;

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

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          typedNode._debugUpdateState = { needUpdate, isSync: sync };

          typedFiber._debugUpdateQueue.push(typedNode);

          typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

          typedTrigger._debugUpdateQueue.push(typedNode);
        }

        sync = sync || updater.isSync;

        if (!Object.is(lastResult, typedTrigger.result)) needUpdate = true;
      }

      node = nextNode;
    }

    if (allQueue.length) renderPlatform.microTask(() => fiber._prepare());

    return { needUpdate, isSync: sync };
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

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          typedNode._debugUpdateState = { needUpdate, isSync: sync };

          typedFiber._debugUpdateQueue.push(typedNode);

          typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

          typedTrigger._debugUpdateQueue.push(typedNode);
        }

        sync = sync || updater.isSync;

        if (!Object.is(lastResult, typedTrigger.result)) needUpdate = true;
      }

      node = nextNode;
    }

    return { needUpdate, isSync: sync };
  }
};

/**
 * @deprecated
 */
export const syncFiberStateToComponent = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedPendingState = fiber.pendingState;

  typedInstance.state = Object.assign({}, typedInstance.state, typedPendingState.pendingState);

  if (typedPendingState.callback.length) {
    const callback = typedPendingState.callback;

    const renderDispatch = currentRenderDispatch.current;

    renderDispatch.pendingLayoutEffect(fiber, () => callback.forEach((cb) => cb?.()));
  }
};

/**
 * @deprecated
 */
export const syncFlushComponentQueue = (fiber: MyReactFiberNode) => {
  processClassComponentUpdateQueue(fiber);

  syncFiberStateToComponent(fiber);

  syncComponentStateToFiber(fiber);
};
