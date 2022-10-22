import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomPlatform, DomScope, startRender } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { RenderContainer } from "./render";
import type { MyReactElement } from "@my-react/react";

const { MyReactFiberNodeRoot, renderPlatform } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const hydrate = (element: MyReactElement, container: RenderContainer) => {
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  const platform = new DomPlatform("myreact-dom");

  renderPlatform.current = platform;

  globalScope.isHydrateRender = true;

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

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
