import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";

import { startRender, unmountComponentAtNode } from "../../shared";
import { ClientDispatch } from "../dispatch";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const {
  globalDispatch,
  isAppCrash,
  rootContainer,
  rootFiber,
  MyReactFiberNode: MyReactFiberNodeClass,
} = __myreact_internal__;

const { createFiberNode } = __myreact_shared__;

export const render = (element: MyReactElement, container: Element & { __fiber__: MyReactFiberNode }) => {
  globalDispatch.current = new ClientDispatch();

  isAppCrash.current = false;

  const containerFiber = container.__fiber__;
  if (containerFiber instanceof MyReactFiberNodeClass) {
    if (containerFiber.checkIsSameType(element)) {
      containerFiber.installVDom(element);
      containerFiber.update();
      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  Array.from(container.children).forEach((n) => n.remove?.());

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.dom = container;

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute?.("render", "MyReact");

  container.__fiber__ = fiber;

  startRender(fiber);
};
