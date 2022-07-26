import type { MyReactFiberNode } from '../fiber';
import type { LinkTreeList } from '../share';
import type { FiberDispatch } from './interface';

export class EmptyDispatch implements FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void {
    void 0;
  }
  reconcileCommit(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void {
    void 0;
  }
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void {
    void 0;
  }
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    void 0;
  }
  beginProgressList(): void {
    void 0;
  }
  endProgressList(): void {
    void 0;
  }
  generateUpdateList(_fiber: MyReactFiberNode | MyReactFiberNode[]): void {
    void 0;
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUnmount(
    _fiber: MyReactFiberNode,
    _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]
  ): void {
    void 0;
  }
  pendingLayoutEffect(
    _fiber: MyReactFiberNode,
    _layoutEffect: () => void
  ): void {
    void 0;
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }
  updateAllSync(): void {
    void 0;
  }
  updateAllAsync(): void {
    void 0;
  }
}
