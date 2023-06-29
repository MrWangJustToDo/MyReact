import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { isProperty, isStyle, isUnitlessNumber, propsToAttrMap, validDomProps } from "../shared";

import { TextElement, appendChildNode } from "./native";

import type { PlainElement } from "./native";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const update = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__update__) {
    if (__DEV__) validDomProps(fiber);

    if (fiber.type & NODE_TYPE.__plain__) {
      const dom = fiber.nativeNode as PlainElement;
      const props = fiber.pendingProps || {};
      Object.keys(props).forEach((key) => {
        if (isProperty(key)) {
          if (props[key] !== null && props[key] !== undefined) {
            const attrKey = propsToAttrMap[key] || key;
            dom.setAttribute(attrKey as string, props[key] as string);
          }
        }
        if (isStyle(key)) {
          const typedProps = (props[key] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (typedProps[styleName] !== null && typedProps !== undefined) {
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
          appendChildNode(dom, new TextElement(typedProps.__html as string));
        }
      }
    }

    if (fiber.patch & PATCH_TYPE.__update__) fiber.patch ^= PATCH_TYPE.__update__;
  }
};
