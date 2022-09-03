import { PlainElement } from "./plain";
import { TextElement } from "./text";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export const create = (fiber: MyReactFiberNode) => {
  if (fiber.__pendingCreate__) {
    if (fiber.__isTextNode__) {
      fiber.dom = new TextElement(fiber.element as string) as unknown as Element;
    } else if (fiber.__isPlainNode__) {
      const typedElement = fiber.element as MyReactElement;
      fiber.dom = new PlainElement(typedElement.type as string) as unknown as Element;
    } else {
      throw new Error("createPortal() can not call on the server");
    }
    fiber.__pendingCreate__ = false;
  }
};
