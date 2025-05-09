import { PATCH_TYPE, STATE_TYPE, include, remove } from "@my-react/react-shared";

import { NODE_TYPE, safeCallWithCurrentFiber } from "../../share";

import type { MyReactFiberNode } from "../../runtimeFiber";

/**
 * @internal
 */
export const setRef = (_fiber: MyReactFiberNode, config: any) => {
  if (include(_fiber.patch, PATCH_TYPE.__ref__)) {
    if (include(_fiber.type, NODE_TYPE.__plain__)) {
      if (_fiber.nativeNode) {
        const ref = _fiber.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = config?.getPublicInstance?.(_fiber.nativeNode);
        } else if (typeof ref === "function") {
          safeCallWithCurrentFiber({
            fiber: _fiber,
            action: function safeCallSetRef() {
              _fiber.refCleanup?.();
              const refCleanUp = ref(config?.getPublicInstance?.(_fiber.nativeNode));
              if (typeof refCleanUp === "function") {
                _fiber.refCleanup = refCleanUp;
              }
            },
          });
        }
      } else {
        throw new Error("[@my-react/react] plain element do not have a native node");
      }
    } else if (include(_fiber.type, NODE_TYPE.__class__)) {
      if (_fiber.instance) {
        const ref = _fiber.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = config?.getPublicInstance?.(_fiber.instance);
        } else if (typeof ref === "function") {
          safeCallWithCurrentFiber({
            fiber: _fiber,
            action: function safeCallSetRef() {
              _fiber.refCleanup?.();
              const refCleanUp = ref(config?.getPublicInstance?.(_fiber.instance));
              if (typeof refCleanUp === "function") {
                _fiber.refCleanup = refCleanUp;
              }
            },
          });
        }
      } else {
        throw new Error("[@my-react/react-dom] class component do not have a instance");
      }
    } else {
      console.error("can not set ref for current element");
    }

    _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__ref__);
  }
};

/**
 * @internal
 */
export const unsetRef = (_fiber: MyReactFiberNode) => {
  if (include(_fiber.state, STATE_TYPE.__unmount__)) return;

  if (_fiber.ref && include(_fiber.type, NODE_TYPE.__plain__ | NODE_TYPE.__class__)) {
    const ref = _fiber.ref;
    if (typeof ref === "object" && ref !== null) {
      ref.current = null;
    } else if (typeof ref === "function") {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallClearRef() {
          if (_fiber.refCleanup) {
            _fiber.refCleanup();
          } else {
            ref(null);
          }
        },
      });
    }
  }
};
