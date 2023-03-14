import type { MixinMyReactComponentType, MyReactFiberNode } from "@my-react/react";

export const processClassComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return;

  const allQueue = fiber.updateQueue;

  let node = allQueue.head;

  const typedInstance = fiber.instance as MixinMyReactComponentType;

  const baseState = Object.assign({}, typedInstance.state);

  const baseProps = Object.assign({}, typedInstance.props);

  const newResult = typedInstance._result;

  // there are not a updateQueue
  
  if (!node) return false;

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "component") {
      if (__DEV__ && updater.trigger !== typedInstance) {
        throw new Error("current update not valid, look like a bug for MyReact");
      }

      allQueue.delete(node);

      newResult.newState = Object.assign(
        newResult.newState || baseState,
        typeof updater.payLoad === "function" ? updater.payLoad(baseState, baseProps) : updater.payLoad
      );

      newResult.isForce = newResult.isForce || updater.isForce;

      updater.callback && newResult.callback.push(updater.callback);
    }
    node = nextNode;
  }

  typedInstance._result = newResult;

  return true;
};

export const processFunctionComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return;

  const allQueue = fiber.updateQueue;

  let node = allQueue.head;

  let needUpdate = false;

  while (node) {
    const updater = node.value;

    const nextNode = node.next;

    if (updater.type === "hook") {
      if (__DEV__ && updater.trigger._ownerFiber !== fiber) {
        throw new Error("current update not valid, look like a bug for MyReact");
      }

      allQueue.delete(node);

      const { trigger, payLoad } = updater;

      const lastResult = trigger.result;

      trigger.result = trigger.reducer(lastResult, payLoad);

      if (!Object.is(lastResult, trigger.result)) {
        needUpdate = true;
      }
    }

    node = nextNode;
  }

  return needUpdate;
};
