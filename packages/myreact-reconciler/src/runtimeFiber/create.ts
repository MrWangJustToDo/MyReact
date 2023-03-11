import { __my_react_internal__ } from "@my-react/react";
import { PATCH_TYPE } from "@my-react/react-shared";

import { checkFiberElement, getTypeFromElement } from "../share";

import type { MyReactFiberNodeDev } from "./interface";
import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

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
  const newFiberNode = new MyReactFiberNodeClass(parent);

  newFiberNode.type = getTypeFromElement(element);

  newFiberNode._installElement(element);

  if (__DEV__) {
    checkFiberElement(newFiberNode, element);
  }

  const renderDispatch = newFiberNode.root.renderDispatch as RenderDispatch;

  const renderPlatform = newFiberNode.root.renderPlatform as RenderPlatform;

  renderDispatch.pendingCreate(newFiberNode);

  renderDispatch.pendingUpdate(newFiberNode);

  if (type === "position") {
    renderDispatch.pendingPosition(newFiberNode);
  } else {
    renderDispatch.pendingAppend(newFiberNode);
  }

  if (newFiberNode.ref) {
    renderDispatch.pendingRef(newFiberNode);
  }

  renderDispatch.resolveScopeMap(newFiberNode);

  renderDispatch.resolveStrictMap(newFiberNode);

  renderDispatch.resolveContextMap(newFiberNode);

  renderDispatch.resolveSuspenseMap(newFiberNode);

  renderDispatch.resolveErrorBoundariesMap(newFiberNode);

  renderPlatform.patchToFiberInitial?.(newFiberNode);

  if (!(newFiberNode.patch & PATCH_TYPE.__pendingUpdate__)) {
    newFiberNode._applyProps();
  }

  if (__DEV__) {
    const typedFiber = newFiberNode as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 1,
      mountTime: timeNow,
      prevUpdateTime: 0,
      currentUpdateTime: timeNow,
    };
  }

  return newFiberNode;
};
