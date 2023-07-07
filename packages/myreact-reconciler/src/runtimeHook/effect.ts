import { Effect_TYPE, HOOK_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { currentRenderDispatch } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const effectHookNode = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  const renderDispatch = currentRenderDispatch.current;

  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode = Effect_TYPE.__effect__;

    if (hookNode.type === HOOK_TYPE.useEffect) {
      renderDispatch.pendingEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (!(hookNode._ownerFiber.state & STATE_TYPE.__unmount__)) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useLayoutEffect) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useInsertionEffect) {
      renderDispatch.pendingInsertionEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useImperativeHandle) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        // ref obj
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);
        // ref function
        if (hookNode.value && typeof hookNode.value === "function") hookNode.value(hookNode.reducer.call(null));

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        const storeApi = hookNode.value;

        hookNode.cancel = storeApi.subscribe(() => hookNode._ownerFiber?._update?.(STATE_TYPE.__triggerConcurrent__));

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
