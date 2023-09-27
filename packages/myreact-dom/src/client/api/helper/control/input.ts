import { type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

type ControlledElement = HTMLInputElement;

/**
 * @internal
 */
export const isReadonlyInputElement = (fiber: MyReactFiberNode) => hasControlledInputProps(fiber) && !fiber.pendingProps.onChange;

/**
 * @internal
 */
export const isControlledInputElement = (fiber: MyReactFiberNode) => hasControlledInputProps(fiber) && typeof fiber.pendingProps.onChange === "function";

const generateEmptyChangeFun = (fiber: MyReactFiberNode) => {
  return () => {
    if (__DEV__) {
      log(fiber, "warn", `current controlled element is a readonly element, please provider a 'onChange' props to make the value update`);
    }
  };
};

/**
 * @internal
 */
export const generateInputOnChangeFun = (fiber: MyReactFiberNode) => {
  const onChange = (...args) => {
    let originalOnChange = fiber.pendingProps.onChange;

    originalOnChange = typeof originalOnChange === "function" ? originalOnChange : generateEmptyChangeFun(fiber);

    originalOnChange?.call?.(null, ...args);

    requestAnimationFrame(() => {
      const dom = fiber.nativeNode;

      const props = fiber.pendingProps;

      const typedDom = dom as ControlledElement;

      const { type } = props;

      const key = type === "radio" || type === "checkbox" ? "checked" : "value";

      if (key in props) {
        (typedDom as any)[key] = props[key];
      }
    });
  };

  return onChange;
};

/**
 * @internal
 */
export const hasControlledInputProps = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  const key = type === "radio" || type === "checkbox" ? "checked" : "value";

  return key in props;
};

/**
 * @internal
 */
export const updateControlInputElement = (fiber: MyReactFiberNode) => {
  const pendingProps = fiber.pendingProps;

  const memoizedProps = fiber.memoizedProps;

  const { type } = pendingProps;

  const key = type === "radio" || type === "checkbox" ? "checked" : "value";

  if (__DEV__) {
    if (key in pendingProps) {
      if (!(key in memoizedProps)) {
        log(fiber, "warn", `current component change from 'unControlled' to 'controlled', this may case some bug`);
      }
    } else {
      if (key in memoizedProps) {
        log(fiber, "warn", `current component change from 'controlled' to 'unControlled', this may case some bug`);
      }
    }
  }
};
