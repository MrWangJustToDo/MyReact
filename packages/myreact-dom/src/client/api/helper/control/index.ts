import { generateInputOnChangeFun, hasControlledInputProps, isControlledInputElement, isReadonlyInputElement, updateControlInputElement } from "./input";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const controlElementTag: Record<string, boolean> = {
  input: true,
};

/**
 * @internal
 */
export const updateControlElement = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;

  switch (elementType) {
    case "input":
      updateControlInputElement(fiber);
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
  }
}

/**
 * @internal
 */
export const isControlledElement = (fiber: MyReactFiberNode) => {
  const elementType = fiber.elementType;
  switch (elementType) {
    case "input":
      return isControlledInputElement(fiber);
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
  }
};
