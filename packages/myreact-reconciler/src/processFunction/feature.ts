import { __my_react_internal__ } from "@my-react/react";
import { include, isPromise, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { forwardRef, MixinMyReactFunctionComponent, MyReactElementNode } from "@my-react/react";

const { currentHookTreeNode, currentHookNodeIndex, currentScheduler } = __my_react_internal__;

const triggerState =
  STATE_TYPE.__triggerSync__ |
  STATE_TYPE.__triggerSyncForce__ |
  STATE_TYPE.__triggerConcurrent__ |
  STATE_TYPE.__triggerConcurrentForce__ |
  STATE_TYPE.__retrigger__;

export const processFunction = (fiber: MyReactFiberNode) => {
  currentHookTreeNode.current = fiber.hookList?.head;

  currentHookNodeIndex.current = 0;

  const typedElementType = fiber.elementType as MixinMyReactFunctionComponent;

  let children: MyReactElementNode = null;

  if (include(fiber.type, NODE_TYPE.__forwardRef__)) {
    const typedElementTypeWithRef = typedElementType as ReturnType<typeof forwardRef>["render"];

    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallForwardRefFunctionalComponent() {
        let re = undefined;
        try {
          re = typedElementTypeWithRef(fiber.pendingProps, fiber.ref);
        } catch (e) {
          if (isPromise(e)) {
            const currentIsTrigger = include(fiber.state, triggerState);
            if (currentIsTrigger) {
              fiber.state = STATE_TYPE.__suspense__;
            } else {
              re = currentScheduler.current?.dispatchPromise?.({ fiber, promise: e });
            }
          } else {
            throw e;
          }
        }
        return re;
      },
    });
  } else {
    children = safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFunctionalComponent() {
        let re = undefined;
        try {
          re = typedElementType(fiber.pendingProps);
        } catch (e) {
          if (isPromise(e)) {
            const currentIsTrigger = include(fiber.state, triggerState);
            if (currentIsTrigger) {
              fiber.state = STATE_TYPE.__suspense__;
            } else {
              re = currentScheduler.current?.dispatchPromise?.({ fiber, promise: e });
            }
          } else {
            throw e;
          }
        }
        return re;
      },
    });
  }

  currentHookNodeIndex.current = 0;

  currentHookTreeNode.current = null;

  return children;
};
