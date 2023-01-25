import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { checkIsSameType } from "@my-react/react-reconciler";

import { DomPlatform, DomScope, startRender, unmountComponentAtNode } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { MyReactElement, MyReactFiberNode, FiberDispatch, RenderScope } from "@my-react/react";

export type RenderContainer = Element & {
  __scope__: RenderScope;
  __fiber__: MyReactFiberNode;
  __dispatch__: FiberDispatch;
};

const { MyReactFiberNode: MyReactFiberNodeClass, MyReactFiberNodeRoot } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const render = (element: MyReactElement, container: RenderContainer) => {
  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNodeClass) {
    containerFiber.root.globalScope.isAppCrash = false;

    if (checkIsSameType(containerFiber, element)) {
      containerFiber.installElement(element);

      containerFiber.update();

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  const globalPlatform = new DomPlatform("myreact-dom");

  Array.from(container.children).forEach((n) => n.remove?.());

  const fiber = new MyReactFiberNodeRoot(null, element);

  fiber.node = container;

  fiber.globalScope = globalScope;

  fiber.globalDispatch = globalDispatch;

  fiber.globalPlatform = globalPlatform;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  container.setAttribute?.("render", "MyReact");

  container.setAttribute?.("version", __VERSION__);

  container.__fiber__ = fiber;

  container.__scope__ = globalScope;

  container.__dispatch__ = globalDispatch;

  initialFiberNode(fiber);

  startRender(fiber);
};
