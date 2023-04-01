import { NODE_TYPE } from "@my-react/react-reconciler";

import { isProperty, isStyle } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const validDomProps = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const props = fiber.pendingProps;

    const renderPlatform = fiber.container.renderPlatform;

    Object.keys(props).forEach((key) => {
      if (isProperty(key) && typeof props[key] === "object" && props[key] !== null) {
        renderPlatform.log({
          fiber,
          level: "warn",
          triggerOnce: true,
          message: `invalid dom props, expect a string or number but get a object. key: ${key} value: ${props[key]}`,
        });
      }
      if (isStyle(key) && typeof props[key] !== "object") {
        throw new Error("style or the element props should be a object");
      }
    });

    if (props["children"] && props["dangerouslySetInnerHTML"]) {
      throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current element");
    }

    if (props["dangerouslySetInnerHTML"]) {
      if (typeof props["dangerouslySetInnerHTML"] !== "object" || typeof props["dangerouslySetInnerHTML"].__html !== "string") {
        throw new Error(`invalid "dangerouslySetInnerHTML" props, should be a object like {__html: string}`);
      }
    }
  }
};
