import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { enableControlComponent, getHTMLAttrKey, getSVGAttrKey, isEvent, isProperty, isStyle, isUnitlessNumber, log } from "@my-react-dom-shared";

import { addEventListener } from "../helper";

import { controlElementTag, mountControlElement, prepareControlProp } from "./controlled";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

const domContentHydrate = (fiber: MyReactFiberNode) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  if (node.textContent !== String(fiber.element)) {
    if (node.textContent === " " && fiber.element === "") {
      node.textContent = "";
    } else {
      log({
        fiber,
        message: `hydrate warning, dom 'text' not match from server. server: ${node.textContent}, client: ${fiber.element}`,
      });
      node.textContent = fiber.element as string;
    }
  }
};

const domPropsHydrate = (fiber: MyReactFiberNode, isSVG: boolean, key: string, value: any) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  const dom = node as Element;

  if (value !== null && value !== undefined) {
    if (key === "className") {
      if (isSVG) {
        const v = dom.getAttribute("class")?.toString();

        if (v !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' not match from server. server: ${v}, client: ${value}`,
          });
          dom.setAttribute("class", value as string);
        }
      } else {
        if (dom[key].toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' not match from server. server: ${dom[key]}, client: ${value}`,
          });
          dom[key] == (value as string);
        }
      }
    } else {
      if (key in dom && !isSVG) {
        if (dom[key].toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' props not match from server. server: ${dom[key]}, client: ${value}`,
          });
          dom[key] = value as string;
        }
      } else {
        const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || key;

        const v = dom.getAttribute(attrKey);
        if (v?.toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${attrKey}' attr not match from server. server: ${v}, client: ${value}`,
          });
          dom.setAttribute(attrKey, value as string);
        }
      }
    }
  }
};

const domStyleHydrate = (fiber: MyReactFiberNode, key: string, value: Record<string, unknown>) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  Object.keys(value).forEach((styleName) => {
    if (!isUnitlessNumber[styleName] && typeof value[styleName] === "number") {
      node[key][styleName] = `${value[styleName]}px`;
      return;
    }
    if (value[styleName] !== null && value[styleName] !== undefined) {
      node[key][styleName] = value[styleName];
    }
  });
};

const domEventHydrate = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, key: string) => {
  const node = fiber.nativeNode;

  const isCanControlledElement = controlElementTag[fiber.elementType as string];

  addEventListener(fiber, renderDispatch, node as DomElement, key, isCanControlledElement);
};

const domInnerHTMLHydrate = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  if (props["dangerouslySetInnerHTML"]) {
    const typedDOM = fiber.nativeNode as Element;

    const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;

    const existInnerHTML = typedDOM.innerHTML;

    const incomingInnerHTML = typedProps.__html as string;

    if (existInnerHTML !== incomingInnerHTML) {
      log({ fiber, level: "error", message: `hydrate error, 'innerHTML' not match from server.` });

      typedDOM.innerHTML = typedProps.__html as string;
    }
  }
};

export const hydrateUpdate = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  if (node) {
    const props = fiber.pendingProps;

    const { isSVG } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    if (fiber.type & NODE_TYPE.__plain__) {
      const isCanControlledElement = enableControlComponent.current && controlElementTag[fiber.elementType as string];

      if (isCanControlledElement) {
        prepareControlProp(fiber);
      }

      if (isCanControlledElement) {
        mountControlElement(fiber);
      }

      Object.keys(props).forEach((key) => {
        if (isEvent(key)) {
          domEventHydrate(fiber, renderDispatch, key);
        } else if (isStyle(key)) {
          domStyleHydrate(fiber, key, (props[key] as Record<string, unknown>) || {});
        } else if (isProperty(key)) {
          domPropsHydrate(fiber, isSVG, key, props[key]);
        }
      });
      domInnerHTMLHydrate(fiber);
    }

    if (fiber.type & NODE_TYPE.__text__) {
      domContentHydrate(fiber);
    }
  }

  if (fiber.patch & PATCH_TYPE.__update__) fiber.patch ^= PATCH_TYPE.__update__;

  if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
};
