import { globalDispatch } from "../share";

import { MyReactFiberNode } from "./instance";

import type { Element, ElementNode } from "../element";

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
  VDom: ElementNode
) => {
  const newFiberNode = new MyReactFiberNode(fiberIndex, parent, VDom);

  newFiberNode.checkVDom();

  newFiberNode.initialType();

  newFiberNode.initialParent();

  globalDispatch.current.pendingCreate(newFiberNode);

  globalDispatch.current.pendingUpdate(newFiberNode);

  if (type === "append") {
    globalDispatch.current.pendingAppend(newFiberNode);
  } else {
    globalDispatch.current.pendingPosition(newFiberNode);
  }

  if (newFiberNode.__isPlainNode__ || newFiberNode.__isClassComponent__) {
    if ((VDom as Element).ref) {
      globalDispatch.current.pendingLayoutEffect(newFiberNode, () => newFiberNode.applyRef());
    }
  }

  return newFiberNode;
};
