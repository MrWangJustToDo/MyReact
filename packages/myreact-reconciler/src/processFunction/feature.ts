import { __my_react_internal__, cache, createElement } from "@my-react/react";
import { include, isPromise, SERVER_REFERENCE_SYMBOL, STATE_TYPE, TYPEKEY } from "@my-react/react-shared";

import { NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { forwardRef, MixinMyReactFunctionComponent, MyReactElementNode } from "@my-react/react";

const { currentHookTreeNode, currentHookNodeIndex, currentScheduler, cacheLazy } = __my_react_internal__;

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
          if (typedElementTypeWithRef[TYPEKEY] === SERVER_REFERENCE_SYMBOL) {
            const cacheFun = cache(typedElementTypeWithRef);

            re = cacheFun(fiber.pendingProps, fiber.ref);

            // support rsc
            // rsc return promise, so we transform promise to lazy, and try to keep the lazy stable
            if (isPromise(re)) return createElement(cacheLazy(re));
          } else {
            re = typedElementTypeWithRef(fiber.pendingProps, fiber.ref);
          }
        } catch (e) {
          if (isPromise(e)) {
            const currentIsTrigger = include(fiber.state, triggerState);
            if (currentIsTrigger) {
              re = currentScheduler.current?.dispatchSuspensePromise?.({ fiber, promise: e });
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
          if (typedElementType[TYPEKEY] === SERVER_REFERENCE_SYMBOL) {
            const cacheFun = cache(typedElementType);

            re = cacheFun(fiber.pendingProps);

            // support rsc
            if (isPromise(re)) return createElement(cacheLazy(re));
          } else {
            re = typedElementType(fiber.pendingProps);
          }
        } catch (e) {
          if (isPromise(e)) {
            const currentIsTrigger = include(fiber.state, triggerState);
            if (currentIsTrigger) {
              re = currentScheduler.current?.dispatchSuspensePromise?.({ fiber, promise: e });
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
