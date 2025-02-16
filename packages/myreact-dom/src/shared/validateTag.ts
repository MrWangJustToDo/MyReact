import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { isHTMLTag, isSVGTag } from "./elementTag";
import { logOnce } from "./log";

/**
 * @internal
 */
export const validDomTag = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    const tagName = fiber.elementType as string;

    if (!isHTMLTag[tagName] && !isSVGTag[tagName]) {
      // custom element
      if (!customElements.get(tagName)) {
        logOnce(fiber, "error", "invalid dom tag", `invalid dom tag, current is "${tagName}"`);
      }
    }
  }
};
