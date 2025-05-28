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
export const resolveLazyElementLegacy = (_dispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
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

  processState(_dispatch, updateQueue);

  return null;
};

/**
 * @internal
 */
export const resolveLazyElementLatest = (_dispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
  const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

  if (typedElementType._loaded) return WrapperByLazyScope(createElement(typedElementType.render as MixinMyReactFunctionComponent, _fiber.pendingProps));

  _dispatch.pendingAsyncLoadList = _dispatch.pendingAsyncLoadList || new ListTree<MyReactFiberNode>();

  _dispatch.pendingAsyncLoadList.push(_fiber);

  return null;
};

export const nextWorkLazy = (renderDispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch, fiber: MyReactFiberNode) => {
  if (renderDispatch.enableAsyncHydrate) {
    const children = resolveLazyElementLatest(renderDispatch, fiber);

    nextWorkCommon(renderDispatch, fiber, children);
  } else {
    const children = resolveLazyElementLegacy(renderDispatch, fiber);

    nextWorkCommon(renderDispatch, fiber, children);
  }
};
