import type { MyReactFiberNode } from '../fiber';

export interface FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void;

  reconcileCreate(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void;

  // loop to mount/hydrate/update
  reconcileCommit(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void;

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
