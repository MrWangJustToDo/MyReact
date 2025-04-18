import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { include, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue, processNormalComponentUpdate } from "../processQueue";
import { listenerMap } from "../renderDispatch";
import { triggerUpdate } from "../renderUpdate";
import { setImmediateNextFiber } from "../runtimeUpdate";
import { devWarnWithFiber, NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { UpdateState } from "../processQueue";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "./instance";
import type { TriggerUpdateQueue } from "@my-react/react";

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
  } else {
    updateState = processNormalComponentUpdate(fiber);
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

      if (__DEV__ && updateState.callback) {
        devWarnWithFiber(
          fiber,
          `[@my-react/react] retrigger update current fiber with callback, this callback will never be called and this may cause a memory leak, please check your code`
        );
      }

      setImmediateNextFiber(fiber);

      return;
    }

    if (updateState.isSync) {
      if (updateState.isImmediate) {
        triggerUpdate(
          fiber,
          updateState.isSkip ? STATE_TYPE.__skippedSync__ : updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__,
          updateState.callback
        );
      } else {
        renderPlatform.microTask(function triggerSyncUpdateOnFiber() {
          triggerUpdate(
            fiber,
            updateState.isSkip ? STATE_TYPE.__skippedSync__ : updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__,
            updateState.callback
          );
        });
      }
    } else {
      if (updateState.isImmediate) {
        triggerUpdate(
          fiber,
          updateState.isSkip
            ? STATE_TYPE.__skippedConcurrent__
            : updateState.isForce
              ? STATE_TYPE.__triggerConcurrentForce__
              : STATE_TYPE.__triggerConcurrent__,
          updateState.callback
        );
      } else {
        renderPlatform.microTask(function triggerConcurrentUpdateOnFiber() {
          triggerUpdate(
            fiber,
            updateState.isSkip
              ? STATE_TYPE.__skippedConcurrent__
              : updateState.isForce
                ? STATE_TYPE.__triggerConcurrentForce__
                : STATE_TYPE.__triggerConcurrent__,
            updateState.callback
          );
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

const SkipState = merge(STATE_TYPE.__skippedSync__, STATE_TYPE.__skippedConcurrent__);

export const triggerUpdateOnFiber = (fiber: MyReactFiberNode, state?: STATE_TYPE, callback?: () => void) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const updater: TriggerUpdateQueue = {
    type: UpdateQueueType.trigger,
    trigger: fiber,
    isSync: include(state, SyncState),
    isForce: include(state, ForceState),
    isSkip: include(state, SkipState),
    isImmediate: true,
    isRetrigger: false,
    callback,
  };

  renderPlatform.dispatchState(updater);
};
