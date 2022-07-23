import type { MixinMyReactComponentType } from '../component';
import type { createContext } from '../element';
import type { MyReactFiberNode } from './instance';

export const getContextFiber = (
  fiber: MyReactFiberNode | null,
  ContextObject?: ReturnType<typeof createContext> | null
) => {
  if (ContextObject && fiber) {
    const id = ContextObject.id;
    const contextFiber = fiber.__contextMap__[id];
    return contextFiber;
  }
  return null;
};

export const getContextValue = (
  fiber: MyReactFiberNode | null,
  ContextObject?: ReturnType<typeof createContext> | null
) => {
  const contextValue = (
    fiber ? fiber.__props__.value : ContextObject?.Provider.value
  ) as Record<string, unknown> | null;

  return contextValue;
};

export const processComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  const allComponentUpdater = fiber.compUpdateQueue.slice(0);
  fiber.compUpdateQueue = [];
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  const baseState = Object.assign({}, typedInstance.state);
  const baseProps = Object.assign({}, typedInstance.props);
  return allComponentUpdater.reduce<{
    newState: Record<string, unknown>;
    isForce: boolean;
    callback: Array<() => void>;
  }>(
    (p, c) => ({
      newState: {
        ...p.newState,
        ...(typeof c.payLoad === 'function'
          ? c.payLoad(baseState, baseProps)
          : c.payLoad),
      },
      isForce: p.isForce || c.isForce || false,
      callback: c.callback ? p.callback.concat(c.callback) : p.callback,
    }),
    { newState: {}, isForce: false, callback: [] }
  );
};

export const processHookUpdateQueue = (fiber: MyReactFiberNode) => {
  const allHookUpdater = fiber.hookUpdateQueue.slice(0);
  fiber.hookUpdateQueue = [];
  allHookUpdater.forEach(({ action, trigger }) => {
    trigger.result = trigger.reducer(trigger.result, action);
  });
};
