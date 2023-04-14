import { __my_react_shared__ } from "@my-react/react";
import { Effect_TYPE, HOOK_TYPE, STATE_TYPE } from "@my-react/react-shared";

import type { MyReactHookNode } from "./instance";
import type { MyReactFiberNode } from "../runtimeFiber";

const { enableStrictLifeCycle } = __my_react_shared__;

export const effectHookNode = (fiber: MyReactFiberNode, hookNode: MyReactHookNode) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  if (hookNode.effect && hookNode.mode === Effect_TYPE.__initial__) {
    hookNode.mode = Effect_TYPE.__effect__;

    const ReactNewStrictMod = __DEV__ ? renderDispatch.resolveStrict(fiber) && enableStrictLifeCycle.current : false;

    if (hookNode.type === HOOK_TYPE.useEffect) {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        if (!(hookNode._ownerFiber.state & STATE_TYPE.__unmount__)) hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      renderDispatch.pendingEffect(fiber, () => {
        if (ReactNewStrictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.type === HOOK_TYPE.useLayoutEffect) {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      renderDispatch.pendingLayoutEffect(fiber, () => {
        if (ReactNewStrictMod) {
          update();
          update();
        } else {
          update();
        }
      });
    }

    if (hookNode.type === HOOK_TYPE.useInsertionEffect) {
      const update = () => {
        hookNode.cancel && hookNode.cancel();

        hookNode.cancel = hookNode.value();

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      };
      renderDispatch.pendingInsertionEffect(fiber, () => {
        if (ReactNewStrictMod) {
          update();
          update();
        } else {
          update();
        }
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

        hookNode.cancel = storeApi.subscribe(() => hookNode._ownerFiber._update(STATE_TYPE.__triggerConcurrent__));

        hookNode.effect = false;

        hookNode.mode = Effect_TYPE.__initial__;
      });
    }
  }
};
