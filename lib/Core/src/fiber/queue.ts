import type { MixinMyReactComponentType } from '../component';
import type { MyReactFiberNode } from './instance';

export const processComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  const allComponentUpdater = fiber.__compUpdateQueue__.slice(0);
  fiber.__compUpdateQueue__ = [];
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
  const allHookUpdater = fiber.__hookUpdateQueue__.slice(0);
  fiber.__hookUpdateQueue__ = [];
  allHookUpdater.forEach(({ action, trigger }) => {
    trigger.result = trigger.reducer(trigger.result, action);
  });
};
