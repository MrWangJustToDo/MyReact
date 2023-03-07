// for invalid dom structure
import { NODE_TYPE } from "@my-react/react-shared";

import { log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";

// TODO
export const validDomNesting = (fiber: MyReactFiberNode) => {
  if (__DEV__ && fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElementType = fiber.elementType;

    if (typedElementType === "p") {
      let parent = fiber.parent;

      while (parent && parent.type & NODE_TYPE.__isPlainNode__) {
        const typedParentElementType = parent.elementType;

        if (typedParentElementType === "p") {
          log({
            fiber,
            level: "warn",
            triggerOnce: true,
            message: `invalid dom nesting: <p> cannot appear as a child of <p>`,
          });
        }
        parent = parent.parent;
      }
    }
  }
};
