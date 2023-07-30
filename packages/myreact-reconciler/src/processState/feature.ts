import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE } from "@my-react/react-shared";

import { syncFlush } from "../share";

import type { RenderFiber, UpdateQueue } from "@my-react/react";

export type UpdateQueueDev = UpdateQueue<{ _debugCreateTime: number; _debugBeforeValue: any; _debugAfterValue: any; _debugRunTime: number }>;

const { currentComponentFiber, currentRenderPlatform } = __my_react_internal__;

const { enableSyncFlush } = __my_react_shared__;

const MAX_UPDATE_COUNT = 25;

let lastRenderComponentFiber: RenderFiber | null = null;

let renderCount = 0;

export const processState = (_params: UpdateQueue) => {
  if (__DEV__) {
    const typedUpdateQueue = _params as UpdateQueueDev;

    typedUpdateQueue._debugCreateTime = Date.now();
  }

  _params.isSync = enableSyncFlush.current;

  if (_params.type === "component") {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber.state & STATE_TYPE.__unmount__) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      if (lastRenderComponentFiber === currentComponentFiber.current) {
        renderCount++;
      }
      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;
        throw new Error("look like there are infinity update for current component");
      } else {
        currentRenderPlatform.current?.log({
          fiber: currentComponentFiber.current,
          message: `trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`,
          level: "warn",
          triggerOnce: true,
        });
      }
      lastRenderComponentFiber = currentComponentFiber.current;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  } else {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || ownerFiber?.state & STATE_TYPE.__unmount__) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      if (lastRenderComponentFiber === currentComponentFiber.current) {
        renderCount++;
      }
      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;
        throw new Error("look like there are infinity update for current component");
      } else {
        currentRenderPlatform.current?.log({
          fiber: currentComponentFiber.current,
          message: `trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`,
          level: "warn",
          triggerOnce: true,
        });
      }
      lastRenderComponentFiber = currentComponentFiber.current;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  }
};
