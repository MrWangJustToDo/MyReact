import { debugWithDOM, IS_UNIT_LESS_NUMBER, log } from '../../../../share';
import { isEvent, isProperty, isStyle } from '../../../shared';
import { addEventListener } from '../event';

import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

const domPropsHydrate = (fiber: MyReactFiberNode, dom: Element) => {
  if (fiber.__isTextNode__) {
    if (dom.textContent !== String(fiber.element)) {
      if (dom.textContent === ' ' && fiber.element === '') {
        dom.textContent = '';
      } else {
        log({
          fiber,
          message: `hydrate warning, text not match from server. server: ${dom.textContent}, client: ${fiber.element}`,
        });
        dom.textContent = fiber.element as string;
      }
    }
  } else if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    const props = typedElement.props;
    Object.keys(props)
      .filter(isProperty)
      .forEach((key) => {
        if (
          props[key] !== null &&
          props[key] !== false &&
          props[key] !== undefined
        ) {
          if (key === 'className') {
            if (fiber.nameSpace) {
              const v = dom.getAttribute('class')?.toString();
              if (v !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${key} not match from server. server: ${v}, client: ${props[key]}`,
                });
                dom.setAttribute('class', props[key] as string);
              }
            } else {
              if (dom[key].toString() !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${key} not match from server. server: ${dom[key]}, client: ${props[key]}`,
                });
                dom[key] == (props[key] as string);
              }
            }
          } else {
            if (key in dom && !fiber.nameSpace) {
              if ((dom as any)[key].toString() !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${key} props not match from server. server: ${
                    (dom as any)[key]
                  }, client: ${props[key]}`,
                });
                (dom as any)[key] = props[key] as string;
              }
            } else {
              const v = dom.getAttribute(key);
              if (v?.toString() !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${v} attr not match from server. server: ${v}, client: ${props[key]}`,
                });
                dom.setAttribute(key, props[key] as string);
              }
            }
          }
        }
      });
  }
};

const domStyleHydrate = (fiber: MyReactFiberNode, dom: Element) => {
  if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    const props = typedElement.props;
    Object.keys(props)
      .filter(isStyle)
      .forEach((styleKey) => {
        const typedProps = (props[styleKey] as Record<string, unknown>) || {};
        Object.keys(typedProps).forEach((styleName) => {
          if (
            Object.prototype.hasOwnProperty.call(
              IS_UNIT_LESS_NUMBER,
              styleName
            ) &&
            typeof typedProps[styleName] === 'number'
          ) {
            (dom as any)[styleKey][styleName] = `${typedProps[styleName]}px`;
            return;
          }
          if (
            typedProps[styleName] !== null &&
            typedProps[styleName] !== undefined
          ) {
            (dom as any)[styleKey][styleName] = typedProps[styleName];
          }
        });
      });
  }
};

const domEventHydrate = (fiber: MyReactFiberNode, dom: Element) => {
  if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    const props = typedElement.props;
    Object.keys(props)
      .filter(isEvent)
      .forEach((key) => {
        addEventListener(fiber, dom, key);
      });
  }
};

export const hydrateUpdate = (fiber: MyReactFiberNode) => {
  const dom = fiber.dom as Element;

  // for now it is necessary to judge
  if (dom) {
    domPropsHydrate(fiber, dom);
    domStyleHydrate(fiber, dom);
    domEventHydrate(fiber, dom);

    debugWithDOM(fiber);
  }

  fiber.__pendingCreate__ = false;

  fiber.__pendingUpdate__ = false;

  fiber.__pendingAppend__ = false;

  fiber.__pendingPosition__ = false;
};
