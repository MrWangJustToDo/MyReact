import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.type & NODE_TYPE.__isPlainNode__) {
    if (_fiber.node) {
      const ref = _fiber.ref;
      if (typeof ref === "object" && ref !== null) {
        ref.current = _fiber.node;
      } else if (typeof ref === "function") {
        ref(_fiber.node);
      }
    } else {
      throw new Error("plain element do not have a native node");
    }
  }
  if (_fiber.type & NODE_TYPE.__isClassComponent__) {
    if (_fiber.instance) {
      const ref = _fiber.ref;
      if (typeof ref === "object" && ref !== null) {
        ref.current = _fiber.instance;
      } else if (typeof ref === "function") {
        ref(_fiber.instance);
      }
    } else {
      throw new Error("class component do not have a instance");
    }
  }
};

export const unsetRef = (_fiber: MyReactFiberNode) => {
  if (!_fiber.isMounted) return;

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
