import { include } from "@my-react/react-shared";

import { nextWorkComponent, nextWorkConsumer, nextWorkLazy, nextWorkNormal, nextWorkSuspense } from "../runtimeGenerate";
import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultDispatchFiber = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(fiber);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(fiber);
  } else {
    nextWorkNormal(fiber);
  }
};
