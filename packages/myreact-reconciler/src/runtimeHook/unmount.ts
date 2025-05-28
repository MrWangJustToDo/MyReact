import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { unmountInstance } from "../runtimeGenerate";
import { safeCallWithCurrentFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const hookListUnmount = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  fiber.hookList?.listToFoot?.(function invokeHookUnmount(hookNode) {
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallHookUnmountListener() {
        listenerMap.get(renderDispatch)?.hookUnmount?.forEach((cb) => cb(hookNode as MyReactHookNode, fiber));
      },
    });

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallHookNodeUnmount() {
        hookNode.hasEffect = false;

        hookNode.cancel && hookNode.cancel();

        unmountInstance(hookNode);
      },
    });
  });
};
