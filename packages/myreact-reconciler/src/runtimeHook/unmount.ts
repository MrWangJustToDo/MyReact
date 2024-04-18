import { unmountInstance } from "../runtimeGenerate";
import { safeCallWithFiber } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const hookNodeUnmount = (hookNode: MyReactHookNode) => {
  hookNode.hasEffect = false;

  hookNode.cancel && hookNode.cancel();

  unmountInstance(hookNode);
};

export const hookListUnmount = (fiber: MyReactFiberNode) => {
  fiber.hookList?.listToFoot?.((hookNode) => safeCallWithFiber({ fiber, action: () => hookNodeUnmount(hookNode as MyReactHookNode) }));
};
