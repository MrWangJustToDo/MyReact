import { isValidElement, __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode, createContext, MyReactFiberNodeDev } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const getContextMapFromMap = (
  fiber: MyReactFiberNode | null,
  map: Record<string, Record<string, MyReactFiberNode>>
) => {
  if (fiber) {
    return map[fiber.uid];
  } else {
    return {};
  }
};

export const generateContextMap = (fiber: MyReactFiberNode, map: Record<string, Record<string, MyReactFiberNode>>) => {
  const parentMap = getContextMapFromMap(fiber.parent, map);
  const currentMap = getContextMapFromMap(fiber, map);
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
