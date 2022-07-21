import { pushAppend, pushCreate, pushPosition, pushUpdate } from '../core';

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

  pushCreate(newFiberNode);

  pushUpdate(newFiberNode);

  if (type === 'append') {
    pushAppend(newFiberNode);
  } else {
    pushPosition(newFiberNode);
  }

  return newFiberNode;
};
