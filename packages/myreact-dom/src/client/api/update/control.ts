import { addEventListener, hasControlledProps, removeEventListener, updateControlElement } from "../helper";

import type { MyReactFiberNode, RenderDispatch } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const mountControl = (fiber: MyReactFiberNode, renderDispatch: RenderDispatch) => {
  if (hasControlledProps(fiber)) {
    addEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
  }
};

export const updateControl = (fiber: MyReactFiberNode, renderDispatch: RenderDispatch) => {
  if (__DEV__) updateControlElement(fiber);
  if (!fiber.pendingProps["onChange"] && !fiber.memoizedProps["onChange"]) {
    if (hasControlledProps(fiber)) {
      addEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
    } else {
      removeEventListener(fiber, renderDispatch.runtimeMap.eventMap, fiber.nativeNode as DomElement, "onChange");
    }
  }
};
