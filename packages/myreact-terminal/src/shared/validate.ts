import { NODE_TYPE } from "@my-react/react-reconciler";

import { log } from "./debug";
import { isValidTag } from "./elementTag";
import { isProperty, isStyle } from "./tools";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

// TODO

export const validDomNesting = (fiber: MyReactFiberNode, parentFiberWithNode?: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const typedElementType = fiber.elementType;

    if (parentFiberWithNode?.elementType === "terminal-text" && (typedElementType === "terminal-box" || typedElementType === "terminal-virtual-text")) {
      log({
        fiber,
        level: "warn",
        triggerOnce: true,
        message: `invalid element nesting: <${typedElementType}> cannot appear as a child of <terminal-text>`,
      });
    }
  }
};

export const validDomTag = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const tagName = fiber.elementType as string;

    if (!isValidTag[tagName]) {
      log({ fiber, level: "error", triggerOnce: true, message: `invalid element tag, current is ${tagName}` });
    }
  }
};

export const validDomProps = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const props = fiber.pendingProps;

    Object.keys(props).forEach((key) => {
      if (isProperty(key) && props[key] && typeof props[key] === "object" && props[key] !== null) {
        log({
          fiber,
          level: "warn",
          triggerOnce: true,
          message: `invalid element props, expect a string or number but get a object. key: ${key} value: ${props[key]}`,
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

export const checkRoot = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__class__) return;

  if (fiber.type & NODE_TYPE.__function__) return;

  throw new Error(`[@my-react/react-terminal] the root element should be a dynamic node such as 'function' or 'class'`);
};
