import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { createContext } from "@my-react/react";

const emptyObj = {};

export const defaultGenerateContextMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>>) => {
  const parent = fiber.parent;

  if (parent) {
    let parentMap = map.get(parent) || emptyObj;

    if (parent.type & NODE_TYPE.__provider__) {
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

export const defaultGetContextFiber = (fiber: MyReactFiberNode, ContextObject?: ReturnType<typeof createContext> | null) => {
  if (ContextObject) {
    const contextMap = fiber.container.renderDispatch.contextMap.get(fiber);

    return contextMap?.[ContextObject.contextId] || null;
  } else {
    return null;
  }
};

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__context__) {
    const set = new Set(fiber.dependence);

    const renderPlatform = fiber.container.renderPlatform as CustomRenderPlatform;

    renderPlatform.microTask(() => {
      set.forEach((i) => {
        if (i._ownerFiber && !(i._ownerFiber.state & STATE_TYPE.__unmount__)) {
          i._ownerFiber.state = STATE_TYPE.__triggerConcurrent__;
        }
      });
      // sync skip from root
      fiber.container.rootFiber._update(STATE_TYPE.__skippedSync__);
    });

    if (fiber.patch & PATCH_TYPE.__context__) fiber.patch ^= PATCH_TYPE.__context__;
  }
};
