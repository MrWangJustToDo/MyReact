import { globalDispatch } from '../share';

import { MyReactFiberNode } from './instance';

import type { ChildrenNode } from '../vdom';

export const createFiberNode = (
  {
    fiberIndex,
    parent,
    type = 'append',
  }: {
    fiberIndex: number;
    parent: MyReactFiberNode | null;
    type?: 'append' | 'position';
  },
  VDom: ChildrenNode
) => {
  const newFiberNode = new MyReactFiberNode(fiberIndex, parent, VDom);

  newFiberNode.checkVDom();

  newFiberNode.initialType();

  newFiberNode.initialParent();

  globalDispatch.current.pendingCreate(newFiberNode);

  globalDispatch.current.pendingUpdate(newFiberNode);

  if (type === 'append') {
    globalDispatch.current.pendingAppend(newFiberNode);
  } else {
    globalDispatch.current.pendingPosition(newFiberNode);
  }

  return newFiberNode;
};
