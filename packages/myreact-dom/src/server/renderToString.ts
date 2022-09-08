import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { isServerRender, startRender } from "../shared";

import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";

import type { MyReactElement } from "@my-react/react";

const { globalDispatch } = __my_react_internal__;

const { createFiberNode } = __my_react_shared__;

export const renderToString = (element: MyReactElement) => {
  globalDispatch.current = new ServerDispatch();

  isServerRender.current = true;

  const container = new PlainElement("");

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.node = container;

  globalDispatch.current.rootFiber = fiber;

  globalDispatch.current.rootContainer = container;

  startRender(fiber, false);

  isServerRender.current = false;

  return container.toString();
};
