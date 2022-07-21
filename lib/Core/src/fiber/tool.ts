import type { MixinMyReactComponentType } from '../component';
import type { createContext } from '../element';
import type {
  ComponentUpdateQueue,
  HookUpdateQueue,
  MyReactFiberNode,
} from './instance';

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

  // context value should keep original
  return contextValue;

  // return typeof contextValue === 'object' && contextValue !== null
  //   ? Object.assign({}, contextValue)
  //   : contextValue;
};

const getAllUpdater = (fiber: MyReactFiberNode) => {
  const allUpdater = fiber.updateQueue.slice(0);
  const allComponentUpdater: ComponentUpdateQueue[] = [];
  const allHookUpdater: HookUpdateQueue[] = [];
  allUpdater.forEach((updater) => {
    if (updater.type === 'hook') {
      allHookUpdater.push(updater);
    } else {
      allComponentUpdater.push(updater);
    }
  });

  return { allComponentUpdater, allHookUpdater };
};

export const processComponentUpdateQueue = (fiber: MyReactFiberNode) => {
  const { allComponentUpdater, allHookUpdater } = getAllUpdater(fiber);
  fiber.updateQueue = allHookUpdater;
  const typedInstance = fiber.instance as MixinMyReactComponentType;
  const baseState = Object.assign({}, typedInstance.state);
  const baseProps = Object.assign({}, typedInstance.props);
  return allComponentUpdater.reduce<{
    newState: any;
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
  const { allComponentUpdater, allHookUpdater } = getAllUpdater(fiber);
  fiber.updateQueue = allComponentUpdater;
  allHookUpdater.forEach(({ action, trigger }) => {
    trigger.result = trigger.reducer(trigger.result, action);
  });
};
