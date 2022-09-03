import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";

import { isHydrateRender, startRender } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { globalDispatch, rootContainer, rootFiber } = __myreact_internal__;

const { createFiberNode } = __myreact_shared__;

export const hydrate = (element: MyReactElement, container: Element & { __fiber__: MyReactFiberNode }) => {
  globalDispatch.current = new ClientDispatch();

  isHydrateRender.current = true;

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.dom = container;

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute?.("hydrate", "MyReact");

  container.__fiber__ = fiber;

  startRender(fiber, true);

  isHydrateRender.current = false;
};
