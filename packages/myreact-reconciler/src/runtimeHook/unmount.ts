import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { unmountInstance } from "../runtimeGenerate";
import { safeCallWithFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const hookListUnmount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  fiber.hookList?.listToFoot?.(function invokeHookUnmount(hookNode) {
    safeCallWithFiber({
      fiber,
      action: function safeCallHookUnmountListener() {
        listenerMap.get(renderDispatch)?.hookUnmount?.forEach((cb) => cb(hookNode as MyReactHookNode));
      },
    });
    safeCallWithFiber({
      fiber,
      action: function safeCallHookNodeUnmount() {
        hookNode.hasEffect = false;

        hookNode.cancel && hookNode.cancel();

        unmountInstance(hookNode);
      },
    });
  });
};
