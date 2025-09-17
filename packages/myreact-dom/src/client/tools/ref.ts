import { NODE_TYPE, safeCallWithCurrentFiber } from "@my-react/react-reconciler";
import { PATCH_TYPE, STATE_TYPE, include, remove } from "@my-react/react-shared";

import { domListenersMap, type ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { logOnce } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setRef = (renderDispatch: ClientDomDispatch, _fiber: MyReactFiberNode) => {
  if (include(_fiber.patch, PATCH_TYPE.__ref__)) {
    const cleanUp = () => {
      const refPrevious = _fiber.refPrevious;
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallRefPrevious() {
          if (typeof refPrevious === "object" && refPrevious !== null) {
            refPrevious.current = null;
          } else if (typeof refPrevious === "function") {
            refPrevious?.(null);
          }
        },
      });
      _fiber.refPrevious = undefined;
      const refCleanup = _fiber.refCleanup;
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallRefCleanup() {
          if (typeof refCleanup === "function") {
            refCleanup();
          }
        },
      });
      _fiber.refCleanup = undefined;
    };
    if (include(_fiber.type, NODE_TYPE.__plain__)) {
      if (_fiber.nativeNode) {
        cleanUp();
        const ref = _fiber.ref;
        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallSetRef() {
            if (typeof ref === "object" && ref !== null) {
              ref.current = _fiber.nativeNode;
            } else if (typeof ref === "function") {
              const cleanUp = ref(_fiber.nativeNode);
              if (typeof cleanUp === "function") {
                _fiber.refCleanup = cleanUp;
              }
            }
          },
        });
      } else {
        throw new Error("[@my-react/react-dom] plain element do not have a native node");
      }
    } else if (include(_fiber.type, NODE_TYPE.__class__)) {
      if (_fiber.instance) {
        cleanUp();
        const ref = _fiber.ref;
        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallSetRef() {
            if (typeof ref === "object" && ref !== null) {
              ref.current = _fiber.instance;
            } else if (typeof ref === "function") {
              const cleanUp = ref(_fiber.instance);
              if (typeof cleanUp === "function") {
                _fiber.refCleanup = cleanUp;
              }
            }
          },
        });
      } else {
        throw new Error("[@my-react/react-dom] class component do not have a instance");
      }
    } else {
      logOnce(_fiber, "error", "can not set ref for current element", "can not set ref for current element");
    }

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallPatchToCommitSetRef() {
        renderDispatch.patchToCommitSetRef?.(_fiber);
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallDomSetRefListener() {
        domListenersMap.get(renderDispatch)?.domSetRef?.forEach((listener) => listener(_fiber));
      },
    });

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
