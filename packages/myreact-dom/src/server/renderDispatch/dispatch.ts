import {
  nextWorkComponent,
  nextWorkConsumer,
  nextWorkProvider,
  nextWorkRoot,
  nextWorkSuspense,
  NODE_TYPE,
  type MyReactFiberNode,
} from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkCommon } from "./common";
import { nextWorkLazy } from "./lazy";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LatestServerStreamDispatch, LegacyServerStreamDispatch } from "./serverStreamDispatch";

export const serverDispatchFiber = (renderDispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__root__)) {
    nextWorkRoot(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(renderDispatch, fiber);
  } else if (include(fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(renderDispatch, fiber);
  } else {
    nextWorkCommon(renderDispatch, fiber);
  }
};
