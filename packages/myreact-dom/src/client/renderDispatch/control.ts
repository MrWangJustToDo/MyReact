import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";

import {
  controlElementTag,
  prepareControlProp,
  mountControlElement as _mountControlElement,
  updateControlElement as _updateControlElement,
  unmountControlElement as _unmountControlElement,
} from "@my-react-dom-client";
import { enableControlComponent } from "@my-react-dom-shared";

export const mountControlElement = (fiber: MyReactFiberNode) => {
  if (enableControlComponent.current && fiber.type & NODE_TYPE.__plain__) {
    const isControlledElement = controlElementTag[fiber.elementType as string];
    if (isControlledElement) {
      prepareControlProp(fiber);
      _mountControlElement(fiber);
    }
  }
};

export const updateControlElement = (fiber: MyReactFiberNode) => {
  if (enableControlComponent.current && fiber.type & NODE_TYPE.__plain__) {
    const isControlledElement = controlElementTag[fiber.elementType as string];
    if (isControlledElement) {
      prepareControlProp(fiber);
      _updateControlElement(fiber);
    }
  }
};

export const unmountControlElement = (fiber: MyReactFiberNode) => {
  if (enableControlComponent.current && fiber.type & NODE_TYPE.__plain__) {
    const isControlledElement = controlElementTag[fiber.elementType as string];
    if (isControlledElement) {
      _unmountControlElement(fiber);
    }
  }
};
