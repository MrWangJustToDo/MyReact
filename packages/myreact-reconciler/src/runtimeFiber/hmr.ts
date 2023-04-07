import { createElement } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "./instance";
import type { MyReactElementType } from "@my-react/react";

export const hmr = (fiber: MyReactFiberNode, nextType: MyReactElementType, forceRefresh?: boolean) => {
  if (__DEV__) {
    const newElement = createElement(nextType, { ...fiber.pendingProps, ref: fiber.ref, key: typeof fiber.key === "string" ? fiber.key : undefined });

    fiber.element = newElement;

    fiber.elementType = nextType;

    if (forceRefresh) {
      const existingHookList = fiber.hookList;

      const existingInstance = fiber.instance;

      existingHookList.listToFoot((hook) => hook._unmount());

      existingInstance?._unmount();

      fiber.instance = null;

      fiber.hookList = new ListTree();

      fiber.updateQueue = new ListTree();

      fiber.state = STATE_TYPE.__initial__;
    } else {
      fiber.state |= STATE_TYPE.__triggerSync__;
    }

    return fiber;
  } else {
    throw new Error(`can not try to dev refresh this app in prod env!`);
  }
};
