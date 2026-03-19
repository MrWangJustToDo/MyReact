import {
  NODE_TYPE,
  nextWorkRoot,
  nextWorkComponent,
  nextWorkLazy,
  nextWorkSuspense,
  nextWorkConsumer,
  nextWorkProvider,
  nextWorkNormal,
  nextWorkActivity,
} from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkPortal } from "./portal";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const ReconcilerDispatchFiber = (renderDispatch: ReconcilerDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    // TODO
    nextWorkRoot(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__portal__)) {
    nextWorkPortal(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__activity__)) {
    nextWorkActivity(renderDispatch, fiber);
  } else {
    nextWorkNormal(renderDispatch, fiber);
  }
};
