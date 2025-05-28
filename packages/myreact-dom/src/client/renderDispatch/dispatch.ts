import { nextWorkComponent, nextWorkConsumer, nextWorkLazy, nextWorkNormal, nextWorkProvider, nextWorkRoot, nextWorkSuspense, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkPortal } from "@my-react-dom-client/tools";

import type { ClientDomDispatch } from "./instance";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const clientDispatchFiber = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    nextWorkRoot(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__portal__)) {
    nextWorkPortal(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(renderDispatch, fiber);
  } else {
    nextWorkNormal(renderDispatch, fiber);
  }
};
