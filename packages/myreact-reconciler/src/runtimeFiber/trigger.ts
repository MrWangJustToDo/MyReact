import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { include, merge, remove, STATE_TYPE, UpdateQueueType } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue, processNormalComponentUpdate } from "../processQueue";
import { listenerMap } from "../renderDispatch";
import { triggerUpdate } from "../renderUpdate";
import { mountLoopAllFromScheduler } from "../runtimeMount";
import { NODE_TYPE, safeCallWithCurrentFiber } from "../share";

import type { UpdateState } from "../processQueue";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "./instance";
import type { TriggerUpdateQueue } from "@my-react/react";

const { enableConcurrentMode } = __my_react_shared__;

const { currentScheduler } = __my_react_internal__;

const processUpdateOnFiber = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, _isImmediate: boolean, _isRetrigger: boolean) => {
  const renderScheduler = currentScheduler.current;

  const flag = enableConcurrentMode.current;

  let updateState: UpdateState | null = null;

  if (include(fiber.type, NODE_TYPE.__class__)) {
    updateState = processClassComponentUpdateQueue(renderDispatch, fiber, flag);
  } else if (include(fiber.type, NODE_TYPE.__function__)) {
    updateState = processFunctionComponentUpdateQueue(renderDispatch, fiber, flag);
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

      if (updateState.callback) {
        renderDispatch.pendingLayoutEffect(fiber, updateState.callback, { stickyToFoot: true });
      }

      renderDispatch.runtimeFiber.retriggerFiber = fiber;

      // render flow is done, here should trigger a new render flow
      if (!renderDispatch.runtimeFiber.nextWorkingFiber) {
        renderDispatch.runtimeFiber.nextWorkingFiber = fiber;

        mountLoopAllFromScheduler(renderDispatch);
      }

      return;
    }

    if (updateState.isSync) {
      if (updateState.isImmediate) {
        triggerUpdate(
          renderDispatch,
          fiber,
          updateState.isSkip ? STATE_TYPE.__skippedSync__ : updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__,
          updateState.callback
        );
      } else {
        renderScheduler.microTask(function triggerSyncUpdateOnFiber() {
          triggerUpdate(
            renderDispatch,
            fiber,
            updateState.isSkip ? STATE_TYPE.__skippedSync__ : updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__,
            updateState.callback
          );
        });
      }
    } else {
      if (updateState.isImmediate) {
        triggerUpdate(
          renderDispatch,
          fiber,
          updateState.isSkip
            ? STATE_TYPE.__skippedConcurrent__
            : updateState.isForce
              ? STATE_TYPE.__triggerConcurrentForce__
              : STATE_TYPE.__triggerConcurrent__,
          updateState.callback
        );
      } else {
        renderScheduler.microTask(function triggerConcurrentUpdateOnFiber() {
          triggerUpdate(
            renderDispatch,

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

export const prepareUpdateOnFiber = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, isImmediate: boolean, isRetrigger: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderScheduler = currentScheduler.current;

  if (isImmediate) {
    processUpdateOnFiber(renderDispatch, fiber, isImmediate, isRetrigger);
  } else {
    renderScheduler.microTask(function asyncProcessUpdateOnFiber() {
      processUpdateOnFiber(renderDispatch, fiber, isImmediate, isRetrigger);
    });
  }
};

const SyncState = merge(STATE_TYPE.__triggerSyncForce__, merge(STATE_TYPE.__skippedSync__, STATE_TYPE.__triggerSync__));

const ForceState = merge(STATE_TYPE.__triggerSyncForce__, STATE_TYPE.__triggerConcurrentForce__);

const SkipState = merge(STATE_TYPE.__skippedSync__, STATE_TYPE.__skippedConcurrent__);

export const triggerUpdateOnFiber = (fiber: MyReactFiberNode, state?: STATE_TYPE, callback?: () => void) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderScheduler = currentScheduler.current;

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

  renderScheduler.dispatchState(updater);
};
