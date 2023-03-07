import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNodeDev } from "./interface";
import type { RenderDispatch } from "../runtimeDispatch";
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
  const newFiberNode = new MyReactFiberNodeClass(parent, element);

  const renderDispatch = newFiberNode.root.renderDispatch as RenderDispatch;

  renderDispatch.pendingCreate(newFiberNode);

  renderDispatch.pendingUpdate(newFiberNode);

  if (type === "append") {
    renderDispatch.pendingAppend(newFiberNode);
  } else {
    renderDispatch.pendingPosition(newFiberNode);
  }

  renderDispatch.pendingRef(newFiberNode);

  renderDispatch.processFiberInitial(newFiberNode);

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
