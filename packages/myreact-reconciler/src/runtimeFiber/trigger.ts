import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { include, merge, remove, STATE_TYPE } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue, processLazyComponentUpdate } from "../processQueue";
import { listenerMap } from "../renderDispatch";
import { triggerUpdate } from "../renderUpdate";
import { setImmediateNextFiber } from "../runtimeUpdate";
import { NODE_TYPE, safeCallWithCurrentFiber, getCurrentDispatchFromFiber } from "../share";

import type { UpdateState } from "../processQueue";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "./instance";

const { enableConcurrentMode } = __my_react_shared__;

const { currentRenderPlatform } = __my_react_internal__;

const processUpdateOnFiber = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, _isImmediate: boolean, _isRetrigger: boolean) => {
  const renderPlatform = currentRenderPlatform.current;

  const flag = enableConcurrentMode.current;

  let updateState: UpdateState | null = null;

  if (include(fiber.type, NODE_TYPE.__class__)) {
    updateState = processClassComponentUpdateQueue(fiber, renderDispatch, flag);
  } else if (include(fiber.type, NODE_TYPE.__function__)) {
    updateState = processFunctionComponentUpdateQueue(fiber, renderDispatch, flag);
  } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
    updateState = processLazyComponentUpdate(fiber);
  } else {
    throw new Error("unknown runtime error, this is a bug for @my-react");
  }

  if (updateState?.needUpdate) {
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFiberTriggerListener() {
        listenerMap.get(renderDispatch)?.fiberTrigger?.forEach((cb) => cb(fiber, updateState));
      },
    });

    // TODO get from updateState ?
    if (updateState.isRetrigger) {
      fiber.state = remove(fiber.state, STATE_TYPE.__stable__);

      fiber.state = merge(fiber.state, STATE_TYPE.__retrigger__);

      setImmediateNextFiber(fiber);

      return;
    }

    if (updateState.isSync) {
      if (updateState.isImmediate) {
        triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__, updateState.callback);
      } else {
        renderPlatform.microTask(function triggerSyncUpdateOnFiber() {
          triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__, updateState.callback);
        });
      }
    } else {
      if (updateState.isImmediate) {
        triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerConcurrentForce__ : STATE_TYPE.__triggerConcurrent__, updateState.callback);
      } else {
        renderPlatform.microTask(function triggerConcurrentUpdateOnFiber() {
          triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerConcurrentForce__ : STATE_TYPE.__triggerConcurrent__, updateState.callback);
        });
      }
    }
  }
};

export const prepareUpdateOnFiber = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, isImmediate: boolean, isRetrigger: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  if (isImmediate) {
    processUpdateOnFiber(fiber, renderDispatch, isImmediate, isRetrigger);
  } else {
    renderPlatform.microTask(function asyncProcessUpdateOnFiber() {
      processUpdateOnFiber(fiber, renderDispatch, isImmediate, isRetrigger);
    });
  }
};

const SyncState = merge(STATE_TYPE.__triggerSyncForce__, merge(STATE_TYPE.__skippedSync__, STATE_TYPE.__triggerSync__));

const ForceState = merge(STATE_TYPE.__triggerSyncForce__, STATE_TYPE.__triggerConcurrentForce__);

// TODO
export const triggerUpdateOnFiber = (fiber: MyReactFiberNode, state?: STATE_TYPE) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const renderDispatch = getCurrentDispatchFromFiber(fiber);

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberTriggerListener() {
      listenerMap.get(renderDispatch)?.fiberTrigger?.forEach((cb) =>
        cb(fiber, {
          needUpdate: true,
          isSync: !!include(state, SyncState),
          isForce: !!include(state, ForceState),
        })
      );
    },
  });

  renderPlatform.microTask(function invokeTriggerUpdateOnFiber() {
    triggerUpdate(fiber, state);
  });
};
