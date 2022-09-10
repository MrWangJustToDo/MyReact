import { Effect_TYPE } from "../internal";
import { globalDispatch } from "../share";

import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "./instance";

export const effect = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode |= Effect_TYPE.__pendingEffect__;

    if (hookNode.hookType === "useEffect") {
      globalDispatch.current.pendingEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.hookType === "useLayoutEffect") {
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber?.mount) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.hookType === "useImperativeHandle") {
      globalDispatch.current.pendingLayoutEffect(fiber, () => {
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
