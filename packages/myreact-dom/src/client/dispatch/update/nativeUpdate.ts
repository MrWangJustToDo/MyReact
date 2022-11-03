import { NODE_TYPE } from "@my-react/react-shared";

import { enableHighlight, isEvent, isGone, isNew, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { addEventListener, removeEventListener } from "../event";

import { HighLight } from "./highlight";

import type { DomScope, DomElement, DomNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const nativeUpdate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (!fiber.node) throw new Error("update error, dom not exist");

  const renderScope = fiber.root.globalScope as DomScope;

  const node = fiber.node as DomElement | DomNode;

  if (fiber.type & NODE_TYPE.__isTextNode__) {
    node.textContent = fiber.element as string;
  } else {
    const dom = node as HTMLElement;
    const oldProps = fiber.memoizedProps || {};
    const newProps = fiber.pendingProps || {};
    Object.keys(oldProps)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        if (isEvent(key)) {
          removeEventListener(fiber, node as DomElement, key);
        } else if (isProperty(key)) {
          if (newProps[key] === null || newProps[key] === undefined || newProps[key] === false) {
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
                dom.removeAttribute(key);
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
    Object.keys(newProps).filter((key) => {
      if (isEvent(key)) {
        addEventListener(fiber, node as DomElement, key);
      } else if (isProperty(key)) {
        if (newProps[key] !== null && newProps[key] !== undefined && newProps[key] !== false) {
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
              dom.setAttribute(key, String(newProps[key]));
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

  if (renderScope.isAppMounted && !renderScope.isHydrateRender && !renderScope.isServerRender && (enableHighlight.current || (window as any).__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
