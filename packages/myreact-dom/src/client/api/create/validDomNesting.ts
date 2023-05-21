// for invalid dom structure
import { NODE_TYPE } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

// TODO
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
