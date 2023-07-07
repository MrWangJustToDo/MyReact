import { createElement } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import { getTypeFromElement, setRefreshTypeMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MixinMyReactFunctionComponent, MixinMyReactClassComponent } from "@my-react/react";

export const hmr = (fiber: MyReactFiberNode, nextType: MixinMyReactFunctionComponent | MixinMyReactClassComponent, forceRefresh?: boolean) => {
  if (__DEV__) {
    const element = createElement(nextType as MixinMyReactFunctionComponent, null);

    const { elementType } = getTypeFromElement(element);

    fiber.elementType = elementType;

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
    } else {
      if (fiber.state === STATE_TYPE.__stable__) {
        fiber.state = STATE_TYPE.__triggerSync__;
      } else if (fiber.state & STATE_TYPE.__triggerSync__) {
        fiber.state = STATE_TYPE.__triggerSync__;
      } else {
        fiber.state |= STATE_TYPE.__triggerSync__;
      }
    }

    return fiber;
  } else {
    throw new Error(`can not try to dev refresh this app in prod env!`);
  }
};
