import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomScope, startRender } from "../shared";

import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";

import type { MyReactElement } from "@my-react/react";

const { MyReactFiberNodeRoot } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const renderToString = (element: MyReactElement) => {
  const globalDispatch = new ServerDispatch();

  const globalScope = new DomScope();

  globalScope.isServerRender = true;

  const container = new PlainElement("");

  const fiber = new MyReactFiberNodeRoot(0, null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  initialFiberNode(fiber);

  startRender(fiber, false);

  globalScope.isServerRender = false;

  return container.toString();
};
