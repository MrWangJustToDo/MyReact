import {
  NODE_TYPE,
  nextWorkRoot,
  nextWorkComponent,
  nextWorkLazy,
  nextWorkSuspense,
  nextWorkConsumer,
  nextWorkProvider,
  nextWorkNormal,
} from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkPortal } from "./portal";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const ReconcilerDispatchFiber = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    // TODO
    nextWorkRoot(fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(fiber);
  } else if (include(fiber.type, NODE_TYPE.__portal__)) {
    nextWorkPortal(fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(fiber);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(fiber);
  } else if (include(fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(fiber);
  } else {
    nextWorkNormal(fiber);
  }
};
