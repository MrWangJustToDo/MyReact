import { Effect_TYPE, HOOK_TYPE, STATE_TYPE, exclude } from "@my-react/react-shared";

import { currentRenderDispatch } from "../share";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const effectHookNode = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  const renderDispatch = currentRenderDispatch.current;

  if (hookNode.hasEffect && (hookNode.effect as Effect_TYPE) === Effect_TYPE.__initial__) {
    hookNode.effect = Effect_TYPE.__effect__;

    if (hookNode.type === HOOK_TYPE.useEffect) {
      renderDispatch.pendingEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        if (hookNode._ownerFiber && exclude(hookNode._ownerFiber.state, STATE_TYPE.__unmount__)) hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        hookNode.effect = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useLayoutEffect) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        hookNode.effect = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useInsertionEffect) {
      renderDispatch.pendingInsertionEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        hookNode.effect = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useImperativeHandle) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        // ref obj
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);
        // ref function
        if (hookNode.value && typeof hookNode.value === "function") hookNode.value(hookNode.reducer.call(null));

        hookNode.hasEffect = false;

        hookNode.effect = Effect_TYPE.__initial__;
      });
    }

    if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
      renderDispatch.pendingLayoutEffect(fiber, () => {
        hookNode.cancel && hookNode.cancel();

        const storeApi = hookNode.value;

        hookNode.cancel = storeApi.subscribe(() => hookNode._internalDispatch({ isForce: true }));

        hookNode.hasEffect = false;

        hookNode.effect = Effect_TYPE.__initial__;
      });
    }
  }
};
