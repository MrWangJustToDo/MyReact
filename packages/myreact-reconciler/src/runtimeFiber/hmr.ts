import { createElement } from "@my-react/react";
import { STATE_TYPE, include, merge } from "@my-react/react-shared";

import { deleteEffect } from "../dispatchEffect";
import { listenerMap } from "../renderDispatch";
import { classComponentUnmount } from "../runtimeComponent";
import { hookListUnmount } from "../runtimeHook";
import { getCurrentDispatchFromFiber, safeCallWithFiber, setRefreshTypeMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactComponentType } from "@my-react/react";

export const hmr = (fiber: MyReactFiberNode, nextType: MyReactComponentType, forceRefresh?: boolean) => {
  if (__DEV__) {
    if (include(fiber.state, STATE_TYPE.__unmount__)) return;

    const renderDispatch = getCurrentDispatchFromFiber(fiber);

    const element = createElement(nextType, fiber.pendingProps);

    fiber._installElement(element);

    setRefreshTypeMap(fiber);

    if (forceRefresh) {
      hookListUnmount(fiber, renderDispatch);

      classComponentUnmount(fiber, renderDispatch);

      fiber.instance = null;

      fiber.hookList = null;

      fiber.updateQueue = null;

      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugHookTypes = [];

      // TODO
      deleteEffect(fiber, renderDispatch);

      renderDispatch.commitUnsetRef(fiber);

      fiber.state = merge(STATE_TYPE.__create__, STATE_TYPE.__hmr__);
    } else {
      fiber.state = merge(STATE_TYPE.__triggerSync__, STATE_TYPE.__hmr__);
    }

    safeCallWithFiber({
      fiber,
      action: function safeCallFiberHMRListener() {
        listenerMap.get(renderDispatch)?.fiberHMR?.forEach((cb) => cb(fiber));
      },
    });

    return fiber;
  } else {
    throw new Error(`[@my-react/react] can not try to dev refresh this app in prod env!`);
  }
};
