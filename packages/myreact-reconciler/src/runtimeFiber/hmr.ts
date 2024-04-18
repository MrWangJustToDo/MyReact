import { createElement } from "@my-react/react";
import { ListTree, STATE_TYPE, include, merge } from "@my-react/react-shared";

import { deleteEffect } from "../dispatchEffect";
import { classComponentUnmount } from "../runtimeComponent";
import { hookListUnmount } from "../runtimeHook";
import { fiberToDispatchMap, setRefreshTypeMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { MixinMyReactFunctionComponent, MixinMyReactClassComponent } from "@my-react/react";

export const hmr = (fiber: MyReactFiberNode, nextType: MixinMyReactFunctionComponent | MixinMyReactClassComponent, forceRefresh?: boolean) => {
  if (__DEV__) {
    if (include(fiber.state, STATE_TYPE.__unmount__)) return;

    const element = createElement(nextType as MixinMyReactFunctionComponent, fiber.pendingProps);

    fiber._installElement(element);

    setRefreshTypeMap(fiber);

    if (forceRefresh) {
      hookListUnmount(fiber);

      classComponentUnmount(fiber);

      fiber.instance = null;

      fiber.hookList = new ListTree();

      fiber.updateQueue = new ListTree();

      const renderDispatch = fiberToDispatchMap.get(fiber);

      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugHookTypes = [];

      // TODO
      deleteEffect(fiber, renderDispatch);

      fiber.state = merge(STATE_TYPE.__create__, STATE_TYPE.__hmr__);
    } else {
      fiber.state = merge(STATE_TYPE.__triggerSync__, STATE_TYPE.__hmr__);
    }

    return fiber;
  } else {
    throw new Error(`[@my-react/react] can not try to dev refresh this app in prod env!`);
  }
};
