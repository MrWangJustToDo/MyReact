import { createElement } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import { deleteEffect } from "../dispatchEffect";
import { fiberToDispatchMap, setRefreshTypeMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { MixinMyReactFunctionComponent, MixinMyReactClassComponent } from "@my-react/react";

export const hmr = (fiber: MyReactFiberNode, nextType: MixinMyReactFunctionComponent | MixinMyReactClassComponent, forceRefresh?: boolean) => {
  if (__DEV__) {
    const element = createElement(nextType as MixinMyReactFunctionComponent, fiber.pendingProps);

    fiber._installElement(element);

    setRefreshTypeMap(fiber);

    if (fiber.state & STATE_TYPE.__unmount__) return;

    if (forceRefresh) {
      const existingHookList = fiber.hookList;

      const existingInstance = fiber.instance;

      existingHookList?.listToFoot((hook) => hook._unmount());

      existingInstance?._unmount();

      fiber.instance = null;

      fiber.hookList = new ListTree();

      fiber.updateQueue = new ListTree();

      fiber.state = STATE_TYPE.__initial__;

      const renderDispatch = fiberToDispatchMap.get(fiber);

      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugHookTypes = [];

      typedFiber._debugHookNodes = [];

      // TODO
      deleteEffect(fiber, renderDispatch);
    } else {
      fiber.state = STATE_TYPE.__triggerSync__ | STATE_TYPE.__hmr__;
    }

    return fiber;
  } else {
    throw new Error(`can not try to dev refresh this app in prod env!`);
  }
};
