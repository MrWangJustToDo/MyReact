import { NODE_TYPE } from "@my-react/react-reconciler";

import { isHTMLTag, isSVGTag, log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const validDomTag = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const tagName = fiber.elementType as string;

    if (!isHTMLTag[tagName] && !isSVGTag[tagName]) {
      log({ fiber, level: "error", triggerOnce: true, message: `invalid dom tag, current is ${tagName}` });
    }
  }
};
