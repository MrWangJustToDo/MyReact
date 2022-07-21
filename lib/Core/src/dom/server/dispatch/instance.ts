import { IS_UNIT_LESS_NUMBER, rootContainer } from '../../../share';
import { appendAll, getDom, isProperty, isStyle } from '../../shared';
import { PlainElement, TextElement } from '../dom';

import type { FiberDispatch } from '../../../dispatch';
import type { MyReactFiberNode } from '../../../fiber';
import type { Children } from '../../../vdom';

export class ServerDispatch implements FiberDispatch {
  _createPlainNode(_fiber: MyReactFiberNode): void {
    const typedElement = _fiber.element as Children;
    _fiber.dom = new PlainElement(typedElement.type as string) as any;
  }
  _createTextNode(_fiber: MyReactFiberNode): void {
    _fiber.dom = new TextElement(_fiber.element as string) as any;
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
    if (_fiber.__isTextNode__) {
      this._createTextNode(_fiber);
    } else if (_fiber.__isPlainNode__) {
      this._createPlainNode(_fiber);
    } else {
      throw new Error('createPortal() can not call on the server');
    }
  }
  append(_fiber: MyReactFiberNode): void {
    if (_fiber.__pendingAppend__) {
      appendAll(
        _fiber,
        (getDom(_fiber.parent, (f) => f.parent) as HTMLElement) ||
          rootContainer.current
      );
    }
  }
  update(_fiber: MyReactFiberNode): void {
    if (_fiber.__isPlainNode__) {
      const dom = _fiber.dom as HTMLElement;
      const props = _fiber.__props__ || {};
      Object.keys(props)
        .filter(isProperty)
        .forEach((key) => {
          if (key === 'className') {
            dom[key] = props[key] as string;
          } else {
            dom.setAttribute(key, props[key] as string);
          }
        });
      Object.keys(props)
        .filter(isStyle)
        .forEach((styleKey) => {
          const typedProps = (props[styleKey] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (
              !Object.prototype.hasOwnProperty.call(
                IS_UNIT_LESS_NUMBER,
                styleName
              ) &&
              typeof typedProps[styleName] === 'number'
            ) {
              (dom as any)[styleKey][styleName] = `${typedProps[styleName]}px`;
              return;
            }
            (dom as any)[styleKey][styleName] = typedProps[styleName];
          });
        });
      if (props['dangerouslySetInnerHTML']) {
        dom.append(
          (props['dangerouslySetInnerHTML'] as Record<string, unknown>)
            .__html as string
        );
      }
    }
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
