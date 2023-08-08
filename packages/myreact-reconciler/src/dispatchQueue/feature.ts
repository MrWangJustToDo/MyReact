import { type MixinMyReactClassComponent, type MyReactComponent } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import { isErrorBoundariesInstance } from "../dispatchErrorBoundaries";
import { syncComponentStateToFiber } from "../runtimeComponent";
import { currentRenderDispatch, safeCallWithFiber } from "../share";

import type { UpdateQueueDev } from "../processState";
import type { MyReactFiberNode, MyReactFiberNodeDev, PendingStateType, PendingStateTypeWithError } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";

export const processClassComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && allQueue) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let sync = false;

  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const baseState = Object.assign({}, typedInstance.state);

  const baseProps = Object.assign({}, typedInstance.props);

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  const nextState = isErrorCatch ? (fiber.pendingState as PendingStateTypeWithError).state : (fiber.pendingState as PendingStateType);

  if (!node) return { needUpdate: false, isSync: false };

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "component") {
      if (__DEV__ && updater.trigger !== typedInstance) throw new Error("current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      // TODO
      const lastResult = nextState.pendingState || baseState;

      safeCallWithFiber({
        fiber,
        action: () => {
          nextState.pendingState = Object.assign(
            {},
            lastResult,
            typeof updater.payLoad === "function" ? updater.payLoad(baseState, baseProps) : updater.payLoad
          );
        },
      });

      if (__DEV__) {
        const typedNode = node.value as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = lastResult;

        typedNode._debugAfterValue = nextState.pendingState;

        typedFiber._debugUpdateQueue.push(typedNode);
      }

      nextState.isForce = nextState.isForce || updater.isForce;

      sync = sync || updater.isSync;

      updater.callback && nextState.callback.push(updater.callback);
    }
    node = nextNode;
  }

  return { needUpdate: true, isSync: sync };
};

export const processFunctionComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  const allQueue = fiber.updateQueue;

  const typedFiber = fiber as MyReactFiberNodeDev;

  if (__DEV__ && allQueue) typedFiber._debugUpdateQueue = typedFiber._debugUpdateQueue || new ListTree();

  let node = allQueue?.head;

  let needUpdate = false;

  let sync = false;

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "hook") {
      if (__DEV__ && updater.trigger._ownerFiber !== fiber) throw new Error("current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      const { trigger, payLoad } = updater;

      const typedTrigger = trigger as MyReactHookNode;

      const lastResult = typedTrigger.result;

      safeCallWithFiber({
        fiber,
        action: () => {
          typedTrigger.result = typedTrigger.reducer(lastResult, payLoad);
        },
      });

      if (__DEV__) {
        const typedNode = node.value as UpdateQueueDev;

        typedNode._debugRunTime = Date.now();

        typedNode._debugBeforeValue = lastResult;

        typedNode._debugAfterValue = typedTrigger.result;

        typedFiber._debugUpdateQueue.push(typedNode);
      }

      sync = sync || updater.isSync;

      if (!Object.is(lastResult, typedTrigger.result)) needUpdate = true;
    }

    node = nextNode;
  }

  return { needUpdate, isSync: sync };
};

/**
 * @deprecated
 */
export const syncFiberStateToComponent = (fiber: MyReactFiberNode) => {
  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  const typedPendingState = isErrorCatch ? (fiber.pendingState as PendingStateTypeWithError).state : (fiber.pendingState as PendingStateType);

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
