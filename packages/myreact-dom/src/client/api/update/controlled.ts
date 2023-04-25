import type { MyReactFiberNode } from "@my-react/react-reconciler";

const emptyFunc = () => void 0;

export type ControlledElement = HTMLInputElement & {
  __isControlled__: boolean;
};

export const controlElementTag: Record<string, boolean> = {
  input: true,
};

export const prepareControlElement = (fiber: MyReactFiberNode) => {
  const dom = fiber.nativeNode;
  const props = fiber.pendingProps;
  if ("value" in props) {
    const typedDom = dom as ControlledElement;
    typedDom.__isControlled__ = true;
    typedDom.setAttribute("controlled", "@my-react");
    // typedDom.setAttribute("controlled_value", String(props["value"]));
  }
};

export const prepareControlProp = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  if ("value" in props) {
    fiber.pendingProps = { ["onChange"]: emptyFunc, ...props };
  }
};
