import { nextWorkComponent, nextWorkConsumer, NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { rerunHead } from "@my-react-dom-shared";

import { nextWorkCommon } from "./common";
import { nextWorkLazy } from "./lazy";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LatestServerStreamDispatch, LegacyServerStreamDispatch } from "./serverStreamDispatch";

export const serverDispatchFiber = (fiber: MyReactFiberNode, renderDispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch) => {
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(fiber);
  } else if (include(fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(fiber);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(fiber, renderDispatch);
  } else {
    rerunHead(fiber, renderDispatch);
    nextWorkCommon(fiber, renderDispatch);
  }
};
