import { nextWorkCommon, type MyReactFiberNode } from "@my-react/react-reconciler";

import { resolveLazyElementLatest, resolveLazyElementLegacy } from "@my-react-dom-server/renderDispatch/lazy";

import type { NoopLegacyRenderDispatch, NoopLatestRenderDispatch } from "./noopDispatch";

export const nextWorkLazy = (_dispatch: NoopLegacyRenderDispatch | NoopLatestRenderDispatch, _fiber: MyReactFiberNode) => {
  if (_dispatch.enableAsyncHydrate) {
    const children = resolveLazyElementLatest(_dispatch, _fiber);

    nextWorkCommon(_dispatch, _fiber, children);
  } else {
    const children = resolveLazyElementLegacy(_dispatch, _fiber);

    nextWorkCommon(_dispatch, _fiber, children);
  }
};
