import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include } from "@my-react/react-shared";

import { onceWarnWithKey, syncFlush } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { RenderFiber, UpdateQueue } from "@my-react/react";

export type UpdateQueueDev = UpdateQueue<{
  _debugType: string;
  _debugCreateTime: number;
  _debugBeforeValue: any;
  _debugAfterValue: any;
  _debugBaseValue: any;
  _debugRunTime: number;
}>;

const { currentComponentFiber } = __my_react_internal__;

const { enableSyncFlush, enableDebugFiled } = __my_react_shared__;

const MAX_UPDATE_COUNT = 25;

let lastRenderComponentFiber: RenderFiber | null = null;

let renderCount = 0;

export const processState = (_params: UpdateQueue) => {
  if (__DEV__ && enableDebugFiled.current) {
    const typedUpdateQueue = _params as UpdateQueueDev;

    typedUpdateQueue._debugCreateTime = Date.now();

    typedUpdateQueue._debugType = UpdateQueueType[_params.type];
  }

  _params.isSync = enableSyncFlush.current;

  if (_params.type === UpdateQueueType.component) {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      if (lastRenderComponentFiber === currentComponentFiber.current) {
        renderCount++;
      }
      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;
        throw new Error("[@my-react/react] look like there are infinity update for current component");
      } else {
        onceWarnWithKey(
          ownerFiber as MyReactFiberNode,
          "updateWhenCurrentFlowIsRunning",
          `[@my-react/react] trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`
        );
        // console.warn(
        //   `[@my-react/react] trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`
        // );
      }
      lastRenderComponentFiber = currentComponentFiber.current;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  } else {
    const ownerFiber = _params.trigger._ownerFiber;

    if (!ownerFiber || include(ownerFiber?.state, STATE_TYPE.__unmount__)) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      if (lastRenderComponentFiber === currentComponentFiber.current) {
        renderCount++;
      }
      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;
        throw new Error("[@my-react/react] look like there are infinity update for current component");
      } else {
        onceWarnWithKey(
          ownerFiber as MyReactFiberNode,
          "updateWhenCurrentFlowIsRunning",
          `[@my-react/react] trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`
        );
        // console.warn(
        //   `[@my-react/react] trigger an update when current update flow is running, this is a unexpected behavior, please make sure current render function is a pure function`
        // );
      }
      lastRenderComponentFiber = currentComponentFiber.current;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare();
  }
};
