import { generateInputOnChangeFun, hasControlledInputProps, isControlledInputElement, isReadonlyInputElement, updateControlInputElement } from "./input";
import {
  generateTextAreaOnChangeFun,
  hasControlledTextAreaProps,
  isControlledTextAreaElement,
  isReadonlyTextAreaElement,
  updateControlTextAreaElement,
} from "./textarea";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const controlElementTag: Record<string, boolean> = {
  input: true,
  textarea: true,
};

/**
 * @internal
 */
export const updateControlElement = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;

  switch (elementType) {
    case "input":
      return updateControlInputElement(fiber);
    case "textarea":
      return updateControlTextAreaElement(fiber);
  }
};

/**
 * @internal
 */
export const generateOnChangeFun = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;

  switch (elementType) {
    case "input":
      return generateInputOnChangeFun(fiber);
    case "textarea":
      return generateTextAreaOnChangeFun(fiber);
  }
};

/**
 * @internal
 */
export const hasControlledProps = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;

  switch (elementType) {
    case "input":
      return hasControlledInputProps(fiber);
    case "textarea":
      return hasControlledTextAreaProps(fiber);
  }
};

/**
 * @internal
 */
export const isControlledElement = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;
  switch (elementType) {
    case "input":
      return isControlledInputElement(fiber);
    case "textarea":
      return isControlledTextAreaElement(fiber);
  }
};

/**
 * @internal
 */
export const isReadonlyElement = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;
  switch (elementType) {
    case "input":
      return isReadonlyInputElement(fiber);
    case "textarea":
      return isReadonlyTextAreaElement(fiber);
  }
};
