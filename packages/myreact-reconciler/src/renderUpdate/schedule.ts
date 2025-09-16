import { __my_react_internal__ } from "@my-react/react";
import { exclude, STATE_TYPE, include } from "@my-react/react-shared";

import { flushEffectCallback } from "../dispatchEffect";
import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { currentTriggerFiber } from "../share";

import { updateSyncFromRoot, updateConcurrentFromRoot } from "./feature";
import { applyTriggerFiberCb } from "./trigger";

import type { UniqueArray } from "@my-react/react-shared";

const { globalLoop, currentScheduler } = __my_react_internal__;

const scheduleUpdateFromRoot = (renderDispatch: CustomRenderDispatch) => {
  flushEffectCallback();

  const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => exclude(f.state, STATE_TYPE.__unmount__));

  renderDispatch.pendingUpdateFiberArray.clear();

  if (allLive.length) {
    renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

    if (__DEV__) currentTriggerFiber.current = allLive.length > 1 ? allLive : allLive[0];

    allLive.forEach((fiber) => applyTriggerFiberCb(renderDispatch, fiber));

    if (!renderDispatch.enableConcurrentMode || allLive.some((f) => include(f.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__))) {
      if (__DEV__) {
        listenerMap.get(renderDispatch)?.beforeDispatchUpdate?.forEach((cb) => cb(renderDispatch, allLive));
      }

      updateSyncFromRoot(renderDispatch);
    } else {
      renderDispatch.resetYield();

      if (__DEV__) {
        listenerMap.get(renderDispatch)?.beforeDispatchUpdate?.forEach((cb) => cb(renderDispatch, allLive));
      }

      updateConcurrentFromRoot(renderDispatch);
    }
  } else {
    if (__DEV__) currentTriggerFiber.current = null;

    scheduleNext(renderDispatch);
  }
};

const scheduleOther = (renderDispatch: CustomRenderDispatch) => {
  const renderScheduler = currentScheduler.current;

  if (!renderScheduler.dispatchSet || renderScheduler.dispatchSet?.length === 1) return;

  const allDispatch = renderScheduler.dispatchSet as UniqueArray<CustomRenderDispatch>;

  const hasPending = allDispatch
    .getAll()
    .find((d) => d !== renderDispatch && d.isAppMounted && d.enableUpdate && !d.isAppCrashed && !d.isAppUnmounted && d.pendingUpdateFiberArray.length);

  if (hasPending) {
    scheduleUpdate(hasPending);
  } else {
    globalLoop.current = false;
  }
};

export const scheduleNext = (renderDispatch: CustomRenderDispatch) => {
  if (!renderDispatch.isAppUnmounted && !renderDispatch.isAppCrashed && renderDispatch.enableUpdate && renderDispatch.pendingUpdateFiberArray.length) {
    scheduleUpdate(renderDispatch);
    return;
  }

  const renderScheduler = currentScheduler.current;

  if (!renderScheduler.dispatchSet || renderScheduler.dispatchSet?.length === 1) return;

  const allDispatch = renderScheduler.dispatchSet as UniqueArray<CustomRenderDispatch>;

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
    scheduleOther(renderDispatch);
    return;
  }

  scheduleUpdateFromRoot(renderDispatch);
};
