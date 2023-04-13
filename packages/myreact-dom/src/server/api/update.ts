import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { getHTMLAttrKey, getSVGAttrKey, isProperty, isStyle, isUnitlessNumber, kebabCase, propsToAttrMap } from "@my-react-dom-shared";

import { TextElement } from "./native";

import type { PlainElement } from "./native/plain";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const update = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (fiber.patch & PATCH_TYPE.__update__) {
    if (fiber.type & NODE_TYPE.__plain__) {
      const dom = fiber.nativeNode as PlainElement;
      const props = fiber.pendingProps || {};
      Object.keys(props).forEach((key) => {
        if (isProperty(key)) {
          const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || propsToAttrMap[key] || key;
          dom.setAttribute(attrKey as string, props[key] as string);
        }
        if (isStyle(key)) {
          const typedProps = (props[key] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (!isUnitlessNumber[styleName] && typeof typedProps[styleName] === "number") {
              dom[key][styleName] = `${typedProps[styleName]}px`;
              return;
            }
            dom[key][styleName] = typedProps[styleName];
          });
        }
      });
      if (props["dangerouslySetInnerHTML"]) {
        const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;
        if (typedProps.__html) {
          dom.append(new TextElement(typedProps.__html as string));
        }
      }
    }

    if (fiber.patch & PATCH_TYPE.__update__) fiber.patch ^= PATCH_TYPE.__update__;
  }
};

export const getSerializeProps = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const props = fiber.pendingProps || {};
    const attrs = {};
    const styles = {};
    Object.keys(props).forEach((key) => {
      if (props[key] === null || props[key] === undefined) return;
      if (isProperty(key)) {
        const attrKey = (isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key)) || propsToAttrMap[key] || key;
        attrs[attrKey] = props[key];
      }
      if (isStyle(key)) {
        const typedProps = (props[key] as Record<string, unknown>) || {};
        Object.keys(typedProps).forEach((styleName) => {
          if (!isUnitlessNumber[styleName] && typeof typedProps[styleName] === "number") {
            styles[kebabCase(styleName)] = `${typedProps[styleName]}px`;
            return;
          }
          styles[kebabCase(styleName)] = typedProps[styleName];
        });
      }
    });
    const serializedAttrs = Object.keys(attrs)
      .map((key) => `${key}="${attrs[key]?.toString()}"`)
      .reduce((p, c) => `${p} ${c}`, "");
    let serializedStyles = Object.keys(styles)
      .map((key) => `${key}: ${styles[key]?.toString()}`)
      .reduce((p, c) => p + c, "");
    serializedStyles = serializedStyles.length ? `style=${serializedStyles}` : "";
    const arr = [serializedAttrs.slice(1), serializedStyles].filter((i) => i.length);
    if (arr.length) return arr.reduce((p, c) => `${p} ${c}`);
    return "";
  }
};
