import { NODE_TYPE, safeCallWithFiber } from "@my-react/react-reconciler";
import { PATCH_TYPE, STATE_TYPE, include, remove } from "@my-react/react-shared";

import { log } from "./debug";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setRef = (_fiber: MyReactFiberNode) => {
  if (include(_fiber.patch, PATCH_TYPE.__ref__)) {
    if (include(_fiber.type, NODE_TYPE.__plain__)) {
      if (_fiber.nativeNode) {
        const ref = _fiber.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = _fiber.nativeNode;
        } else if (typeof ref === "function") {
          safeCallWithFiber({ fiber: _fiber, action: () => ref(_fiber.nativeNode) });
        }
      } else {
        throw new Error("[@my-react/react-dom] plain element do not have a native node");
      }
    } else if (include(_fiber.type, NODE_TYPE.__class__)) {
      if (_fiber.instance) {
        const ref = _fiber.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = _fiber.instance;
        } else if (typeof ref === "function") {
          safeCallWithFiber({ fiber: _fiber, action: () => ref(_fiber.instance) });
        }
      } else {
        throw new Error("[@my-react/react-dom] class component do not have a instance");
      }
    } else {
      log(_fiber, "error", "can not set ref for current element");
    }

    _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__ref__);
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
    } else if (typeof ref === "function") {
      safeCallWithFiber({ fiber: _fiber, action: () => ref(null) });
    }
  }
};
