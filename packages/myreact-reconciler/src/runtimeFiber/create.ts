import { PATCH_TYPE, exclude } from "@my-react/react-shared";

import { listenerMap } from "../renderDispatch";
import { fiberToDispatchMap, safeCallWithCurrentFiber } from "../share";

import { MyReactFiberNode } from "./instance";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactElementNode } from "@my-react/react";

export const createFiberNode = (
  renderDispatch: CustomRenderDispatch,
  {
    parent,
    type = "append",
  }: {
    parent: MyReactFiberNode | null;
    type?: "append" | "position";
  },
  element: MyReactElementNode
) => {
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

  safeCallWithCurrentFiber({
    fiber: newFiberNode,
    action: function safeCallPatchToFiberInitial() {
      renderDispatch.patchToFiberInitial?.(newFiberNode);
    },
  });

  safeCallWithCurrentFiber({
    fiber: newFiberNode,
    action: function safeCallFiberInitialListener() {
      listenerMap.get(renderDispatch)?.fiberInitial?.forEach((listener) => listener(newFiberNode));
    },
  });

  if (exclude(newFiberNode.patch, PATCH_TYPE.__update__)) {
    newFiberNode.memoizedProps = newFiberNode.pendingProps;
  }

  return newFiberNode;
};
