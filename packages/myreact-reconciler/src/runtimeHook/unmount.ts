import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { unmountInstance } from "../runtimeGenerate";
import { getCurrentDispatchFromFiber, safeCallWithFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const hookNodeUnmount = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  hookNode.hasEffect = false;

  hookNode.cancel && hookNode.cancel();

  safeCallWithFiber({ fiber, action: () => listenerMap.get(renderDispatch)?.hookUnmount?.forEach((cb) => cb(hookNode)) });

  unmountInstance(hookNode);
};

export const hookListUnmount = (fiber: MyReactFiberNode) => {
  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  fiber.hookList?.listToFoot?.((hookNode) => safeCallWithFiber({ fiber, action: () => hookNodeUnmount(renderDispatch, fiber, hookNode as MyReactHookNode) }));
};
