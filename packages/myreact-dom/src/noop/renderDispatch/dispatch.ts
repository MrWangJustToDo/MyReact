import { nextWorkComponent, nextWorkConsumer, nextWorkNormal, nextWorkProvider, nextWorkSuspense, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { nextWorkLazy } from "./lazy";

import type { NoopLatestRenderDispatch, NoopLegacyRenderDispatch } from "./noopDispatch";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const noopDispatchFiber = (_dispatch: NoopLegacyRenderDispatch | NoopLatestRenderDispatch, _fiber: MyReactFiberNode) => {
  if (include(_fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    nextWorkComponent(_dispatch, _fiber);
  } else if (include(_fiber.type, NODE_TYPE.__consumer__)) {
    nextWorkConsumer(_dispatch, _fiber);
  } else if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    nextWorkLazy(_dispatch, _fiber);
  } else if (include(_fiber.type, NODE_TYPE.__suspense__)) {
    nextWorkSuspense(_dispatch, _fiber);
  } else if (include(_fiber.type, NODE_TYPE.__provider__ | NODE_TYPE.__context__)) {
    nextWorkProvider(_dispatch, _fiber);
  } else {
    nextWorkNormal(_dispatch, _fiber);
  }
};
