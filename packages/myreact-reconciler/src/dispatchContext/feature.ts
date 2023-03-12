import { PATCH_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactFiberNode, createContext, RenderPlatform } from "@my-react/react";

const emptyObj = {};

export const defaultGenerateContextMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>>) => {
  const parent = fiber.parent;
  if (parent) {
    let parentMap = map.get(parent) || emptyObj;
    if (parent.type & NODE_TYPE.__isContextProvider__) {
      const typedElementType = parent.elementType as ReturnType<typeof createContext>["Provider"];
      const contextObj = typedElementType["Context"];
      const contextId = contextObj["contextId"];
      parentMap = Object.assign({}, parentMap, { [contextId]: parent });
    }
    if (parentMap !== emptyObj) {
      map.set(fiber, parentMap);
      if (__DEV__) {
        const typedFiber = fiber as MyReactFiberNodeDev;

        typedFiber._debugContextMap = parentMap;
      }
    }
  }
};

export const defaultGetContextValue = (fiber: MyReactFiberNode | null, ContextObject?: ReturnType<typeof createContext> | null) => {
  if (fiber) {
    return (fiber.pendingProps["value"] as Record<string, unknown>) ?? null;
  } else {
    return (ContextObject?.Provider["value"] as Record<string, unknown>) ?? null;
  }
};

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const set = new Set(fiber.dependence);

    const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

    renderPlatform.macroTask(() => set.forEach((i) => i._ownerFiber?._update()));

    if (fiber.patch & PATCH_TYPE.__pendingContext__) fiber.patch ^= PATCH_TYPE.__pendingContext__;
  }
};
