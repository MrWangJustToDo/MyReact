import { NODE_TYPE } from "@my-react/react-reconciler";

import { isHTMLTag, isProperty, isSVGTag, isStyle, log } from "@my-react-dom-shared";

import type { MyReactFiberNode} from "@my-react/react-reconciler";

// TODO

/**
 * @internal
 */
export const validDomNesting = (fiber: MyReactFiberNode, parentFiberWithNode?: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const typedElementType = fiber.elementType;

    if (typedElementType === "p" && parentFiberWithNode?.elementType === "p") {
      log({
        fiber,
        level: "warn",
        triggerOnce: true,
        message: `invalid dom nesting: <p> cannot appear as a child of <p>`,
      });
    }
  }
};

/**
 * @internal
 */
export const validDomTag = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const tagName = fiber.elementType as string;

    if (!isHTMLTag[tagName] && !isSVGTag[tagName]) {
      log({ fiber, level: "error", triggerOnce: true, message: `invalid dom tag, current is ${tagName}` });
    }
  }
};

/**
 * @internal
 */
export const validDomProps = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const props = fiber.pendingProps;

    Object.keys(props).forEach((key) => {
      if (isProperty(key) && props[key] && typeof props[key] === "object" && props[key] !== null) {
        log({
          fiber,
          level: "warn",
          triggerOnce: true,
          message: `invalid dom props, expect a string or number but get a object. key: ${key} value: ${props[key]}`,
        });
      }
      if (isStyle(key) && props[key] && typeof props[key] !== "object") {
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

/**
 * @internal
 */
export const checkRoot = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__class__) return;

  if (fiber.type & NODE_TYPE.__function__) return;

  if (fiber.type & NODE_TYPE.__portal__) return;

  return;

  // throw new Error(`[@my-react/react-dom] the root element should be a dynamic node such as 'function' or 'class'`)
}