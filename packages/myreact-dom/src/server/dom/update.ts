import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { getHTMLAttrKey, getSVGAttrKey, isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { TextElement } from "./native";

import type { PlainElement } from "./native/plain";
import type { MyReactFiberNode } from "@my-react/react";

export const update = (fiber: MyReactFiberNode, isSVG?: boolean) => {
  if (fiber.patch & PATCH_TYPE.__pendingUpdate__) {
    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      const dom = fiber.node as PlainElement;
      const props = fiber.pendingProps || {};
      Object.keys(props).forEach((key) => {
        if (isProperty(key)) {
          if (key === "className") {
            dom[key] = props[key] as string;
          } else {
            const attrKey = isSVG ? getSVGAttrKey(key) : getHTMLAttrKey(key) || key;
            dom.setAttribute(attrKey as string, props[key] as string);
          }
        }
        if (isStyle(key)) {
          const typedProps = (props[key] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === "number") {
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

    if (fiber.patch & PATCH_TYPE.__pendingUpdate__) fiber.patch ^= PATCH_TYPE.__pendingUpdate__;
  }
};
