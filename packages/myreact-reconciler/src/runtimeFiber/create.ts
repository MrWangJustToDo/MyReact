import { PATCH_TYPE, exclude } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";
import { currentRenderDispatch, fiberToDispatchMap, safeCallWithFiber } from "../share";

import { MyReactFiberNode } from "./instance";

import type { MyReactElementNode } from "@my-react/react";

export const createFiberNode = (
  {
    parent,
    type = "append",
  }: {
    parent: MyReactFiberNode | null;
    type?: "append" | "position";
  },
  element: MyReactElementNode
) => {
  const renderDispatch = currentRenderDispatch.current;

  const newFiberNode = new MyReactFiberNode(element);

  fiberToDispatchMap.set(newFiberNode, renderDispatch);

  newFiberNode.parent = parent;

  parent.child = parent.child || newFiberNode;

  renderDispatch.pendingCreate(newFiberNode);

  renderDispatch.pendingUpdate(newFiberNode);

  if (type === "position") {
    renderDispatch.pendingPosition(newFiberNode);
  } else {
    renderDispatch.pendingAppend(newFiberNode);
  }

  renderDispatch.pendingRef(newFiberNode);

  safeCallWithFiber({ fiber: newFiberNode, action: () => renderDispatch.patchToFiberInitial?.(newFiberNode) });

  safeCallWithFiber({ fiber: newFiberNode, action: () => listenerMap.get(renderDispatch)?.fiberInitial?.forEach((listener) => listener(newFiberNode)) });

  if (exclude(newFiberNode.patch, PATCH_TYPE.__update__)) {
    newFiberNode.memoizedProps = newFiberNode.pendingProps;
  }

  if (__DEV__) {
    renderDispatch.resolveScopeMap(newFiberNode);

    renderDispatch.resolveStrictMap(newFiberNode);

    renderDispatch.resolveContextMap(newFiberNode);

    renderDispatch.resolveSuspenseMap(newFiberNode);

    renderDispatch.resolveErrorBoundariesMap(newFiberNode);
  }

  return newFiberNode;
};
