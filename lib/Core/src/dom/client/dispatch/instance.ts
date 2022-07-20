import { pendingUpdate } from '../../../dispatch';
import { debugWithDOM, rootContainer } from '../../../share';
import { appendAll, getDom } from '../../shared';
import { updateAllAsync, updateAllSync } from '../update';

import { addEventListener, removeEventListener } from './event';
import { tryHydrate } from './hydrate';
import { position } from './position';
import { unmountFiberNode } from './unmount';
import { updateDom } from './update';

import type { FiberDispatch } from '../../../dispatch';
import type { MyReactFiberNode } from '../../../fiber';
import type { Children } from '../../../vdom';

export class ClientDispatch implements FiberDispatch {
  _createPlainNode(fiber: MyReactFiberNode): void {
    const typedElement = fiber.element as Children;
    if (fiber.nameSpace) {
      fiber.dom = document.createElementNS(
        fiber.nameSpace,
        typedElement.type as string
      ) as HTMLElement;
    } else {
      fiber.dom = document.createElement(typedElement.type as string);
    }
  }

  _createTextNode(fiber: MyReactFiberNode): void {
    fiber.dom = document.createTextNode(fiber.element as string);
  }

  _addEventListener(
    fiber: MyReactFiberNode,
    dom: HTMLElement,
    key: string
  ): void {
    addEventListener(fiber, dom, key);
  }

  _removeEventListener(
    fiber: MyReactFiberNode,
    dom: HTMLElement,
    key: string
  ): void {
    removeEventListener(fiber, dom, key);
  }

  hydrate(_fiber: MyReactFiberNode): void {
    tryHydrate(_fiber, rootContainer.current as HTMLElement, this);
  }

  create(fiber: MyReactFiberNode): void {
    if (fiber.__isTextNode__) {
      this._createTextNode(fiber);
    } else if (fiber.__isPlainNode__) {
      this._createPlainNode(fiber);
    } else {
      // portal element
      fiber.dom = fiber.__props__.container as HTMLElement;
    }
    fiber.applyRef();
    debugWithDOM(fiber);
  }

  append(fiber: MyReactFiberNode): void {
    if (fiber.__pendingAppend__) {
      appendAll(
        fiber,
        (getDom(fiber.parent, (f) => f.parent) as HTMLElement) ||
          rootContainer.current
      );
    }
  }

  update(fiber: MyReactFiberNode): void {
    updateDom(fiber, this);
  }

  position(fiber: MyReactFiberNode): void {
    position(fiber);
  }

  unmount(fiber: MyReactFiberNode): void {
    unmountFiberNode(fiber);
  }

  pendingUpdate(fiber: MyReactFiberNode): void {
    pendingUpdate(fiber);
  }

  updateAllSync(): void {
    updateAllSync();
  }

  updateAllAsync(): void {
    updateAllAsync();
  }
}
