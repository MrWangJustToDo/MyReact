import { MyReactFiberNode } from "./instance";

import type { MyReactElementNode } from "../element";

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
  const newFiberNode = new MyReactFiberNode(parent, element);

  newFiberNode.initialType();

  newFiberNode.initialParent();

  const globalDispatch = newFiberNode.root.globalDispatch;

  globalDispatch.pendingCreate(newFiberNode);

  globalDispatch.pendingUpdate(newFiberNode);

  if (type === "append") {
    globalDispatch.pendingAppend(newFiberNode);
  } else {
    globalDispatch.pendingPosition(newFiberNode);
  }

  globalDispatch.pendingRef(newFiberNode);

  globalDispatch.resolveMemorizedProps(newFiberNode);

  return newFiberNode;
};
