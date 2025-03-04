import { nextWorkCommon, type MyReactFiberNode } from "@my-react/react-reconciler";

import { resolveLazyElementLatest, resolveLazyElementLegacy } from "@my-react-dom-server/renderDispatch/lazy";

import type { NoopLegacyRenderDispatch, NoopLatestRenderDispatch } from "./noopDispatch";

export const nextWorkLazy = (_fiber: MyReactFiberNode, _dispatch: NoopLegacyRenderDispatch | NoopLatestRenderDispatch) => {
  if (_dispatch.enableAsyncHydrate) {
    const children = resolveLazyElementLatest(_fiber, _dispatch);

    nextWorkCommon(_fiber, children);
  } else {
    const children = resolveLazyElementLegacy(_fiber, _dispatch);

    nextWorkCommon(_fiber, children);
  }
};
