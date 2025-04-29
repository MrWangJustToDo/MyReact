import { nextWorkComponent, nextWorkConsumer, nextWorkProvider, nextWorkRoot, nextWorkSuspense, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkCommon } from "./common";
import { nextWorkLazy } from "./lazy";

import type { ClientDomDispatch } from "./instance";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const clientDispatchFiber = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    nextWorkRoot(fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(fiber, renderDispatch);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(fiber);
  } else if (include(fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(fiber);
  } else {
    // rerunHead(fiber, renderDispatch);
    nextWorkCommon(fiber, renderDispatch);
  }
};
