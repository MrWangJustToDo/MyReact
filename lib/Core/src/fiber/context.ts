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
