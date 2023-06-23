import { STATE_TYPE } from "@my-react/react-shared";

import { isErrorBoundariesInstance } from "../dispatchErrorBoundaries";

import type { MyReactFiberNode, PendingStateType, PendingStateTypeWithError } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

export const processClassComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  const allQueue = fiber.updateQueue;

  let node = allQueue.head;

  const typedInstance = fiber.instance as MyReactComponent;

  const typedComponent = fiber.elementType as MixinMyReactClassComponent;

  const baseState = Object.assign({}, typedInstance.state);

  const baseProps = Object.assign({}, typedInstance.props);

  const isErrorCatch = isErrorBoundariesInstance(typedInstance, typedComponent);

  const nextState = isErrorCatch ? (fiber.pendingState as PendingStateTypeWithError).state : (fiber.pendingState as PendingStateType);

  if (!node) return false;

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "component") {
      if (__DEV__ && updater.trigger !== typedInstance) throw new Error("current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      nextState.pendingState = Object.assign(
        nextState.pendingState || baseState,
        typeof updater.payLoad === "function" ? updater.payLoad(baseState, baseProps) : updater.payLoad
      );

      nextState.isForce = nextState.isForce || updater.isForce;

      updater.callback && nextState.callback.push(updater.callback);
    }
    node = nextNode;
  }

  return true;
};

export const processFunctionComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  const allQueue = fiber.updateQueue;

  let node = allQueue.head;

  let needUpdate = false;

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "hook") {
      if (__DEV__ && updater.trigger._ownerFiber !== fiber) throw new Error("current update not valid, look like a bug for @my-react");

      allQueue.delete(node);

      const { trigger, payLoad } = updater;

      const typedTrigger = trigger as MyReactHookNode;

      const lastResult = typedTrigger.result;

      typedTrigger.result = typedTrigger.reducer(lastResult, payLoad);

      if (!Object.is(lastResult, typedTrigger.result)) needUpdate = true;
    }

    node = nextNode;
  }

  return needUpdate;
};
