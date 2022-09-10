import { isValidElement, __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode, createContext, MyReactFiberNodeDev, MyReactElement } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const defaultGetContextMapFromMap = (
  fiber: MyReactFiberNode | null,
  map: Record<string, Record<string, MyReactFiberNode>>
) => {
  if (fiber) {
    return map[fiber.uid];
  } else {
    return {};
  }
};

export const defaultGenerateContextMap = (
  fiber: MyReactFiberNode,
  map: Record<string, Record<string, MyReactFiberNode>>
) => {
  const parentMap = defaultGetContextMapFromMap(fiber.parent, map);
  const currentMap = defaultGetContextMapFromMap(fiber, map);
  const contextMap = Object.assign({}, parentMap, currentMap);
  const element = fiber.element;
  const id = fiber.uid;
  if (isValidElement(element) && typeof element.type === "object" && fiber.type & NODE_TYPE.__isContextProvider__) {
    const typedElementType = element.type as ReturnType<typeof createContext>["Provider"];
    const contextObj = typedElementType["Context"];
    const contextId = contextObj["id"];
    contextMap[contextId] = fiber;
  }
  map[id] = contextMap;
  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugContextMap = contextMap;
  }
};

export const defaultGetContextValue = (
  fiber: MyReactFiberNode | null,
  ContextObject?: ReturnType<typeof createContext> | null
) => {
  if (fiber) {
    const typedElement = fiber.element as MyReactElement;
    return (typedElement.props["value"] as Record<string, unknown>) || null;
  } else {
    return (ContextObject?.Provider["value"] as Record<string, unknown>) || null;
  }
};
