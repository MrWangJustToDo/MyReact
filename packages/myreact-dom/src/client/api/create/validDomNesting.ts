// for invalid dom structure
import { NODE_TYPE } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

// TODO
export const validDomNesting = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__plain__) {
    const typedElementType = fiber.elementType;

    const renderContainer = fiber.renderContainer;

    const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

    const parentFiberWithDom = renderDispatch.elementMap.get(fiber).parentFiberWithNode;

    if (typedElementType === "p" && parentFiberWithDom.elementType === "p") {
      log({
        fiber,
        level: "warn",
        triggerOnce: true,
        message: `invalid dom nesting: <p> cannot appear as a child of <p>`,
      });
    }
  }
};
