/* eslint-disable max-lines */
import { __my_react_internal__, __my_react_shared__, type MyReactComponent, type UpdateQueue } from "@my-react/react";
import { HOOK_TYPE, ListTree, STATE_TYPE, UpdateQueueType, exclude, include } from "@my-react/react-shared";

import { syncComponentStateToFiber } from "../processClass";
import { prepareUpdateOnFiber, type MyReactFiberNode, type MyReactFiberNodeDev } from "../runtimeFiber";
import { getInstanceOwnerFiber } from "../runtimeGenerate";
import { enableDebugUpdateQueue, NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { UpdateQueueDev } from "../processState";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactHookNodeDev } from "../runtimeHook";

const { enableDebugFiled } = __my_react_shared__;
const { currentScheduler } = __my_react_internal__;

export type UpdateState = {
  needUpdate: boolean;
  nodes?: Array<UpdateQueue | UpdateQueueDev | UpdateQueue["trigger"]>;
  isSync: boolean;
  isForce: boolean;
  isImmediate?: boolean;
  isRetrigger?: boolean;
  callback?: () => void;
};

// TODO 整合
export const processClassComponentUpdateQueueLatest = (
  renderDispatch: CustomRenderDispatch,
  fiber: MyReactFiberNode,
  enableTaskPriority?: boolean
): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__class__)) throw new Error("[@my-react/react] current fiber is not a class component, look like a bug for @my-react");

  const renderScheduler = currentScheduler.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  const needUpdate = true;

  let isSync = false;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const callbacks: Array<() => void> = [];

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const typedInstance = fiber.instance as MyReactComponent;

  const baseState = Object.assign({}, fiber.pendingState);

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

        processedNodes.push(updater);

        const { payLoad } = updater;

        fiber.pendingState = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            return pendingState;
          },
          action: function safeGetNextState() {
            return Object.assign({}, fiber.pendingState, typeof payLoad === "function" ? payLoad(baseState, baseProps) : payLoad);
          },
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      } else if (updater.isSync) {
        allQueue.delete(node);

        processedNodes.push(updater);

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }

      node = nextNode;
    }

    if (allQueue.length) {
      renderScheduler.macroTask(function prepareUpdateOnFiberTask() {
        prepareUpdateOnFiber(renderDispatch, fiber, true, false);
      });
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    return {
      needUpdate,
      nodes: processedNodes,
      isSync,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component) {
        if (__DEV__ && updater.trigger !== typedInstance) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        processedNodes.push(updater);

        const { payLoad } = updater;

        fiber.pendingState = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            return pendingState;
          },
          action: function safeGetNextState() {
            return Object.assign({}, fiber.pendingState, typeof payLoad === "function" ? payLoad(baseState, baseProps) : payLoad);
          },
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      } else {
        allQueue.delete(node);

        processedNodes.push(updater);

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = pendingState;

          typedNode._debugBaseValue = baseState;

          typedNode._debugAfterValue = fiber.pendingState;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }
      node = nextNode;
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    return {
      needUpdate,
      nodes: processedNodes,
      isSync,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  }
};

export const processClassComponentUpdateQueueLegacy = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__class__)) throw new Error("[@my-react/react] current fiber is not a class component, look like a bug for @my-react");

  const renderScheduler = currentScheduler.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  const node = allQueue?.head;

  const needUpdate = true;

  let isSync = true;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const callbacks: Array<() => void> = [];

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const typedInstance = fiber.instance as MyReactComponent;

  const baseState = Object.assign({}, fiber.pendingState);

  const baseProps = Object.assign({}, typedInstance.props);

  const pendingState = Object.assign({}, fiber.pendingState);

  if (node) {
    const updater = node.value;

    if (updater.type === UpdateQueueType.component) {
      if (__DEV__ && updater.trigger !== typedInstance) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      processedNodes.push(updater);

      const { payLoad } = updater;

      fiber.pendingState = safeCallWithCurrentFiber({
        fiber,
        fallback: function safeFallbackForState() {
          return pendingState;
        },
        action: function safeGetNextState() {
          return Object.assign({}, fiber.pendingState, typeof payLoad === "function" ? payLoad(baseState, baseProps) : payLoad);
        },
      });

      isSync = isSync || updater.isSync;

      isForce = isForce || updater.isForce;

      isImmediate = isImmediate || updater.isImmediate;

      isRetrigger = isRetrigger || updater.isRetrigger;

      updater.callback && callbacks.push(updater.callback);

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = updater as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = pendingState;

        typedNode._debugBaseValue = baseState;

        typedNode._debugAfterValue = fiber.pendingState;

        if (enableDebugUpdateQueue.current) {
          typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

          typedFiber._debugUpdateQueue.push(typedNode);
        }
      }
    } else {
      allQueue.delete(node);

      processedNodes.push(updater);

      isSync = isSync || updater.isSync;

      isForce = isForce || updater.isForce;

      isImmediate = isImmediate || updater.isImmediate;

      isRetrigger = isRetrigger || updater.isRetrigger;

      updater.callback && callbacks.push(updater.callback);

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = updater as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = pendingState;

        typedNode._debugBaseValue = baseState;

        typedNode._debugAfterValue = fiber.pendingState;

        if (enableDebugUpdateQueue.current) {
          typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

          typedFiber._debugUpdateQueue.push(typedNode);
        }
      }
    }
  }

  if (allQueue.length) {
    renderScheduler.microTask(function prepareUpdateOnFiberTask() {
      prepareUpdateOnFiber(renderDispatch, fiber, true, false);
    });
  }

  const invokeCallbackArray = callbacks.length
    ? function invokeCallbackArray() {
        return callbacks.forEach((cb) => cb?.());
      }
    : void 0;

  return {
    needUpdate,
    nodes: processedNodes,
    isSync,
    isForce,
    isImmediate,
    isRetrigger,
    callback: invokeCallbackArray,
  };
};

export const processFunctionComponentUpdateQueueLatest = (
  renderDispatch: CustomRenderDispatch,
  fiber: MyReactFiberNode,
  enableTaskPriority?: boolean
): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__function__)) {
    throw new Error("[@my-react/react] current fiber is not a function component, look like a bug for @my-react");
  }

  const renderScheduler = currentScheduler.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  let needUpdate = false;

  let isSync = false;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const callbacks: Array<() => void> = [];

  if (enableTaskPriority && allQueue.some((l) => l.isSync)) {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.hook && updater.isSync) {
        if (__DEV__ && getInstanceOwnerFiber(updater.trigger) !== fiber) {
          throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
        }

        allQueue.delete(node);

        processedNodes.push(updater);

        const { trigger, payLoad, reducer } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        let lastResult = typedTrigger.result;

        if (typedTrigger.type === HOOK_TYPE.useSyncExternalStore) {
          lastResult = trigger.value?.result;
        }

        let hasError = false;

        typedTrigger.result = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            hasError = true;
            return lastResult;
          },
          action: function safeGetNextState() {
            if (reducer && typeof reducer === "function") {
              return reducer(lastResult, payLoad);
            } else {
              return typedTrigger.reducer(lastResult, payLoad);
            }
          },
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || hasError || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);

            typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

            typedTrigger._debugUpdateQueue.push(typedNode);
          }
        }
      } else if (updater.isSync) {
        allQueue.delete(node);

        processedNodes.push(updater);

        const { payLoad } = updater;

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = undefined;

          typedNode._debugAfterValue = payLoad;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }

      node = nextNode;
    }

    if (allQueue.length) {
      renderScheduler.macroTask(function prepareUpdateOnFiberTask() {
        prepareUpdateOnFiber(renderDispatch, fiber, true, false);
      });
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    return {
      needUpdate,
      nodes: processedNodes,
      isSync,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.hook) {
        if (__DEV__ && getInstanceOwnerFiber(updater.trigger) !== fiber) {
          throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
        }

        allQueue.delete(node);

        processedNodes.push(updater);

        const { trigger, payLoad, reducer } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        let lastResult = typedTrigger.result;

        if (typedTrigger.type === HOOK_TYPE.useSyncExternalStore) {
          lastResult = trigger.value?.result;
        }

        let hasError = false;

        typedTrigger.result = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            hasError = true;
            return lastResult;
          },
          action: function safeGetNextState() {
            if (reducer && typeof reducer === "function") {
              return reducer(lastResult, payLoad);
            } else {
              return typedTrigger.reducer(lastResult, payLoad);
            }
          },
        });

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || hasError || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = lastResult;

          typedNode._debugAfterValue = typedTrigger.result;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);

            typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

            typedTrigger._debugUpdateQueue.push(typedNode);
          }
        }
      } else {
        allQueue.delete(node);

        processedNodes.push(updater);

        const { payLoad } = updater;

        isSync = isSync || updater.isSync;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = undefined;

          typedNode._debugAfterValue = payLoad;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }

      node = nextNode;
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    return {
      needUpdate,
      nodes: processedNodes,
      isSync,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  }
};

export const processFunctionComponentUpdateQueueLegacy = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__function__)) {
    throw new Error("[@my-react/react] current fiber is not a function component, look like a bug for @my-react");
  }

  const renderScheduler = currentScheduler.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  const node = allQueue?.head;

  let needUpdate = false;

  let isSync = true;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const callbacks: Array<() => void> = [];

  if (node) {
    const updater = node.value;

    if (updater.type === UpdateQueueType.hook) {
      if (__DEV__ && getInstanceOwnerFiber(updater.trigger) !== fiber) {
        throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
      }

      allQueue.delete(node);

      processedNodes.push(updater);

      const { trigger, payLoad, reducer } = updater;

      const typedTrigger = trigger as MyReactHookNodeDev;

      let lastResult = typedTrigger.result;

      if (typedTrigger.type === HOOK_TYPE.useSyncExternalStore) {
        lastResult = trigger.value?.result;
      }

      let hasError = false;

      typedTrigger.result = safeCallWithCurrentFiber({
        fiber,
        fallback: function safeFallbackForState() {
          hasError = true;
          return lastResult;
        },
        action: function safeGetNextState() {
          if (reducer && typeof reducer === "function") {
            return reducer(lastResult, payLoad);
          } else {
            return typedTrigger.reducer(lastResult, payLoad);
          }
        },
      });

      isSync = isSync || updater.isSync;

      isForce = isForce || updater.isForce;

      isImmediate = isImmediate || updater.isImmediate;

      isRetrigger = isRetrigger || updater.isRetrigger;

      updater.callback && callbacks.push(updater.callback);

      if (!needUpdate && (isForce || hasError || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = updater as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = lastResult;

        typedNode._debugAfterValue = typedTrigger.result;

        if (enableDebugUpdateQueue.current) {
          typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

          typedFiber._debugUpdateQueue.push(typedNode);

          typedTrigger._debugUpdateQueue = typedTrigger._debugUpdateQueue || new ListTree();

          typedTrigger._debugUpdateQueue.push(typedNode);
        }
      }
    } else {
      allQueue.delete(node);

      processedNodes.push(updater);

      const { payLoad } = updater;

      isSync = isSync || updater.isSync;

      isForce = isForce || updater.isForce;

      isImmediate = isImmediate || updater.isImmediate;

      isRetrigger = isRetrigger || updater.isRetrigger;

      updater.callback && callbacks.push(updater.callback);

      needUpdate = true;

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = updater as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = undefined;

        typedNode._debugAfterValue = payLoad;

        if (enableDebugUpdateQueue.current) {
          typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

          typedFiber._debugUpdateQueue.push(typedNode);
        }
      }
    }
  }

  if (allQueue.length) {
    renderScheduler.microTask(function prepareUpdateOnFiberTask() {
      prepareUpdateOnFiber(renderDispatch, fiber, true, false);
    });
  }

  const invokeCallbackArray = callbacks.length
    ? function invokeCallbackArray() {
        return callbacks.forEach((cb) => cb?.());
      }
    : void 0;

  return {
    needUpdate,
    nodes: processedNodes,
    isSync,
    isForce,
    isImmediate,
    isRetrigger,
    callback: invokeCallbackArray,
  };
};

export const processNormalComponentUpdateLatest = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  const needUpdate = true;

  let isSync = false;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const callbacks: Array<() => void> = [];

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    allQueue.delete(node);

    processedNodes.push(updater);

    const { payLoad } = updater;

    isSync = isSync || updater.isSync;

    isForce = isForce || updater.isForce;

    isImmediate = isImmediate || updater.isImmediate;

    isRetrigger = isRetrigger || updater.isRetrigger;

    updater.callback && callbacks.push(updater.callback);

    if (__DEV__ && enableDebugFiled.current) {
      const typedNode = updater as UpdateQueueDev;

      typedNode._debugRunTime = Date.now();

      typedNode._debugBeforeValue = undefined;

      typedNode._debugAfterValue = payLoad;

      if (enableDebugUpdateQueue.current) {
        typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

        typedFiber._debugUpdateQueue.push(typedNode);
      }
    }

    node = nextNode;
  }

  const invokeCallbackArray = callbacks.length
    ? function invokeCallbackArray() {
        return callbacks.forEach((cb) => cb?.());
      }
    : void 0;

  return {
    needUpdate,
    nodes: processedNodes,
    isSync,
    isForce,
    isImmediate,
    isRetrigger,
    callback: invokeCallbackArray,
  };
};

export const processNormalComponentUpdateLegacy = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  const renderScheduler = currentScheduler.current;

  const node = allQueue?.head;

  const needUpdate = true;

  let isSync = true;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const callbacks: Array<() => void> = [];

  if (node) {
    const updater = node.value;

    allQueue.delete(node);

    processedNodes.push(updater);

    const { payLoad } = updater;

    isSync = isSync || updater.isSync;

    isForce = isForce || updater.isForce;

    isImmediate = isImmediate || updater.isImmediate;

    isRetrigger = isRetrigger || updater.isRetrigger;

    updater.callback && callbacks.push(updater.callback);

    if (__DEV__ && enableDebugFiled.current) {
      const typedNode = updater as UpdateQueueDev;

      typedNode._debugRunTime = Date.now();

      typedNode._debugBeforeValue = undefined;

      typedNode._debugAfterValue = payLoad;

      if (enableDebugUpdateQueue.current) {
        typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

        typedFiber._debugUpdateQueue.push(typedNode);
      }
    }
  }

  if (allQueue.length) {
    renderScheduler.microTask(function prepareUpdateOnFiberTask() {
      prepareUpdateOnFiber(renderDispatch, fiber, true, false);
    });
  }

  const invokeCallbackArray = callbacks.length
    ? function invokeCallbackArray() {
        return callbacks.forEach((cb) => cb?.());
      }
    : void 0;

  return {
    needUpdate,
    nodes: processedNodes,
    isSync,
    isForce,
    isImmediate,
    isRetrigger,
    callback: invokeCallbackArray,
  };
};

/**
 * @deprecated
 */
export const syncFiberStateToComponent = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, callback?: () => void) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedPendingState = fiber.pendingState;

  typedInstance.state = Object.assign({}, typedInstance.state, typedPendingState);

  callback && renderDispatch.pendingLayoutEffect(fiber, callback, { stickyToFoot: true });
};

/**
 * @deprecated
 */
export const syncFlushComponentQueue = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  const { needUpdate, callback } = processClassComponentUpdateQueueLatest(renderDispatch, fiber);

  needUpdate && syncFiberStateToComponent(renderDispatch, fiber, callback);

  syncComponentStateToFiber(fiber);
};
