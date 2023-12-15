import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { isHTMLTag, isProperty, isSVGTag, isStyle, logOnce } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

// TODO

/**
 * @internal
 */
export const validDomNesting = (fiber: MyReactFiberNode, parentFiberWithNode?: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const typedElementType = fiber.elementType;

    if (typedElementType === "p" && parentFiberWithNode?.elementType === "p") {
      logOnce(fiber, "warn", "invalid dom nesting: <p> cannot appear as a child of <p>", `invalid dom nesting: <p> cannot appear as a child of <p>`);
    }
  }
};

/**
 * @internal
 */
export const validDomTag = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const tagName = fiber.elementType as string;

    if (!isHTMLTag[tagName] && !isSVGTag[tagName]) {
      logOnce(fiber, "error", "invalid dom tag", `invalid dom tag, current is "${tagName}"`);
    }
  }
};

/**
 * @internal
 */
export const validDomProps = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const props = fiber.pendingProps;

    Object.keys(props).forEach((key) => {
      if (isProperty(key) && props[key] && typeof props[key] === "object" && props[key] !== null) {
        logOnce(
          fiber,
          "warn",
          "invalid dom props, expect a string or number but get a object.",
          `invalid dom props, expect a string or number but get a object. key: ${key} value: ${props[key]}`
        );
      }
      if (isStyle(key) && props[key] && typeof props[key] !== "object") {
        throw new Error("[@my-react/react-dom] style or the element props should be a object");
      }
    });

    if (props["children"] && props["dangerouslySetInnerHTML"]) {
      throw new Error("[@my-react/react-dom] can not render contain `children` and `dangerouslySetInnerHTML` for current element");
    }

    if (props["dangerouslySetInnerHTML"]) {
      if (typeof props["dangerouslySetInnerHTML"] !== "object" || typeof props["dangerouslySetInnerHTML"].__html !== "string") {
        throw new Error(`[@my-react/react-dom] invalid "dangerouslySetInnerHTML" props, should be a object like {__html: string}`);
      }
    }
  }
};

/**
 * @internal
 */
export const checkRoot = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__)) return;

  if (include(fiber.type, NODE_TYPE.__function__)) return;

  if (include(fiber.type, NODE_TYPE.__portal__)) return;

  return;

  // throw new Error(`[@my-react/react-dom] the root element should be a dynamic node such as 'function' or 'class'`)
};
