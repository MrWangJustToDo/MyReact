import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import type { DomElement, DomNode } from "./dom";
import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;
const { getFiberTree } = __my_react_shared__;

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const debugDOM = fiber.node as DomElement | DomNode;
    debugDOM["__fiber__"] = fiber;
    debugDOM["__element__"] = fiber.element;
    debugDOM["__children__"] = fiber.children;
  }
};

const originalConsoleWarn = console.warn;

const originalConsoleError = console.error;

export const setScopeLog = () => {
  console.warn = (...args: any) => {
    const fiberTree = getFiberTree(currentRunningFiber.current);
    originalConsoleWarn(...args, fiberTree);
  };
  console.error = (...args: any) => {
    const fiberTree = getFiberTree(currentRunningFiber.current);
    originalConsoleError(...args, fiberTree);
  };
};

export const resetScopeLog = () => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
};
