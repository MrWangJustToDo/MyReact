import { Effect_TYPE, HOOK_TYPE, STATE_TYPE, exclude } from "@my-react/react-shared";

import { getInstanceOwnerFiber, setEffectForInstance } from "../runtimeGenerate";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { InstanceField } from "../runtimeGenerate";
import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

export const effectHookNode = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, hookNode: MyReactHookNode, field: InstanceField) => {
  const effect = field.effect;

  if (hookNode.hasEffect && effect === Effect_TYPE.__initial__) {
    setEffectForInstance(hookNode, Effect_TYPE.__effect__);

    if (hookNode.type === HOOK_TYPE.useEffect) {
      renderDispatch.pendingEffect(fiber, function invokeEffectOnHook() {
        hookNode.cancel && hookNode.cancel();

        const ownerFiber = getInstanceOwnerFiber(hookNode);

        if (ownerFiber && exclude(ownerFiber.state, STATE_TYPE.__unmount__)) hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        setEffectForInstance(hookNode, Effect_TYPE.__initial__);
      });
    }

    if (hookNode.type === HOOK_TYPE.useLayoutEffect) {
      renderDispatch.pendingLayoutEffect(fiber, function invokeLayoutEffectOnHook() {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        setEffectForInstance(hookNode, Effect_TYPE.__initial__);
      });
    }

    if (hookNode.type === HOOK_TYPE.useInsertionEffect) {
      renderDispatch.pendingInsertionEffect(fiber, function invokeInsertionEffectOnHook() {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.hasEffect = false;

        setEffectForInstance(hookNode, Effect_TYPE.__initial__);
      });
    }

    if (hookNode.type === HOOK_TYPE.useImperativeHandle) {
      renderDispatch.pendingLayoutEffect(fiber, function invokeLayoutEffectOnHook() {
        hookNode.cancel && hookNode.cancel();

        // ref obj
        if (hookNode.value && typeof hookNode.value === "object") hookNode.value.current = hookNode.reducer.call(null);
        // ref function
        if (hookNode.value && typeof hookNode.value === "function") hookNode.value(hookNode.reducer.call(null));

        // TODO
        // hookNode.cancel =

        hookNode.hasEffect = false;

        setEffectForInstance(hookNode, Effect_TYPE.__initial__);
      });
    }

    if (hookNode.type === HOOK_TYPE.useSyncExternalStore) {
      renderDispatch.pendingEffect(fiber, function invokeEffectOnHook() {
        hookNode.cancel && hookNode.cancel();

        const storeApi = hookNode.value;

        hookNode.cancel = storeApi.subscribe(function triggerHookUpdate() {
          hookNode._update({ payLoad: () => storeApi.getSnapshot.call(null) });
        });

        hookNode.hasEffect = false;

        setEffectForInstance(hookNode, Effect_TYPE.__initial__);
      });
    }
  }
};
