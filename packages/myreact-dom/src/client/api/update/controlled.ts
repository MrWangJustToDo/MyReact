import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { currentRenderPlatform } = __my_react_internal__;

const emptyFunc = () => void 0;

export type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
};

export const controlElementTag: Record<string, boolean> = {
  input: true,
};

export const mountControlElement = (fiber: MyReactFiberNode) => {
  const dom = fiber.nativeNode;
  const props = fiber.pendingProps;
  const typedDom = dom as ControlledElement;
  if ("value" in props) {
    typedDom.__isControlled__ = true;
    typedDom.setAttribute("controlled", "@my-react");
  }
};

export const updateControlElement = (fiber: MyReactFiberNode) => {
  const dom = fiber.nativeNode;
  const props = fiber.pendingProps;
  const typedDom = dom as ControlledElement;
  const renderPlatform = currentRenderPlatform.current;
  if ("value" in props) {
    if (__DEV__ && !typedDom.__isControlled__) {
      renderPlatform.log({ fiber, level: "warn", message: `current component change from 'unControlled' to 'controlled', this may case some bug` });
    }
    typedDom.__isControlled__ = true;
    typedDom.setAttribute("controlled", "@my-react");
  } else {
    if (__DEV__ && typedDom.__isControlled__) {
      renderPlatform.log({ fiber, level: "warn", message: `current component change from 'controlled' to 'unControlled', this may case some bug` });
    }
    typedDom.__isControlled__ = false;
    typedDom.removeAttribute("controlled");
  }
};

export const prepareControlProp = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  if ("value" in props) {
    fiber.pendingProps = { ["onChange"]: emptyFunc, ...props };
  }
};
