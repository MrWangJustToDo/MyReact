import { include } from "@my-react/react-shared";

import {
  nextWorkActivity,
  nextWorkComponent,
  nextWorkConsumer,
  nextWorkLazy,
  nextWorkNormal,
  nextWorkProvider,
  nextWorkRoot,
  nextWorkSuspense,
} from "../runtimeGenerate";
import { NODE_TYPE } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const defaultDispatchFiber = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    // TODO
    nextWorkRoot(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(renderDispatch, fiber);
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
