import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include } from "@my-react/react-shared";

import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { getCurrentDispatchFromFiber, getElementName, onceWarnWithKeyAndFiber, syncFlush } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { RenderFiber, UpdateQueue } from "@my-react/react";

export type UpdateQueueDev = UpdateQueue<{
  _debugType: string;
  _debugCreateTime: number;
  _debugBeforeValue: any;
  _debugAfterValue: any;
  _debugBaseValue: any;
  _debugRunTime: number;
  _debugUpdateState: { needUpdate: boolean; isSync: boolean; isForce: boolean; callbacks: (() => void)[] };
}>;

const { currentComponentFiber, currentRunningFiber } = __my_react_internal__;

const { enableDebugFiled } = __my_react_shared__;

const MAX_UPDATE_COUNT = 25;

let lastRenderComponentFiber: RenderFiber | null = null;

let lastRenderComponentTimeStep: number | null = null;

let renderCount = 0;

export const processState = (_params: UpdateQueue) => {
  if (__DEV__ && enableDebugFiled.current) {
    const typedUpdateQueue = _params as UpdateQueueDev;

    typedUpdateQueue._debugCreateTime = Date.now();

    typedUpdateQueue._debugType = UpdateQueueType[_params.type];
  }

  if (_params.type === UpdateQueueType.component) {
    const ownerFiber = _params.trigger._owner as MyReactFiberNode;

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

    const renderDispatch = getCurrentDispatchFromFiber(ownerFiber);

    // if current dispatch is a server || noop
    if (!renderDispatch.enableUpdate) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      const currentRFiber = currentRunningFiber.current as MyReactFiberNode;

      const currentCFiber = currentComponentFiber.current as MyReactFiberNode;

      const now = Date.now();

      if (lastRenderComponentFiber === currentCFiber) {
        if (lastRenderComponentTimeStep && now - lastRenderComponentTimeStep < 4) {
          renderCount++;
        } else {
          renderCount = 0;
        }
      } else {
        renderCount = 0;
      }

      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;

        throw new Error(
          `[@my-react/react] look like there are infinity update for current component ${
            currentComponentFiber.current && getElementName(currentComponentFiber.current as MyReactFiberNode)
          }`
        );
      } else if (!isErrorBoundariesComponent(ownerFiber)) {
        const triggeredElementName = getElementName(ownerFiber);
        const currentElementName = getElementName(currentCFiber);

        onceWarnWithKeyAndFiber(
          currentRFiber,
          `updateWhenCurrentFlowIsRunning-${triggeredElementName}`,
          `[@my-react/react] trigger an update for ${triggeredElementName} when current update flow is running, this is a unexpected behavior, please make sure current render function for ${currentElementName} is a pure function`
        );
      }

      lastRenderComponentFiber = currentCFiber;
      lastRenderComponentTimeStep = now;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare(_params.isInitial && renderDispatch?.isAppMounted);
  } else if (_params.type === UpdateQueueType.hook) {
    const ownerFiber = _params.trigger._owner as MyReactFiberNode;

    if (!ownerFiber || include(ownerFiber?.state, STATE_TYPE.__unmount__)) return;

    const renderDispatch = getCurrentDispatchFromFiber(ownerFiber);

    if (!renderDispatch.enableUpdate) return;

    if (__DEV__ && !syncFlush && currentComponentFiber.current) {
      const currentRFiber = currentRunningFiber.current as MyReactFiberNode;

      const currentCFiber = currentComponentFiber.current as MyReactFiberNode;

      const now = Date.now();

      if (lastRenderComponentFiber === currentCFiber) {
        if (lastRenderComponentTimeStep && now - lastRenderComponentTimeStep < 4) {
          renderCount++;
        } else {
          renderCount = 0;
        }
      } else {
        renderCount = 0;
      }

      if (renderCount > MAX_UPDATE_COUNT) {
        renderCount = 0;
        throw new Error(
          `[@my-react/react] look like there are infinity update for current component ${
            currentComponentFiber.current && getElementName(currentComponentFiber.current as MyReactFiberNode)
          }`
        );
      } else if (!isErrorBoundariesComponent(ownerFiber)) {
        const triggeredElementName = getElementName(ownerFiber);
        const currentElementName = getElementName(currentCFiber);
        onceWarnWithKeyAndFiber(
          currentRFiber,
          `updateWhenCurrentFlowIsRunning-${triggeredElementName}`,
          `[@my-react/react] trigger an update for ${triggeredElementName} when current update flow is running, this is a unexpected behavior, please make sure current render function for ${currentElementName} is a pure function`
        );
      }
      lastRenderComponentFiber = currentCFiber;
      lastRenderComponentTimeStep = now;
    }

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare(_params.isInitial && renderDispatch?.isAppMounted);
  } else {
    const ownerFiber = _params.trigger as MyReactFiberNode;

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

    const renderDispatch = getCurrentDispatchFromFiber(ownerFiber);

    if (!renderDispatch.enableUpdate) return;

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    ownerFiber._prepare(_params.isInitial && renderDispatch?.isAppMounted);
  }
};
