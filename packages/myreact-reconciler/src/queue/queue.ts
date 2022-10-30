import type { MixinMyReactComponentType, MyReactFiberNode, UpdateQueue } from "@my-react/react";

export const processComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  const allQueue = fiber.updateQueue.slice(0);
  const lastQueue: UpdateQueue[] = [];
  fiber.updateQueue = [];
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  const baseState = Object.assign({}, typedInstance.state);
  const baseProps = Object.assign({}, typedInstance.props);
  allQueue.reduce<{
    newState: Record<string, unknown>;
    isForce: boolean;
    callback: Array<() => void>;
  }>(
    (p, c) => {
      if (c.type === "component") {
        const result = {
          newState: {
            ...p.newState,
            ...(typeof c.payLoad === "function" ? c.payLoad(baseState, baseProps) : c.payLoad),
          },
          isForce: p.isForce || c.isForce || false,
          callback: c.callback ? p.callback.concat(c.callback) : p.callback,
        };
        if (__DEV__ && c.trigger !== typedInstance) {
          throw new Error("current update not valid, look like a bug for MyReact");
        }
        typedInstance._result = result;
        return result;
      } else {
        lastQueue.push(c);
        return p;
      }
    },
    { newState: { ...baseState }, isForce: false, callback: [] }
  );
  fiber.updateQueue = [...lastQueue, ...fiber.updateQueue];
};

export const processHookUpdateQueue = (fiber: MyReactFiberNode) => {
  const allQueue = fiber.updateQueue.slice(0);
  const lastQueue: UpdateQueue[] = [];
  fiber.updateQueue = [];
  allQueue.forEach((updater) => {
    if (updater.type === "hook") {
      const { trigger, payLoad } = updater;
      const lastResult = trigger.result;
      trigger.result = trigger.reducer(lastResult, payLoad);
      if (!Object.is(lastResult, trigger.result)) {
        fiber.update();
      }
    } else {
      lastQueue.push(updater);
    }
  });
  fiber.updateQueue = [...lastQueue, ...fiber.updateQueue];
};
