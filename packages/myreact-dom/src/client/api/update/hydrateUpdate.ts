import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { getHTMLAttrKey, getSVGAttrKey, isEvent, isProperty, isStyle, log } from "@my-react-dom-shared";

import { XLINK_NS, XML_NS, X_CHAR, addEventListener, setStyle } from "../helper";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

const domContentHydrate = (fiber: MyReactFiberNode) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  if (node.textContent !== String(fiber.elementType)) {
    if (node.textContent === " " && fiber.elementType === "") {
      node.textContent = "";
    } else {
      log({
        fiber,
        message: `hydrate warning, dom 'text' not match from server. server: ${node.textContent}, client: ${fiber.elementType?.toString()}`,
      });
      node.textContent = fiber.elementType as string;
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
    } else if (isSVG && key.charCodeAt(0) === X_CHAR) {
      if (key.startsWith("xmlns")) {
        const serverAttr = dom.getAttributeNS(XML_NS, key);
        if (String(serverAttr) !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' props not match from server. server: ${serverAttr}, client: ${value}`,
          });
          dom.setAttributeNS(XML_NS, key, String(value));
        }
      } else if (key.startsWith("xlink")) {
        const serverAttr = dom.getAttributeNS(XLINK_NS, "href");
        if (String(serverAttr) !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom 'href' props not match from server. server: ${serverAttr}, client: ${value}`,
          });
          dom.setAttributeNS(XLINK_NS, "href", String(value));
        }
      } else {
        const serverAttr = dom.getAttribute(key);
        if (String(serverAttr) !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' attr not match from server. server: ${serverAttr}, client: ${value}`,
          });
        }
        dom.setAttribute(key, String(value));
      }
    } else {
      if (key in dom && !isSVG) {
        if (dom[key].toString() !== String(value)) {
          log({
            fiber,
            message: `hydrate warning, dom '${key}' props not match from server. server: ${dom[key]}, client: ${value}`,
          });
          try {
            dom[key] = value as string;
          } catch (e) {
            if (__DEV__) {
              log({ fiber, message: `${(e as Error).message}, key: ${key}, value: ${value}`, level: "error", triggerOnce: true });
            }
          }
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

const domStyleHydrate = (fiber: MyReactFiberNode, _key: string, value: Record<string, unknown>) => {
  const node = fiber.nativeNode as HTMLElement;

  Object.keys(value).forEach((styleName) => setStyle(node, styleName, value[styleName] as string | number | null | undefined));
};

const domEventHydrate = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, key: string) => {
  const node = fiber.nativeNode;

  addEventListener(fiber, renderDispatch.runtimeMap.eventMap, node as DomElement, key);
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
    const { isSVG } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    if (fiber.type & NODE_TYPE.__plain__) {
      const props = fiber.pendingProps;

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
