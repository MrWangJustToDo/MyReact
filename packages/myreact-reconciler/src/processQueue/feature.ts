/* eslint-disable max-lines */
import { __my_react_internal__, __my_react_shared__, type MyReactComponent, type UpdateQueue } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, exclude, include } from "@my-react/react-shared";

import { syncComponentStateToFiber } from "../runtimeComponent";
import { prepareUpdateOnFiber, type MyReactFiberNode, type MyReactFiberNodeDev } from "../runtimeFiber";
import { getInstanceOwnerFiber } from "../runtimeGenerate";
import { currentRenderDispatch, enableDebugUpdateQueue, getCurrentDispatchFromFiber, NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { UpdateQueueDev } from "../processState";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactHookNodeDev } from "../runtimeHook";

const { enableDebugFiled } = __my_react_shared__;
const { currentRenderPlatform } = __my_react_internal__;

export type UpdateState = {
  needUpdate: boolean;
  nodes?: Array<UpdateQueue | UpdateQueueDev | UpdateQueue["trigger"]>;
  isSync: boolean;
  isSkip: boolean;
  isForce: boolean;
  isImmediate?: boolean;
  isRetrigger?: boolean;
  callback?: () => void;
};

export const processClassComponentUpdateQueue = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, enableTaskPriority?: boolean): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__class__)) throw new Error("[@my-react/react] current fiber is not a class component, look like a bug for @my-react");

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  let isSync = false;

  let isSkip = true;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const callbacks: Array<() => void> = [];

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

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

        if (__DEV__) {
          processedNodes.push(updater);
        }

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

        isSkip = isSkip && updater.isSkip;

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

      if ((updater.type === UpdateQueueType.hmr || updater.type === UpdateQueueType.trigger) && updater.isSync) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

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
      renderPlatform.macroTask(function prepareUpdateOnFiberTask() {
        prepareUpdateOnFiber(fiber, renderDispatch, true, false);
      });
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    if (__DEV__) {
      return {
        needUpdate: true,
        nodes: processedNodes,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    } else {
      return {
        needUpdate: true,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    }
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.component) {
        if (__DEV__ && updater.trigger !== typedInstance) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

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

        isSkip = isSkip && updater.isSkip;

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

      if (updater.type === UpdateQueueType.hmr || updater.type === UpdateQueueType.trigger) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

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

    if (__DEV__) {
      return {
        needUpdate: true,
        nodes: processedNodes,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    } else {
      return {
        needUpdate: true,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    }
  }
};

export const processFunctionComponentUpdateQueue = (
  fiber: MyReactFiberNode,
  renderDispatch: CustomRenderDispatch,
  enableTaskPriority?: boolean
): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__function__)) {
    throw new Error("[@my-react/react] current fiber is not a function component, look like a bug for @my-react");
  }

  const renderPlatform = currentRenderPlatform.current;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  let needUpdate = false;

  let isSync = false;

  let isSkip = true;

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

        if (__DEV__) {
          processedNodes.push(updater);
        }

        const { trigger, payLoad } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        const lastResult = typedTrigger.result;

        typedTrigger.result = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            return lastResult;
          },
          action: function safeGetNextState() {
            return typedTrigger.reducer(lastResult, payLoad);
          },
        });

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

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
      }

      if (updater.type === UpdateQueueType.promise && updater.isSync) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        const { payLoad } = updater;

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

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

      if ((updater.type === UpdateQueueType.hmr || updater.type === UpdateQueueType.trigger) && updater.isSync) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = undefined;

          typedNode._debugAfterValue = undefined;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }

      node = nextNode;
    }

    if (allQueue.length) {
      renderPlatform.macroTask(function prepareUpdateOnFiberTask() {
        prepareUpdateOnFiber(fiber, renderDispatch, true, false);
      });
    }

    const invokeCallbackArray = callbacks.length
      ? function invokeCallbackArray() {
          return callbacks.forEach((cb) => cb?.());
        }
      : void 0;

    if (__DEV__) {
      return {
        needUpdate,
        nodes: processedNodes,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    } else {
      return {
        needUpdate,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    }
  } else {
    while (node) {
      const updater = node.value;

      const nextNode = node.next;

      if (updater.type === UpdateQueueType.hook) {
        if (__DEV__ && getInstanceOwnerFiber(updater.trigger) !== fiber) {
          throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");
        }

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        const { trigger, payLoad } = updater;

        const typedTrigger = trigger as MyReactHookNodeDev;

        const lastResult = typedTrigger.result;

        typedTrigger.result = safeCallWithCurrentFiber({
          fiber,
          fallback: function safeFallbackForState() {
            return lastResult;
          },
          action: function safeGetNextState() {
            return typedTrigger.reducer(lastResult, payLoad);
          },
        });

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        if (!needUpdate && (isForce || callbacks.length || !Object.is(lastResult, typedTrigger.result))) needUpdate = true;

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
      }

      if (updater.type === UpdateQueueType.promise) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        const { payLoad } = updater;

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = node.value as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = undefined;

          typedNode._debugAfterValue = payLoad;

          if (enableDebugUpdateQueue.current) {
            typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

            typedFiber._debugUpdateQueue.push(typedNode);
          }
        }
      }

      if (updater.type === UpdateQueueType.hmr || updater.type === UpdateQueueType.trigger) {
        if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

        allQueue.delete(node);

        if (__DEV__) {
          processedNodes.push(updater);
        }

        isSync = isSync || updater.isSync;

        isSkip = isSkip && updater.isSkip;

        isForce = isForce || updater.isForce;

        isImmediate = isImmediate || updater.isImmediate;

        isRetrigger = isRetrigger || updater.isRetrigger;

        updater.callback && callbacks.push(updater.callback);

        needUpdate = true;

        if (__DEV__ && enableDebugFiled.current) {
          const typedNode = updater as UpdateQueueDev;

          typedNode._debugRunTime = Date.now();

          typedNode._debugBeforeValue = undefined;

          typedNode._debugAfterValue = undefined;

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

    if (__DEV__) {
      return {
        needUpdate,
        nodes: processedNodes,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    } else {
      return {
        needUpdate,
        isSync,
        isSkip,
        isForce,
        isImmediate,
        isRetrigger,
        callback: invokeCallbackArray,
      };
    }
  }
};

export const processLazyComponentUpdate = (fiber: MyReactFiberNode): UpdateState => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (exclude(fiber.type, NODE_TYPE.__lazy__)) throw new Error("[@my-react/react] current fiber is not a lazy component, look like a bug for @my-react");

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  let node = allQueue?.head;

  let needUpdate = false;

  let isSync = false;

  let isSkip = true;

  let isForce = false;

  let isImmediate = false;

  let isRetrigger = false;

  const processedNodes: Array<UpdateQueue | UpdateQueue["trigger"]> = [];

  const callbacks: Array<() => void> = [];

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === UpdateQueueType.lazy) {
      if (__DEV__ && updater.trigger !== fiber) throw new Error("[@my-react/react] current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      if (__DEV__) {
        processedNodes.push(updater);
      }

      const { payLoad } = updater;

      isSync = isSync || updater.isSync;

      isSkip = isSkip && updater.isSkip;

      isForce = isForce || updater.isForce;

      isImmediate = isImmediate || updater.isImmediate;

      isRetrigger = isRetrigger || updater.isRetrigger;

      needUpdate = true;

      updater.callback && callbacks.push(updater.callback);

      if (__DEV__ && enableDebugFiled.current) {
        const typedNode = updater as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = null;

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

  if (__DEV__) {
    return {
      needUpdate,
      nodes: processedNodes,
      isSync,
      isSkip,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  } else {
    return {
      needUpdate,
      isSync,
      isSkip,
      isForce,
      isImmediate,
      isRetrigger,
      callback: invokeCallbackArray,
    };
  }
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
  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  const { needUpdate, callback } = processClassComponentUpdateQueue(fiber, renderDispatch);

  needUpdate && syncFiberStateToComponent(fiber, callback);

  syncComponentStateToFiber(fiber);
};
