import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { isEvent, isProperty, isStyle, IS_UNIT_LESS_NUMBER, log } from "@my-react-dom-shared";

import { addEventListener } from "../event";

import type { DomElement, DomNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const domContentHydrate = (fiber: MyReactFiberNode) => {
  const node = fiber.node as DomElement | DomNode;
  if (node.textContent !== String(fiber.element)) {
    if (node.textContent === " " && fiber.element === "") {
      node.textContent = "";
    } else {
      log({
        fiber,
        message: `hydrate warning, text not match from server. server: ${node.textContent}, client: ${fiber.element}`,
      });
      node.textContent = fiber.element as string;
    }
  }
};

const domPropsHydrate = (fiber: MyReactFiberNode, isSVG: boolean, key: string, value: any) => {
  const node = fiber.node as DomElement | DomNode;
  const dom = node as Element;
  if (value !== null && value !== false && value !== undefined) {
    if (key === "className") {
      if (isSVG) {
        const v = dom.getAttribute("class")?.toString();
        if (v !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom ${key} not match from server. server: ${v}, client: ${value}`,
          });
          dom.setAttribute("class", value as string);
        }
      } else {
        if (dom[key].toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom ${key} not match from server. server: ${dom[key]}, client: ${value}`,
          });
          dom[key] == (value as string);
        }
      }
    } else {
      if (key in dom && !isSVG) {
        if (dom[key].toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom ${key} props not match from server. server: ${dom[key]}, client: ${value}`,
          });
          dom[key] = value as string;
        }
      } else {
        const v = dom.getAttribute(key);
        if (v?.toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom ${v} attr not match from server. server: ${v}, client: ${value}`,
          });
          dom.setAttribute(key, value as string);
        }
      }
    }
  }
};

const domStyleHydrate = (fiber: MyReactFiberNode, key: string, value: Record<string, unknown>) => {
  const node = fiber.node as DomElement | DomNode;
  Object.keys(value).forEach((styleName) => {
    if (Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof value[styleName] === "number") {
      node[key][styleName] = `${value[styleName]}px`;
      return;
    }
    if (value[styleName] !== null && value[styleName] !== undefined) {
      node[key][styleName] = value[styleName];
    }
  });
};

const domEventHydrate = (fiber: MyReactFiberNode, key: string) => {
  const node = fiber.node;
  addEventListener(fiber, node as DomElement, key);
};

export const hydrateUpdate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  const node = fiber.node as DomElement | DomNode;

  if (node) {
    const props = fiber.pendingProps;

    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      Object.keys(props).forEach((key) => {
        if (isEvent(key)) {
          domEventHydrate(fiber, key);
        } else if (isStyle(key)) {
          domStyleHydrate(fiber, key, props[key] as Record<string, unknown> || {});
        } else if (isProperty(key)) {
          domPropsHydrate(fiber, isSVG, key, props[key]);
        }
      });
    }

    if (fiber.type & NODE_TYPE.__isTextNode__) {
      domContentHydrate(fiber);
    }
  }

  fiber.patch = PATCH_TYPE.__initial__;
};
