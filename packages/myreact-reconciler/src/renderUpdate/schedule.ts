import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { exclude, STATE_TYPE, include } from "@my-react/react-shared";

import { currentTriggerFiber } from "../share";

import { updateSyncFromRoot, updateConcurrentFromRoot, updateSyncFromTrigger, updateConcurrentFromTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode, enableLoopFromRoot } = __my_react_shared__;

const scheduleUpdateFromRoot = (renderDispatch: CustomRenderDispatch) => {
  const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => exclude(f.state, STATE_TYPE.__unmount__));

  renderDispatch.pendingUpdateFiberArray.clear();

  if (allLive.length) {
    renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

    if (__DEV__) currentTriggerFiber.current = renderDispatch.rootFiber;

    if (
      !enableConcurrentMode.current ||
      allLive.some((f) => include(f.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__))
    ) {
      updateSyncFromRoot(renderDispatch);
    } else {
      updateConcurrentFromRoot(renderDispatch);
    }
  } else {
    if (__DEV__) currentTriggerFiber.current = null;

    scheduleNext(renderDispatch);
  }
};

const scheduleUpdateFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  const allPending = renderDispatch.pendingUpdateFiberArray.getAll();

  let nextWorkFiber: MyReactFiberNode | null = null;

  for (let i = 0; i < allPending.length; i++) {
    const item = allPending[i];

    if (include(item.state, STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) {
      renderDispatch.pendingUpdateFiberArray.uniDelete(item);
      continue;
    } else {
      nextWorkFiber = item;
      break;
    }
  }

  if (nextWorkFiber) {
    if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__)) {
      renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

      if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

      // normally a context update
      if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__)) {
        updateSyncFromRoot(renderDispatch);
      } else {
        // TODO maybe could use `updateSyncFromRoot`?
        updateSyncFromTrigger(renderDispatch);
      }
    } else if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__ | STATE_TYPE.__triggerConcurrent__ | STATE_TYPE.__triggerConcurrentForce__)) {
      renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

      if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

      if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__)) {
        if (enableConcurrentMode.current) {
          updateConcurrentFromRoot(renderDispatch);
        } else {
          updateSyncFromRoot(renderDispatch);
        }
      } else {
        if (enableConcurrentMode.current) {
          updateConcurrentFromTrigger(renderDispatch);
        } else {
          updateSyncFromTrigger(renderDispatch);
        }
      }
    } else {
      // TODO
      throw new Error(`[@my-react/react] unknown state, ${nextWorkFiber.state}, this like a bug for @my-react`);
    }
  } else {
    if (__DEV__) currentTriggerFiber.current = null;

    scheduleNext(renderDispatch);
  }
};

export const scheduleNext = (renderDispatch: CustomRenderDispatch) => {
  if (!renderDispatch.isAppUnmounted && !renderDispatch.isAppCrashed && renderDispatch.enableUpdate && renderDispatch.pendingUpdateFiberArray.length) {
    scheduleUpdate(renderDispatch);
    return;
  }

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  if (!renderPlatform.dispatchSet || renderPlatform.dispatchSet?.length === 1) return;

  const allDispatch = renderPlatform.dispatchSet;

  const hasPending = allDispatch
    .getAll()
    .find((d) => d !== renderDispatch && d.isAppMounted && d.enableUpdate && !d.isAppCrashed && !d.isAppUnmounted && d.pendingUpdateFiberArray.length);

  if (hasPending) {
    scheduleUpdate(hasPending);
  } else {
    globalLoop.current = false;
  }
};

export const scheduleUpdate = (renderDispatch: CustomRenderDispatch) => {
  if (renderDispatch.isAppUnmounted) {
    scheduleNext(renderDispatch);
    return;
  }

  if (enableLoopFromRoot.current) {
    scheduleUpdateFromRoot(renderDispatch);
  } else {
    scheduleUpdateFromTrigger(renderDispatch);
  }
};
