import { nextWorkComponent, nextWorkConsumer, nextWorkNormal, nextWorkProvider, nextWorkSuspense, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkLazy } from "./lazy";

import type { NoopLatestRenderDispatch, NoopLegacyRenderDispatch } from "./noopDispatch";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const noopDispatchFiber = (_fiber: MyReactFiberNode, _dispatch: NoopLegacyRenderDispatch | NoopLatestRenderDispatch) => {
  if (include(_fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(_fiber);
  } else if (include(_fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(_fiber);
  } else if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(_fiber, _dispatch);
  } else if (include(_fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(_fiber);
  } else if (include(_fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(_fiber);
  } else {
    nextWorkNormal(_fiber);
  }
};
