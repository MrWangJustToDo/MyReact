import { type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

type ControlledElement = HTMLTextAreaElement;

/**
 * @internal
 */
export const isReadonlyTextAreaElement = (fiber: MyReactFiberNode) =>
  hasControlledTextAreaProps(fiber) && !fiber.pendingProps.onChange && !fiber.pendingProps.onInput;

/**
 * @internal
 */
export const isControlledTextAreaElement = (fiber: MyReactFiberNode) =>
  hasControlledTextAreaProps(fiber) && (typeof fiber.pendingProps.onChange === "function" || typeof fiber.pendingProps.onInput === "function");

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
export const generateTextAreaOnChangeFun = (fiber: MyReactFiberNode) => {
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

      const key = "value";

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
export const hasControlledTextAreaProps = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const key = "value";

  return props[key] !== undefined;
};

/**
 * @internal
 */
export const updateControlTextAreaElement = (fiber: MyReactFiberNode) => {
  const pendingProps = fiber.pendingProps;

  const memoizedProps = fiber.memoizedProps;

  const key = "value";

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
