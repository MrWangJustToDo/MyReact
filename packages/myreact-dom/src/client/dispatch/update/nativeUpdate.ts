import { NODE_TYPE } from "@my-react/react-shared";

import { debugWithDOM, enableHighlight, isEvent, isGone, isNew, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { addEventListener, removeEventListener } from "../event";

import { HighLight } from "./highlight";

import type { DomScope, DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const nativeUpdate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (!fiber.node) throw new Error("update error, dom not exist");

  const renderScope = fiber.root.root_scope as DomScope;

  const node = fiber.node as DomFiberNode;

  if (fiber.type & NODE_TYPE.__isTextNode__) {
    const { element: typedDom } = node;
    typedDom.textContent = fiber.element as string;
  } else {
    const dom = node.element as HTMLElement;
    const oldProps = node.memoizedProps || {};
    const newProps = fiber.pendingProps || {};
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => removeEventListener(fiber, node, key));
    Object.keys(oldProps)
      .filter(isProperty)
      .filter(isGone(newProps))
      .forEach((key) => {
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
      });
    Object.keys(oldProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys((oldProps[styleKey] as Record<string, unknown>) || {})
          .filter(isGone((newProps[styleKey] as Record<string, unknown>) || {}))
          .forEach((styleName) => {
            dom.style[styleName] = "";
          });
      });
    Object.keys(newProps)
      .filter(isEvent)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => addEventListener(fiber, node, key));
    Object.keys(newProps)
      .filter(isProperty)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        if (key === "className") {
          if (isSVG) {
            dom.setAttribute("class", (newProps[key] as string) || "");
          } else {
            dom[key] = (newProps[key] as string) || "";
          }
        } else {
          if (key in dom && !isSVG) {
            if (newProps[key] !== null && newProps[key] !== false && newProps[key] !== undefined) {
              dom[key] = newProps[key];
            } else {
              dom[key] = "";
            }
          } else {
            if (newProps[key] !== null && newProps[key] !== false && newProps[key] !== undefined) {
              dom.setAttribute(key, String(newProps[key]));
            } else {
              dom.removeAttribute(key);
            }
          }
          if ((key === "autofocus" || key === "autoFocus") && newProps[key]) {
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
            if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedNewProps[styleName] === "number") {
              dom[styleKey][styleName] = `${typedNewProps[styleName]}px`;
              return;
            }
            if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
              dom[styleKey][styleName] = typedNewProps[styleName];
            } else {
              dom[styleKey][styleName] = "";
            }
          });
      });
    if (newProps["dangerouslySetInnerHTML"] && newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"]) {
      const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
      dom.innerHTML = typedProps.__html as string;
    }
  }

  if (__DEV__) {
    debugWithDOM(fiber);
  }

  if (renderScope.isAppMounted && !renderScope.isHydrateRender && !renderScope.isServerRender && (enableHighlight.current || (window as any).__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
};
