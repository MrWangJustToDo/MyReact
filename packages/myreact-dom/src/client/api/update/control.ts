import { addEventListener, hasControlledProps, removeEventListener, updateControlElement } from "../helper";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement } from "@my-react-dom-shared";

export const mountControl = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (hasControlledProps(fiber)) {
    addEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
  }
};

export const updateControl = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (__DEV__) updateControlElement(fiber);
  if (!fiber.pendingProps["onChange"] && !fiber.memoizedProps["onChange"]) {
    if (hasControlledProps(fiber)) {
      addEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
    } else {
      removeEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
    }
  }
};
