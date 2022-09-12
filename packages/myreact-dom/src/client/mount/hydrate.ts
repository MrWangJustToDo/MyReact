import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomScope, startRender } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { RenderContainer } from "./render";
import type { MyReactElement, MyReactFiberNodeRoot } from "@my-react/react";

const { MyReactFiberNode } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const hydrate = (element: MyReactElement, container: RenderContainer) => {
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  globalScope.isHydrateRender = true;

  const fiber = new MyReactFiberNode(0, null, element) as MyReactFiberNodeRoot;

  fiber.node = container;

  fiber.scope = globalScope;

  fiber.dispatch = globalDispatch;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  container.setAttribute?.("hydrate", "MyReact");

  container.__fiber__ = fiber;

  container.__scope__ = globalScope;

  container.__dispatch__ = globalDispatch;

  initialFiberNode(fiber);

  startRender(fiber, true);

  globalScope.isHydrateRender = false;
};
