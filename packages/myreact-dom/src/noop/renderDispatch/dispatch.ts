import { nextWorkCommon, nextWorkComponent, nextWorkConsumer, nextWorkNormal, NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { resolveLazyElementLatest, resolveLazyElementLegacy } from "@my-react-dom-server/renderDispatch/lazy";

import type { NoopLatestRenderDispatch, NoopLegacyRenderDispatch } from "./noopDispatch";
import type { MyReactFiberNode} from "@my-react/react-reconciler";

export const noopDispatchFiber = (_fiber: MyReactFiberNode, _dispatch: NoopLegacyRenderDispatch | NoopLatestRenderDispatch) => {
  if (include(_fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
      nextWorkComponent(_fiber);
    } else if (include(_fiber.type, NODE_TYPE.__consumer__)) {
      nextWorkConsumer(_fiber);
    } else if (include(_fiber.type, NODE_TYPE.__lazy__)) {
      if (_dispatch.enableAsyncHydrate) {
        const children = resolveLazyElementLatest(_fiber, _dispatch);

        nextWorkCommon(_fiber, children);
      } else {
        const children = resolveLazyElementLegacy(_fiber, _dispatch);

        nextWorkCommon(_fiber, children);
      }
    } else {
      nextWorkNormal(_fiber);
    }
}