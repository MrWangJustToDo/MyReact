// for invalid dom structure
import { NODE_TYPE } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react";
import type { ClientDomPlatform } from "@my-react-dom-client/renderPlatform";

// TODO
export const validDomNesting = (fiber: MyReactFiberNode) => {
  if (__DEV__ && fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElementType = fiber.elementType;

    const renderPlatform = fiber.root.renderPlatform as ClientDomPlatform;

    const parentFiberWithDom = renderPlatform.elementMap.get(fiber).parentFiberWithNode;

    if (typedElementType === "p" && parentFiberWithDom.elementType === "p") {
      renderPlatform.log({
        fiber,
        level: "warn",
        triggerOnce: true,
        message: `invalid dom nesting: <p> cannot appear as a child of <p>`,
      });
    }
  }
};