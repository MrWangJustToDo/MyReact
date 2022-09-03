import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";

import { isServerRender, startRender } from "../shared";

import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";

import type { MyReactElement } from "@my-react/react";

const { globalDispatch, rootFiber, rootContainer } = __myreact_internal__;

const { createFiberNode } = __myreact_shared__;

// TODO should create global scope for every render
export const renderToString = (element: MyReactElement) => {
  globalDispatch.current = new ServerDispatch();

  isServerRender.current = true;

  const container = new PlainElement("");

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.dom = container as unknown as Element;

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  startRender(fiber, false);

  isServerRender.current = false;

  return container.toString();
};
