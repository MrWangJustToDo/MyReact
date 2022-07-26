import type { MyReactFiberNode } from '../fiber';
import type { LinkTreeList } from '../share';

export interface FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void;

  // loop to mount/hydrate
  reconcileCommit(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void;

  // loop to update
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void;

  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void;

  beginProgressList(): void;

  endProgressList(): void;

  generateUpdateList(_fiber: MyReactFiberNode): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingUnmount(
    _fiber: MyReactFiberNode,
    _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]
  ): void;

  pendingLayoutEffect(
    _fiber: MyReactFiberNode,
    _layoutEffect: () => void
  ): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  updateAllSync(): void;

  updateAllAsync(): void;
}
