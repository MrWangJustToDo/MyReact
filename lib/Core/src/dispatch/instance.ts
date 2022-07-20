import type { MyReactFiberNode } from '../fiber';
import type { FiberDispatch } from './interface';

export class EmptyDispatch implements FiberDispatch {
  _createPlainNode(_fiber: MyReactFiberNode): void {
    void 0;
  }
  _createTextNode(_fiber: MyReactFiberNode): void {
    void 0;
  }
  _addEventListener(
    _fiber: MyReactFiberNode,
    _dom: HTMLElement,
    _key: string
  ): void {
    void 0;
  }
  _removeEventListener(
    _fiber: MyReactFiberNode,
    _dom: HTMLElement,
    _key: string
  ): void {
    void 0;
  }
  hydrate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  create(_fiber: MyReactFiberNode): void {
    void 0;
  }
  append(_fiber: MyReactFiberNode): void {
    void 0;
  }
  update(_fiber: MyReactFiberNode): void {
    void 0;
  }
  position(_fiber: MyReactFiberNode): void {
    void 0;
  }
  unmount(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  updateAllSync(): void {
    void 0;
  }
  updateAllAsync(): void {
    void 0;
  }
}
