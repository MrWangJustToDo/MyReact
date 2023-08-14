import { MyWeakMap, type MyReactFiberNode } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

/**
 * @internal
 */
export type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
};

const inputEventMap = new MyWeakMap<MyReactFiberNode, () => void>();

/**
 * @internal
 */
export const generateOnChangeFun = (fiber: MyReactFiberNode) => {
  const _onChange = () => {
    if (__DEV__) {
      log({
        fiber,
        level: "warn",
        message: `[@my-react/react-dom] current controlled element is a readonly element, please provider a 'onChange' props to make the value update`,
      });
    }

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

  const onChange = inputEventMap.get(fiber) || _onChange;

  inputEventMap.set(fiber, onChange);

  return onChange;
};

/**
 * @internal
 */
export const prepareControlInputProp = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  if (type === "radio" || type === "checkbox") {
    if ("checked" in props) {
      fiber.pendingProps = { ["onChange"]: generateOnChangeFun(fiber), ...(__DEV__ ? { controlled: "@my-react" } : undefined), ...props, ["_control"]: true };
    } else {
      fiber.pendingProps = { ...props };
    }
  } else {
    if ("value" in props) {
      fiber.pendingProps = { ["onChange"]: generateOnChangeFun(fiber), ...(__DEV__ ? { controlled: "@my-react" } : undefined), ...props, ["_control"]: true };
    } else {
      fiber.pendingProps = { ...props };
    }
  }
};

/**
 * @internal
 */
export const mountControlInputElement = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  if (type === "radio" || type === "checkbox") {
    if (!("checked" in props) && "defaultChecked" in props) {
      props["checked"] = props["defaultChecked"];
    }
  } else {
    if (!("value" in props) && "defaultValue" in props) {
      props["value"] = props["defaultValue"];
    }
  }

  delete props["defaultValue"];

  delete props["defaultChecked"];
};

/**
 * @internal
 */
export const updateControlInputElement = (fiber: MyReactFiberNode) => {
  const pendingProps = fiber.pendingProps;

  const memoizedProps = fiber.memoizedProps;

  const { type } = pendingProps;

  const key = type === "radio" || type === "checkbox" ? "checked" : "value";

  if (key in pendingProps) {
    if (__DEV__ && !memoizedProps["_control"]) {
      log({ fiber, level: "warn", message: `current component change from 'unControlled' to 'controlled', this may case some bug` });
    }
  } else {
    if (__DEV__ && memoizedProps["_control"]) {
      log({ fiber, level: "warn", message: `current component change from 'controlled' to 'unControlled', this may case some bug` });
    }
  }
};

/**
 * @internal
 */
export const unmountControlInputElement = (fiber: MyReactFiberNode) => {
  inputEventMap.delete(fiber);
};
