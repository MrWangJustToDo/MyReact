import {
  enableHighlight,
  isAppMounted,
  isHydrateRender,
  isServerRender,
  IS_UNIT_LESS_NUMBER,
} from '../../../../share';
import { isEvent, isGone, isNew, isProperty, isStyle } from '../../../shared';

import { HighLight } from './highlight';

import type { FiberDispatch } from '../../../../dispatch';
import type { MyReactFiberNode } from '../../../../fiber';

export const updateDom = (fiber: MyReactFiberNode, dispatch: FiberDispatch) => {
  if (!fiber.dom) throw new Error('update error, look like a bug');
  if (fiber.__isTextNode__) {
    if (fiber.__vdom__ !== fiber.__prevVdom__) {
      fiber.dom.textContent = fiber.element as string;
    }
  } else {
    const dom = fiber.dom as HTMLElement;
    const oldProps = fiber.__prevProps__ || {};
    const newProps = fiber.__props__ || {};
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => dispatch._removeEventListener(fiber, dom, key));
    Object.keys(oldProps)
      .filter(isProperty)
      .filter(isGone(newProps))
      .forEach((key) => {
        if (key === 'className') {
          if (fiber.nameSpace) {
            dom.removeAttribute('class');
          } else {
            dom[key] = '';
          }
        } else {
          if (key in dom && !fiber.nameSpace) {
            (dom as any)[key] = '';
          } else {
            dom.removeAttribute(key);
          }
        }
      });
    Object.keys(oldProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys((oldProps[styleKey] as Record<string, unknown>) || {})
          .filter(isGone((newProps[styleKey] as Record<string, unknown>) || {}))
          .forEach((styleName) => {
            (dom.style as any)[styleName] = '';
          });
      });
    Object.keys(newProps)
      .filter(isEvent)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => dispatch._addEventListener(fiber, dom, key));
    Object.keys(newProps)
      .filter(isProperty)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        if (key === 'className') {
          if (fiber.nameSpace) {
            dom.setAttribute('class', (newProps[key] as string) || '');
          } else {
            dom[key] = (newProps[key] as string) || '';
          }
        } else {
          if (key in dom && !fiber.nameSpace) {
            if (
              newProps[key] !== null &&
              newProps[key] !== false &&
              newProps[key] !== undefined
            ) {
              (dom as any)[key] = newProps[key];
            } else {
              (dom as any)[key] = '';
            }
          } else {
            if (
              newProps[key] !== null &&
              newProps[key] !== false &&
              newProps[key] !== undefined
            ) {
              dom.setAttribute(key, String(newProps[key]));
            } else {
              dom.removeAttribute(key);
            }
          }
          if ((key === 'autofocus' || key === 'autoFocus') && newProps[key]) {
            Promise.resolve().then(() => dom.focus());
          }
        }
      });
    Object.keys(newProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        const typedNewProps = newProps[styleKey] as Record<string, unknown>;
        const typedOldProps = oldProps[styleKey] as Record<string, unknown>;
        Object.keys(typedNewProps || {})
          .filter(isNew(typedOldProps || {}, typedNewProps))
          .forEach((styleName) => {
            if (
              !Object.prototype.hasOwnProperty.call(
                IS_UNIT_LESS_NUMBER,
                styleName
              ) &&
              typeof typedNewProps[styleName] === 'number'
            ) {
              (dom as any)[styleKey][
                styleName
              ] = `${typedNewProps[styleName]}px`;
              return;
            }
            if (
              typedNewProps[styleName] !== null &&
              typedNewProps[styleName] !== undefined
            ) {
              (dom as any)[styleKey][styleName] = typedNewProps[styleName];
            } else {
              (dom as any)[styleKey][styleName] = '';
            }
          });
      });
    if (
      newProps['dangerouslySetInnerHTML'] &&
      newProps['dangerouslySetInnerHTML'] !==
        oldProps['dangerouslySetInnerHTML']
    ) {
      dom.innerHTML = (
        newProps['dangerouslySetInnerHTML'] as Record<string, unknown>
      ).__html as string;
    }
  }
  fiber.applyVDom();

  if (
    isAppMounted.current &&
    !isHydrateRender.current &&
    !isServerRender.current &&
    (enableHighlight.current || (window as any).__highlight__)
  ) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
