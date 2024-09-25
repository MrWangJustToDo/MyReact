import { __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { classComponentUnmount } from "../runtimeComponent";
import { hookListUnmount } from "../runtimeHook";
import { fiberToDispatchMap, safeCallWithFiber } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";

const { enableDebugFiled } = __my_react_shared__;

export const unmountFiberNode = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  hookListUnmount(fiber, renderDispatch);

  classComponentUnmount(fiber, renderDispatch);

  safeCallWithFiber({
    fiber,
    action: function safeCallCommitUnsetRef() {
      renderDispatch.commitUnsetRef(fiber);
    },
  });

  safeCallWithFiber({
    fiber,
    action: function safeCallCommitClear() {
      renderDispatch.commitClear(fiber);
    },
  });

  safeCallWithFiber({
    fiber,
    action: function safeCallPatchToFiberUnmount() {
      renderDispatch.patchToFiberUnmount?.(fiber);
    },
  });

  safeCallWithFiber({
    fiber,
    action: function safeCallFiberUnmountListener() {
      listenerMap.get(renderDispatch)?.fiberUnmount?.forEach((listener) => listener(fiber));
    },
  });

  __DEV__ ? "" : fiberToDispatchMap.delete(fiber);

  renderDispatch.runtimeMap.suspenseMap.delete(fiber);

  renderDispatch.runtimeMap.strictMap.delete(fiber);

  renderDispatch.runtimeMap.insertionEffectMap.delete(fiber);

  renderDispatch.runtimeMap.scopeMap.delete(fiber);

  renderDispatch.runtimeMap.errorBoundariesMap.delete(fiber);

  renderDispatch.runtimeMap.effectMap.delete(fiber);

  renderDispatch.runtimeMap.layoutEffectMap.delete(fiber);

  renderDispatch.runtimeMap.contextMap.delete(fiber);

  renderDispatch.runtimeMap.unmountMap.delete(fiber);

  renderDispatch.runtimeMap.eventMap.delete(fiber);

  if (Boolean(__DEV__) === false) {
    fiber.child = null;

    fiber.parent = null;

    fiber.sibling = null;

    fiber.instance = null;

    fiber.hookList = null;

    fiber.dependence = null;

    fiber.nativeNode = null;

    fiber.updateQueue = null;
  }

  fiber.patch = PATCH_TYPE.__initial__;

  fiber.state = STATE_TYPE.__unmount__;

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugIsMount = false;

    delete typedFiber._debugContextMap;

    delete typedFiber._debugSuspense;

    delete typedFiber._debugStrict;

    delete typedFiber._debugScope;

    delete typedFiber._debugEventMap;

    delete typedFiber._debugUpdateQueue;
  }
};
