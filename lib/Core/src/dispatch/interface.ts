import type { MyReactFiberNode } from '../fiber';

export interface FiberDispatch {
  _createPlainNode(_fiber: MyReactFiberNode): void;

  _createTextNode(_fiber: MyReactFiberNode): void;

  _addEventListener(
    _fiber: MyReactFiberNode,
    _dom: HTMLElement,
    _key: string
  ): void;

  _removeEventListener(
    _fiber: MyReactFiberNode,
    _dom: HTMLElement,
    _key: string
  ): void;

  hydrate(_fiber: MyReactFiberNode): void;

  create(_fiber: MyReactFiberNode): void;

  append(_fiber: MyReactFiberNode): void;

  update(_fiber: MyReactFiberNode): void;

  position(_fiber: MyReactFiberNode): void;

  unmount(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  updateAllSync(): void;

  updateAllAsync(): void;
}
