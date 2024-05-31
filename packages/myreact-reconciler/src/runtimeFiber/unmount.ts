import { __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, include } from "@my-react/react-shared";

import { fiberToDispatchMap, safeCallWithFiber } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { CustomRenderDispatch } from "../renderDispatch";

const { enableDebugFiled } = __my_react_shared__;

export const unmountFiberNode = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  safeCallWithFiber({ fiber, action: () => renderDispatch.commitUnsetRef(fiber) });

  safeCallWithFiber({ fiber, action: () => renderDispatch.commitClear(fiber) });

  safeCallWithFiber({ fiber, action: () => renderDispatch.patchToFiberUnmount?.(fiber) });

  safeCallWithFiber({ fiber, action: () => renderDispatch._fiberUnmountListener.forEach((listener) => listener(fiber)) });

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
