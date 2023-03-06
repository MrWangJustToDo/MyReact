import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import type { DomElement } from "./dom";
import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.patch & PATCH_TYPE.__pendingRef__) {
    if (_fiber.type & NODE_TYPE.__isPlainNode__) {
      const typedElement = _fiber.element as MyReactElement;
      if (_fiber.node) {
        const typedNode = _fiber.node as DomElement;
        const ref = typedElement.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = typedNode;
        } else if (typeof ref === "function") {
          ref(typedNode);
        }
      } else {
        throw new Error("plain element do not have a native node");
      }
    }
    if (_fiber.type & NODE_TYPE.__isClassComponent__) {
      const typedElement = _fiber.element as MyReactElement;
      if (_fiber.instance) {
        const ref = typedElement.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = _fiber.instance;
        } else if (typeof ref === "function") {
          ref(_fiber.instance);
        }
      } else {
        throw new Error("class component do not have a instance");
      }
    }
    if (_fiber.patch & PATCH_TYPE.__pendingAppend__) _fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  }
};

export const unsetRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.ref && _fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
    const ref = _fiber.ref;
    if (typeof ref === "object" && ref !== null) {
      ref.current = null;
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-types
        (ref as Function)(null);
      } catch {
        void 0;
      }
    }
  }
};
