import { addEventListener, hasControlledProps, removeEventListener, updateControlElement } from "../helper";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement } from "@my-react-dom-shared";

export const mountControl = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode) => {
  if (hasControlledProps(fiber)) {
    addEventListener(fiber, renderDispatch.runtimeDom.eventMap, fiber.nativeNode as DomElement, "onChange");
  }
};

export const updateControl = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode) => {
  if (__DEV__) updateControlElement(fiber);
  if (!fiber.pendingProps["onChange"] && !fiber.memoizedProps["onChange"]) {
    if (hasControlledProps(fiber)) {
      addEventListener(fiber, renderDispatch.runtimeDom.eventMap, fiber.nativeNode as DomElement, "onChange");
    } else {
      removeEventListener(fiber, renderDispatch.runtimeDom.eventMap, fiber.nativeNode as DomElement, "onChange");
    }
  }
};
