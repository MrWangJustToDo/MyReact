import { createElement } from "@my-react/react";
import { nextWorkCommon, WrapperByScope } from "@my-react/react-reconciler";
import { ListTree } from "@my-react/react-shared";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LegacyServerStreamDispatch, LatestServerStreamDispatch } from "./serverStreamDispatch";
import type { lazy, MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode, CustomRenderDispatch } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const resolveLazyElementLegacy = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  return WrapperByScope(_dispatch.resolveSuspense(_fiber));
};

/**
 * @internal
 */
export const resolveLazyElementLatest = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));

  _dispatch.pendingAsyncLoadFiberList = _dispatch.pendingAsyncLoadFiberList || new ListTree<MyReactFiberNode>();

  _dispatch.pendingAsyncLoadFiberList.push(_fiber);

  return null;
};

export const nextWorkLazy = (fiber: MyReactFiberNode, renderDispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch) => {
  if (renderDispatch.enableASyncHydrate) {
    const children = resolveLazyElementLatest(fiber, renderDispatch);

    nextWorkCommon(fiber, children);
  } else {
    const children = resolveLazyElementLegacy(fiber, renderDispatch);

    nextWorkCommon(fiber, children);
  }
}
