import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomPlatform, DomScope, startRender, startRenderAsync } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { RenderContainer } from "./render";
import type { MyReactElement } from "@my-react/react";

const { MyReactFiberNodeRoot } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const hydrate = (element: MyReactElement, container: RenderContainer) => {
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  const globalPlatform = new DomPlatform("myreact-dom");

  globalScope.isHydrateRender = true;

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  fiber.globalPlatform = globalPlatform;

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

export const hydrateAsync = async (element: MyReactElement, container: RenderContainer) => {
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  const globalPlatform = new DomPlatform("myreact-dom");

  globalScope.isHydrateRender = true;

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  fiber.globalPlatform = globalPlatform;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  container.setAttribute?.("hydrate", "MyReact");

  container.__fiber__ = fiber;

  container.__scope__ = globalScope;

  container.__dispatch__ = globalDispatch;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, true);

  globalScope.isHydrateRender = false;
};
