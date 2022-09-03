// for invalid dom structure
import { __myreact_shared__ } from "@my-react/react";

import { enableAllCheck } from "@ReactDOM_shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const log = __myreact_shared__.log;

// TODO
export const validDomNesting = (fiber: MyReactFiberNode) => {
  if (!enableAllCheck.current) return;
  if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as MyReactElement;
    if (typedElement.type === "p") {
      let parent = fiber.parent;
      while (parent && parent.__isPlainNode__) {
        const typedParentElement = parent.element as MyReactElement;
        if (typedParentElement.type === "p") {
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
