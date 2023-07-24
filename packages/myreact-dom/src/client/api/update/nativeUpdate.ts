import { emptyProps, NODE_TYPE } from "@my-react/react-reconciler";

import {
  enableControlComponent,
  enableHighlight,
  getHTMLAttrKey,
  getSVGAttrKey,
  isEvent,
  isGone,
  isNew,
  isProperty,
  isStyle,
  isUnitlessNumber,
} from "@my-react-dom-shared";

import { addEventListener, removeEventListener } from "../helper";

import { controlElementTag, mountControlElement, prepareControlProp, updateControlElement } from "./controlled";
import { HighLight } from "./highlight";
import { XLINK_NS, XML_NS, X_CHAR } from "./tool";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const nativeUpdate = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (!fiber.nativeNode) throw new Error("update error, dom not exist");

  const node = fiber.nativeNode as DomElement | DomNode;

  const { isSVG } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

  if (fiber.type & NODE_TYPE.__text__) {
    node.textContent = fiber.elementType as string;
  } else if (fiber.type & NODE_TYPE.__plain__) {
    const dom = node as HTMLElement;

    const isCanControlledElement = enableControlComponent.current && controlElementTag[fiber.elementType as string];

    if (isCanControlledElement) {
      prepareControlProp(fiber);
    }

    if (isCanControlledElement) {
      if (fiber.memoizedProps === emptyProps) {
        mountControlElement(fiber);
      } else {
        updateControlElement(fiber);
      }
    }

    const oldProps = fiber.memoizedProps || {};

    const newProps = fiber.pendingProps || {};

    Object.keys(oldProps)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        if (isEvent(key)) {
          removeEventListener(fiber, renderDispatch, node as DomElement, key);
        } else if (isProperty(key)) {
          if (newProps[key] === null || newProps[key] === undefined) {
            if (key === "className") {
              if (isSVG) {
                dom.removeAttribute("class");
              } else {
                dom[key] = "";
              }
            } else {
              if (key in dom && !isSVG) {
                dom[key] = "";
              } else {
                const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || key;
                dom.removeAttribute(attrKey as string);
              }
            }
          }
        } else if (isStyle(key)) {
          Object.keys((oldProps[key] as Record<string, unknown>) || {})
            .filter(isGone((newProps[key] as Record<string, unknown>) || {}))
            .forEach((styleName) => {
              dom.style[styleName] = "";
            });
        }
      });
    Object.keys(newProps)
      .filter(isNew(oldProps, newProps))
      .filter((key) => {
        if (isEvent(key)) {
          addEventListener(fiber, renderDispatch, node as DomElement, key, isCanControlledElement);
        } else if (isProperty(key)) {
          // from million package
          if (key.charCodeAt(0) === X_CHAR && isSVG) {
            const typedDom = node as SVGElement;
            if (key.startsWith("xmlns")) {
              typedDom.setAttributeNS(XML_NS, key, String(newProps[key]));
            } else if (key.startsWith("xlink")) {
              typedDom.setAttributeNS(XLINK_NS, "href", String(newProps[key]));
            } else {
              typedDom.setAttribute(key, String(newProps[key]))
            }
            return;
          }
          if (newProps[key] !== null && newProps[key] !== undefined) {
            if (key === "className") {
              if (isSVG) {
                dom.setAttribute("class", (newProps[key] as string) || "");
              } else {
                dom[key] = (newProps[key] as string) || "";
              }
            } else {
              if (key in dom && !isSVG) {
                dom[key] = newProps[key];
              } else {
                const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || key;
                dom.setAttribute(attrKey, String(newProps[key]));
              }
            }
          }
        } else if (isStyle(key)) {
          const typedNewProps = newProps[key] as Record<string, unknown>;

          const typedOldProps = oldProps[key] as Record<string, unknown>;

          Object.keys(typedNewProps || {})
            .filter(isNew(typedOldProps || {}, typedNewProps))
            .forEach((styleName) => {
              if (!isUnitlessNumber[styleName] && typeof typedNewProps[styleName] === "number") {
                dom[key][styleName] = `${typedNewProps[styleName]}px`;
                return;
              }
              if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
                dom[key][styleName] = typedNewProps[styleName];
              } else {
                dom[key][styleName] = "";
              }
            });
        }
      });
    if (
      newProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"].__html !== oldProps["dangerouslySetInnerHTML"]?.__html
    ) {
      const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
      dom.innerHTML = typedProps.__html as string;
    }
  }

  if (
    renderDispatch.isAppMounted &&
    !renderDispatch.isHydrateRender &&
    !renderDispatch.isServerRender &&
    (enableHighlight.current || (window as any).__highlight__)
  ) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
