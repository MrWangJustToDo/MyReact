import { PATCH_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch, fiberToDispatchMap } from "../share";

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

  renderDispatch.resolveScopeMap(newFiberNode);

  renderDispatch.resolveStrictMap(newFiberNode);

  renderDispatch.resolveContextMap(newFiberNode);

  renderDispatch.resolveSuspenseMap(newFiberNode);

  renderDispatch.resolveErrorBoundariesMap(newFiberNode);

  renderDispatch.patchToFiberInitial?.(newFiberNode);

  if (!(newFiberNode.patch & PATCH_TYPE.__update__)) {
    newFiberNode.memoizedProps = newFiberNode.pendingProps;
  }

  return newFiberNode;
};
