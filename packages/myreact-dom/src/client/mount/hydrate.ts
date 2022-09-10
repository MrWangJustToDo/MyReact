import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { isHydrateRender, startRender } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { globalDispatch } = __my_react_internal__;

const { createFiberNode } = __my_react_shared__;

export const hydrate = (element: MyReactElement, container: Element & { __fiber__: MyReactFiberNode }) => {
  globalDispatch.current = new ClientDispatch();

  isHydrateRender.current = true;

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.node = container;

  globalDispatch.current.rootFiber = fiber;

  globalDispatch.current.rootContainer = container;

  container.setAttribute?.("hydrate", "MyReact");

  container.__fiber__ = fiber;

  startRender(fiber, true);

  isHydrateRender.current = false;
};
