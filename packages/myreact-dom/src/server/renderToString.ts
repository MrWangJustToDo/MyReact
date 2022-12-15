import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomPlatform, DomScope, startRender, startRenderAsync } from "../shared";

import { ServerDispatch } from "./dispatch";
import { PlainElement } from "./dom";

import type { MyReactElement } from "@my-react/react";

const { MyReactFiberNodeRoot } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

const renderToStringSync = (element: MyReactElement) => {
  const globalDispatch = new ServerDispatch();

  const globalScope = new DomScope();

  const globalPlatform = new DomPlatform("myreact-dom/server");

  globalScope.isServerRender = true;

  const container = new PlainElement("");

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  fiber.globalPlatform = globalPlatform;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  initialFiberNode(fiber);

  startRender(fiber, false);

  globalScope.isServerRender = false;

  return container.toString();
};

const renderToStringAsync = async (element: MyReactElement) => {
  const globalDispatch = new ServerDispatch();

  const globalScope = new DomScope();

  const globalPlatform = new DomPlatform("myreact-dom/server");

  globalScope.isServerRender = true;

  const container = new PlainElement("");

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  fiber.globalPlatform = globalPlatform;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  initialFiberNode(fiber);

  await startRenderAsync(fiber, false);

  globalScope.isServerRender = false;

  return container.toString();
};

export function renderToString(element: MyReactElement): string;
export function renderToString(element: MyReactElement, asyncRender: true): Promise<string>;
export function renderToString(element: MyReactElement, asyncRender?: boolean) {
  if (asyncRender) {
    return renderToStringAsync(element);
  } else {
    return renderToStringSync(element);
  }
}
