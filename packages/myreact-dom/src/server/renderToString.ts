import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomScope, startRender } from "../shared";

import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";

import type { MyReactElement, MyReactFiberNodeRoot } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const renderToString = (element: MyReactElement) => {
  const globalDispatch = new ServerDispatch();

  const globalScope = new DomScope();

  globalScope.isServerRender = true;

  const container = new PlainElement("");

  const fiber = new MyReactFiberNode(0, null, element) as MyReactFiberNodeRoot;

  fiber.node = container;

  fiber.scope = globalScope;

  fiber.dispatch = globalDispatch;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  initialFiberNode(fiber);

  startRender(fiber, false);

  globalScope.isServerRender = false;

  return container.toString();
};
