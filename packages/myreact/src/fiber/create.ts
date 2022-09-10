import { globalDispatch } from "../share";

import { MyReactFiberNode } from "./instance";
import { NODE_TYPE } from "./symbol";

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

  if (__DEV__) {
    newFiberNode.checkElement();
  }

  newFiberNode.initialType();

  newFiberNode.initialParent();

  globalDispatch.current.pendingCreate(newFiberNode);

  globalDispatch.current.pendingUpdate(newFiberNode);

  if (type === "append") {
    globalDispatch.current.pendingAppend(newFiberNode);
  } else {
    globalDispatch.current.pendingPosition(newFiberNode);
  }

  if (newFiberNode.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
    if ((element as MyReactElement).ref) {
      globalDispatch.current.pendingLayoutEffect(newFiberNode, () => newFiberNode.applyRef());
    }
  }

  return newFiberNode;
};
