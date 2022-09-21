import { __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { debugWithDOM, isEvent, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { addEventListener } from "../event";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const log = __my_react_shared__.log;

const domPropsHydrate = (fiber: MyReactFiberNode, node: DomFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    const { element: dom } = node;
    if (dom.textContent !== String(fiber.element)) {
      if (dom.textContent === " " && fiber.element === "") {
        dom.textContent = "";
      } else {
        log({
          fiber,
          message: `hydrate warning, text not match from server. server: ${dom.textContent}, client: ${fiber.element}`,
        });
        dom.textContent = fiber.element as string;
      }
    }
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const dom = node.element as Element;
    const props = fiber.pendingProps;
    Object.keys(props)
      .filter(isProperty)
      .forEach((key) => {
        if (props[key] !== null && props[key] !== false && props[key] !== undefined) {
          if (key === "className") {
            if (isSVG) {
              const v = dom.getAttribute("class")?.toString();
              if (v !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${key} not match from server. server: ${v}, client: ${props[key]}`,
                });
                dom.setAttribute("class", props[key] as string);
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
            if (key in dom && !isSVG) {
              if (dom[key].toString() !== String(props[key])) {
                log({
                  fiber,
                  message: `hydrate warning, dom ${key} props not match from server. server: ${dom[key]}, client: ${props[key]}`,
                });
                dom[key] = props[key] as string;
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

const domStyleHydrate = (fiber: MyReactFiberNode, node: DomFiberNode) => {
  if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const dom = node.element;
    const props = fiber.pendingProps;
    Object.keys(props)
      .filter(isStyle)
      .forEach((styleKey) => {
        const typedProps = (props[styleKey] as Record<string, unknown>) || {};
        Object.keys(typedProps).forEach((styleName) => {
          if (Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === "number") {
            dom[styleKey][styleName] = `${typedProps[styleName]}px`;
            return;
          }
          if (typedProps[styleName] !== null && typedProps[styleName] !== undefined) {
            dom[styleKey][styleName] = typedProps[styleName];
          }
        });
      });
  }
};

const domEventHydrate = (fiber: MyReactFiberNode, node: DomFiberNode) => {
  if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const props = fiber.pendingProps;
    Object.keys(props)
      .filter(isEvent)
      .forEach((key) => {
        addEventListener(fiber, node, key);
      });
  }
};

export const hydrateUpdate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  const node = fiber.node as DomFiberNode;

  // for now it is necessary to judge
  if (node) {
    domPropsHydrate(fiber, node, isSVG);
    domStyleHydrate(fiber, node);
    domEventHydrate(fiber, node);

    if (__DEV__) {
      debugWithDOM(fiber);
    }
  }

  fiber.patch = PATCH_TYPE.__initial__;
};
