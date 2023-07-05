import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.patch & PATCH_TYPE.__ref__) {
    if (_fiber.type & NODE_TYPE.__plain__) {
      if (_fiber.nativeNode) {
        const ref = _fiber.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = _fiber.nativeNode;
        } else if (typeof ref === "function") {
          ref(_fiber.nativeNode);
        }
      } else {
        throw new Error("plain element do not have a native node");
      }
    }
    if (_fiber.type & NODE_TYPE.__class__) {
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
    if (_fiber.patch & PATCH_TYPE.__ref__) _fiber.patch ^= PATCH_TYPE.__ref__;
  }
};

/**
 * @internal
 */
export const unsetRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.state & STATE_TYPE.__unmount__) return;

  if (_fiber.ref && _fiber.type & (NODE_TYPE.__plain__ | NODE_TYPE.__class__)) {
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
