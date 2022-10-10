import { NODE_TYPE } from "@my-react/react-shared";

import { MyReactFiberNode } from "./instance";

import type { MyReactElement, MyReactElementNode } from "../element";

export const createFiberNode = (
  {
    fiberIndex,
    parent,
    type = "append",
  }: {
    fiberIndex: number;
    parent: MyReactFiberNode | null;
    type?: "append" | "position";
  },
  element: MyReactElementNode
) => {
  const newFiberNode = new MyReactFiberNode(fiberIndex, parent, element);

  newFiberNode.initialType();

  if (__DEV__) {
    newFiberNode.checkElement();
  }

  newFiberNode.initialParent();

  const globalDispatch = newFiberNode.root.root_dispatch;

  globalDispatch.pendingCreate(newFiberNode);

  globalDispatch.pendingUpdate(newFiberNode);

  if (type === "append") {
    globalDispatch.pendingAppend(newFiberNode);
  } else {
    globalDispatch.pendingPosition(newFiberNode);
  }

  if (newFiberNode.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
    if ((element as MyReactElement).ref) {
      globalDispatch.pendingLayoutEffect(newFiberNode, () => globalDispatch.resolveRef(newFiberNode));
    }
  }

  return newFiberNode;
};
