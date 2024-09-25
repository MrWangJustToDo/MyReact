import { type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

type ControlledElement = HTMLInputElement;

/**
 * @internal
 */
export const isReadonlyInputElement = (fiber: MyReactFiberNode) =>
  hasControlledInputProps(fiber) && !fiber.pendingProps.onChange && !fiber.pendingProps.onInput;

/**
 * @internal
 */
export const isControlledInputElement = (fiber: MyReactFiberNode) =>
  hasControlledInputProps(fiber) && (typeof fiber.pendingProps.onChange === "function" || typeof fiber.pendingProps.onInput === "function");

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
  const onChange = function onChange(...args) {
    const originalOnInput = fiber.pendingProps.onInput;

    const originalOnChange = fiber.pendingProps.onChange;

    const targetOnChange =
      typeof originalOnInput !== "function" && typeof originalOnChange !== "function"
        ? generateEmptyChangeFun(fiber)
        : function targetOnChange(...args) {
            originalOnInput?.call?.(null, ...args);

            originalOnChange?.call?.(null, ...args);
          };

    targetOnChange?.call?.(null, ...args);

    requestAnimationFrame(function afterEventDispatch() {
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

  return props[key] !== undefined;
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
    if (pendingProps[key] !== undefined) {
      if (!(key in memoizedProps) || memoizedProps[key] === undefined) {
        log(fiber, "warn", `current component change from 'unControlled' to 'controlled', this may case some bug`);
      }
    } else {
      if (memoizedProps[key] !== undefined) {
        log(fiber, "warn", `current component change from 'controlled' to 'unControlled', this may case some bug`);
      }
    }
  }
};
