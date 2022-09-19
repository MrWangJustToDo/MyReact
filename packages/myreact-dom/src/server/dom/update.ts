import { __my_react_internal__ } from "@my-react/react";

import { isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@my-react-dom-shared";

import { TextElement } from "./text";

import type { PlainElement } from "./plain";
import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export const update = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingUpdate__) {
    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      const dom = fiber.node as PlainElement;
      const props = fiber.pendingProps || {};
      Object.keys(props)
        .filter(isProperty)
        .forEach((key) => {
          if (key === "className") {
            dom[key] = props[key] as string;
          } else {
            dom.setAttribute(key, props[key] as string);
          }
        });
      Object.keys(props)
        .filter(isStyle)
        .forEach((styleKey) => {
          const typedProps = (props[styleKey] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (!Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) && typeof typedProps[styleName] === "number") {
              dom[styleKey][styleName] = `${typedProps[styleName]}px`;
              return;
            }
            dom[styleKey][styleName] = typedProps[styleName];
          });
        });
      if (props["dangerouslySetInnerHTML"]) {
        const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;
        dom.append(new TextElement(typedProps.__html as string));
      }
    }

    if (fiber.patch & PATCH_TYPE.__pendingUpdate__) fiber.patch ^= PATCH_TYPE.__pendingUpdate__;
  }
};
