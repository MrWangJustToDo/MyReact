import { log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
};

/**
 * @internal
 */
export const generateOnChangeFun = (fiber: MyReactFiberNode) => () => {
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

/**
 * @internal
 */
export const prepareControlInputProp = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  const { type } = props;

  if (type === "radio" || type === "checkbox") {
    if ("checked" in props) {
      fiber.pendingProps = { ["onChange"]: generateOnChangeFun(fiber), ...props };
    } else {
      fiber.pendingProps = { ...props };
    }
  } else {
    if ("value" in props) {
      fiber.pendingProps = { ["onChange"]: generateOnChangeFun(fiber), ...props };
    } else {
      fiber.pendingProps = { ...props };
    }
  }
};

/**
 * @internal
 */
export const mountControlInputElement = (fiber: MyReactFiberNode) => {
  const dom = fiber.nativeNode;

  const props = fiber.pendingProps;

  const typedDom = dom as ControlledElement;

  const { type } = props;

  if (type === "radio" || type === "checkbox") {
    if ("checked" in props) {
      typedDom.__isControlled__ = true;
      typedDom.setAttribute("controlled", "@my-react");
    } else if ("defaultChecked" in props) {
      props["checked"] = props["defaultChecked"];
    }
  } else {
    if ("value" in props) {
      typedDom.__isControlled__ = true;
      typedDom.setAttribute("controlled", "@my-react");
    } else if ("defaultValue" in props) {
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
  const dom = fiber.nativeNode;

  const props = fiber.pendingProps;

  const { type } = props;

  const typedDom = dom as ControlledElement;

  const key = type === "radio" || type === "checkbox" ? "checked" : "value";

  if (key in props) {
    if (__DEV__ && !typedDom.__isControlled__) {
      log({ fiber, level: "warn", message: `current component change from 'unControlled' to 'controlled', this may case some bug` });
      typedDom.setAttribute("controlled", "@my-react");
    }
    typedDom.__isControlled__ = true;
  } else {
    if (__DEV__ && typedDom.__isControlled__) {
      log({ fiber, level: "warn", message: `current component change from 'controlled' to 'unControlled', this may case some bug` });
      typedDom.removeAttribute("controlled");
    }
    typedDom.__isControlled__ = false;
  }
};
