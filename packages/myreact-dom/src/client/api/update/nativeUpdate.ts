import { NODE_TYPE } from "@my-react/react-reconciler";

import { enableHighlight, getHTMLAttrKey, getSVGAttrKey, isEvent, isGone, isNew, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { addEventListener, removeEventListener } from "../helper";

import { HighLight } from "./highlight";
import { XLINK_NS, XML_NS, X_CHAR } from "./tool";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomContainer } from "@my-react-dom-client/renderContainer";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const nativeUpdate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (!fiber.nativeNode) throw new Error("update error, dom not exist");

  const renderContainer = fiber.container as ClientDomContainer;

  const node = fiber.nativeNode as DomElement | DomNode;

  if (fiber.type & NODE_TYPE.__text__) {
    node.textContent = fiber.element as string;
  } else if (fiber.type & NODE_TYPE.__plain__) {
    const dom = node as HTMLElement;
    const oldProps = fiber.memoizedProps || {};
    const newProps = fiber.pendingProps || {};
    Object.keys(oldProps)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        if (isEvent(key)) {
          removeEventListener(fiber, node as DomElement, key);
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
          addEventListener(fiber, node as DomElement, key);
        } else if (isProperty(key)) {
          // from million package
          if (key.charCodeAt(0) === X_CHAR && isSVG) {
            const typedDom = node as SVGElement;
            if (key.startsWith("xmlns")) {
              typedDom.setAttributeNS(XML_NS, key, String(newProps[key]));
            } else if (key.startsWith("xlink")) {
              typedDom.setAttributeNS(XLINK_NS, "href", String(newProps[key]));
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
            if ((key === "autofocus" || key === "autoFocus") && newProps[key]) {
              Promise.resolve().then(() => dom.focus());
            }
          }
        } else if (isStyle(key)) {
          const typedNewProps = newProps[key] as Record<string, unknown>;
          const typedOldProps = oldProps[key] as Record<string, unknown>;
          Object.keys(typedNewProps || {})
            .filter(isNew(typedOldProps || {}, typedNewProps))
            .forEach((styleName) => {
              if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedNewProps[styleName] === "number") {
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
    if (newProps["dangerouslySetInnerHTML"] && newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"]) {
      const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
      dom.innerHTML = typedProps.__html as string;
    }
  }

  if (
    renderContainer.isAppMounted &&
    !renderContainer.isHydrateRender &&
    !renderContainer.isServerRender &&
    (enableHighlight.current || (window as any).__highlight__)
  ) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
