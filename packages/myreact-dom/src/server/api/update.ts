import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { getHTMLAttrKey, getSVGAttrKey, isProperty, isStyle, isUnitlessNumber, kebabCase, propsToAttrMap, validDomProps } from "@my-react-dom-shared";

import { TextElement } from "./native";

import type { CommentElementDev, TextElementDev } from "./native";
import type { PlainElement, PlainElementDev } from "./native/plain";
import type { MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const update = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (include(fiber.patch, PATCH_TYPE.__update__)) {
    if (__DEV__) validDomProps(fiber);

    if (include(fiber.type, NODE_TYPE.__plain__)) {
      const dom = fiber.nativeNode as PlainElement;
      const props = fiber.pendingProps || {};
      Object.keys(props).forEach((key) => {
        if (isProperty(key)) {
          if (props[key] !== null && props[key] !== undefined) {
            const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || propsToAttrMap[key] || key;
            if (props[key] === false) {
              if (attrKey.includes("-")) {
                dom.setAttribute(attrKey as string, props[key] as string);
              } else {
                dom.removeAttribute(attrKey as string);
              }
            } else {
              dom.setAttribute(attrKey as string, props[key] as string);
            }
          }
        }
        if (isStyle(key)) {
          const typedProps = (props[key] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (typedProps[styleName] !== null && typedProps[styleName] !== undefined) {
              if (!isUnitlessNumber[styleName] && typeof typedProps[styleName] === "number") {
                dom[key][styleName] = `${typedProps[styleName]}px`;
                return;
              }
              dom[key][styleName] = typedProps[styleName];
            }
          });
        }
      });
      if (props["dangerouslySetInnerHTML"]) {
        const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;
        if (typedProps.__html) {
          dom.append(new TextElement(typedProps.__html?.toString()));
        }
      }
    }

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      const typedNativeNode = fiber.nativeNode as PlainElementDev | TextElementDev | CommentElementDev;

      if (typedNativeNode) {
        typedNativeNode._debugElement = typedFiber._debugElement;
      }
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__update__);
  }
};

/**
 * @internal
 */
export const getSerializeProps = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const props = fiber.pendingProps || {};
    const attrs = {};
    const styles = {};
    Object.keys(props).forEach((key) => {
      if (props[key] === null || props[key] === undefined) return;
      if (isProperty(key)) {
        const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || propsToAttrMap[key] || key;
        if (props[key] === false) {
          if (attrKey.includes("-")) {
            attrs[attrKey] = props[key];
          } else {
            delete attrs[attrKey];
          }
        } else {
          attrs[attrKey] = props[key];
        }
        if (fiber.elementType === "html") {
          attrs["data-stream"] = "@my-react";
        }
      }
      if (isStyle(key)) {
        const typedProps = (props[key] as Record<string, unknown>) || {};
        Object.keys(typedProps).forEach((styleName) => {
          if (typedProps[styleName] === null || typedProps[styleName] === undefined) return;
          if (!isUnitlessNumber[styleName] && typeof typedProps[styleName] === "number") {
            styles[styleName] = `${typedProps[styleName]}px`;
            return;
          }
          styles[styleName] = typedProps[styleName];
        });
      }
    });
    const serializedAttrs = Object.keys(attrs)
      .map((key) => `${key}="${attrs[key]?.toString()}"`)
      .reduce((p, c) => `${p} ${c}`, "");
    let serializedStyles = Object.keys(styles)
      .map((key) => `${kebabCase(key)}:${styles[key]?.toString()};`)
      .reduce((p, c) => p + c, "");
    serializedStyles = serializedStyles.length ? `style="${serializedStyles}"` : "";
    const arr = [serializedAttrs.slice(1), serializedStyles].filter((i) => i.length);
    if (arr.length) return arr.reduce((p, c) => `${p} ${c}`);
    return "";
  }
};
