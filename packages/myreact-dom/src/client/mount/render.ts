import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { startRender, unmountComponentAtNode } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { globalDispatch, MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

const { createFiberNode } = __my_react_shared__;

export const render = (element: MyReactElement, container: Element & { __fiber__: MyReactFiberNode }) => {
  globalDispatch.current.isAppCrash = false;

  const containerFiber = container.__fiber__;

  if (containerFiber instanceof MyReactFiberNodeClass) {
    if (containerFiber.checkIsSameType(element)) {
      containerFiber.installElement(element);

      containerFiber.update();

      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  globalDispatch.current = new ClientDispatch();

  Array.from(container.children).forEach((n) => n.remove?.());

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.node = container;

  globalDispatch.current.rootFiber = fiber;

  globalDispatch.current.rootContainer = container;

  container.setAttribute?.("render", "MyReact");

  container.__fiber__ = fiber;

  startRender(fiber);
};
