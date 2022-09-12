import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { DomScope, startRender, unmountComponentAtNode } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type {
  MyReactElement,
  MyReactFiberNode,
  FiberDispatch,
  MyReactFiberNodeRoot,
  RenderScope,
} from "@my-react/react";

export type RenderContainer = Element & {
  __scope__: RenderScope;
  __fiber__: MyReactFiberNode;
  __dispatch__: FiberDispatch;
};

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

const { initialFiberNode } = __my_react_shared__;

export const render = (element: MyReactElement, container: RenderContainer) => {
  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNodeClass) {
    containerFiber.root.scope.isAppCrash = false;

    if (containerFiber.checkIsSameType(element)) {
      containerFiber.installElement(element);

      containerFiber.update();

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  const globalDispatch = new ClientDispatch();

  const globalScope = new DomScope();

  Array.from(container.children).forEach((n) => n.remove?.());

  const fiber = new MyReactFiberNodeClass(0, null, element) as MyReactFiberNodeRoot;

  fiber.node = container;

  fiber.scope = globalScope;

  fiber.dispatch = globalDispatch;

  globalScope.rootFiber = fiber;

  globalScope.rootContainer = container;

  container.setAttribute?.("render", "MyReact");

  container.__fiber__ = fiber;

  container.__scope__ = globalScope;

  container.__dispatch__ = globalDispatch;

  initialFiberNode(fiber);

  startRender(fiber);
};
