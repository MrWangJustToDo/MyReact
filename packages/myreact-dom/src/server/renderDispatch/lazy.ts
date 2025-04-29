import { createElement } from "@my-react/react";
import { getInstanceFieldByInstance, nextWorkCommon, processState, WrapperByLazyScope } from "@my-react/react-reconciler";
import { ListTree, merge, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LegacyServerStreamDispatch, LatestServerStreamDispatch } from "./serverStreamDispatch";
import type { lazy, LazyUpdateQueue, MixinMyReactFunctionComponent } from "@my-react/react";
import type { MyReactFiberNode, CustomRenderDispatch, VisibleInstanceField } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const resolveLazyElementLegacy = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const visibleFiber = _dispatch.resolveSuspenseFiber(_fiber) || _dispatch.rootFiber;

  const updateQueue: LazyUpdateQueue = {
    type: UpdateQueueType.lazy,
    trigger: visibleFiber,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    payLoad: _fiber.elementType,
    isSync: true,
    isForce: true,
    isRetrigger: true,
    isImmediate: true,
  };

  const visibleField = getInstanceFieldByInstance(visibleFiber.instance) as VisibleInstanceField;

  visibleField.isHidden = true;

  visibleFiber.state = merge(visibleFiber.state, STATE_TYPE.__create__);

  processState(updateQueue);

  return null;
};

/**
 * @internal
 */
export const resolveLazyElementLatest = (_fiber: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByLazyScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));

  _dispatch.pendingAsyncLoadFiberList = _dispatch.pendingAsyncLoadFiberList || new ListTree<MyReactFiberNode>();

  _dispatch.pendingAsyncLoadFiberList.push(_fiber);

  return null;
};

export const nextWorkLazy = (fiber: MyReactFiberNode, renderDispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch) => {
  if (renderDispatch.enableAsyncHydrate) {
    const children = resolveLazyElementLatest(fiber, renderDispatch);

    nextWorkCommon(fiber, children);
  } else {
    const children = resolveLazyElementLegacy(fiber, renderDispatch);

    nextWorkCommon(fiber, children);
  }
};
