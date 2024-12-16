import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include } from "@my-react/react-shared";

import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { listenerMap } from "../renderDispatch";
import { prepareUpdateOnFiber, type MyReactFiberNode } from "../runtimeFiber";
import { getInstanceOwnerFiber } from "../runtimeGenerate";
import {
  enableLogForCurrentFlowIsRunning,
  getCurrentDispatchFromFiber,
  getElementName,
  onceWarnWithKeyAndFiber,
  safeCallWithCurrentFiber,
  syncFlush,
} from "../share";

import type { MyReactHookNode } from "../runtimeHook";
import type { MyReactComponent, MyReactInternalInstance, RenderFiber, UpdateQueue } from "@my-react/react";

export type UpdateQueueDev = UpdateQueue<{
  _debugType: string;
  _debugCreateTime: number;
  _debugBeforeValue: any;
  _debugAfterValue: any;
  _debugBaseValue: any;
  _debugRunTime: number;
  _debugUpdateState: { needUpdate: boolean; isSync: boolean; isForce: boolean; callbacks: (() => void)[] };
}>;

const { currentComponentFiber, currentRunningFiber, currentScopeFiber } = __my_react_internal__;

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

  const ownerFiber = getInstanceOwnerFiber(_params.trigger as MyReactInternalInstance);

  const renderDispatch = getCurrentDispatchFromFiber(ownerFiber);

  _params.isImmediate = !currentScopeFiber.current || !!currentRunningFiber.current;

  _params.isRetrigger = !!currentComponentFiber.current;

  if (renderDispatch?.enableUpdate) {
    safeCallWithCurrentFiber({
      fiber: ownerFiber,
      action: function safeCallFiberStateListener() {
        listenerMap.get(renderDispatch)?.fiberState?.forEach((cb) => cb(ownerFiber, _params));
      },
    });
  }

  const isImmediate = _params.isImmediate;

  if (_params.type === UpdateQueueType.component) {
    const ownerFiber = getInstanceOwnerFiber(_params.trigger);

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

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

        if (enableLogForCurrentFlowIsRunning.current) {
          onceWarnWithKeyAndFiber(
            currentRFiber,
            `updateWhenCurrentFlowIsRunning-${triggeredElementName}`,
            `[@my-react/react] trigger an update for ${triggeredElementName} when current update flow is running, this is a unexpected behavior, please make sure current render function for ${currentElementName} is a pure function`
          );
        }
      }

      lastRenderComponentFiber = currentCFiber;
      lastRenderComponentTimeStep = now;
    }

    const trigger = _params.trigger as MyReactComponent;

    safeCallWithCurrentFiber({
      fiber: ownerFiber,
      action: function safeCallInstanceStateListener() {
        listenerMap.get(renderDispatch)?.instanceState?.forEach((cb) => cb(trigger, ownerFiber, _params));
      },
    });

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(ownerFiber, renderDispatch, isImmediate);
  } else if (_params.type === UpdateQueueType.hook) {
    const ownerFiber = getInstanceOwnerFiber(_params.trigger);

    if (!ownerFiber || include(ownerFiber?.state, STATE_TYPE.__unmount__)) return;

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

        if (enableLogForCurrentFlowIsRunning.current) {
          onceWarnWithKeyAndFiber(
            currentRFiber,
            `updateWhenCurrentFlowIsRunning-${triggeredElementName}`,
            `[@my-react/react] trigger an update for ${triggeredElementName} when current update flow is running, this is a unexpected behavior, please make sure current render function for ${currentElementName} is a pure function`
          );
        }
      }
      lastRenderComponentFiber = currentCFiber;
      lastRenderComponentTimeStep = now;
    }

    const trigger = _params.trigger as MyReactHookNode;

    safeCallWithCurrentFiber({
      fiber: ownerFiber,
      action: function safeCallHookStateListener() {
        listenerMap.get(renderDispatch)?.hookState?.forEach((cb) => cb(trigger, ownerFiber, _params));
      },
    });

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(ownerFiber, renderDispatch, isImmediate);
  } else {
    const ownerFiber = _params.trigger as MyReactFiberNode;

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

    if (!renderDispatch.enableUpdate) return;

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(ownerFiber, renderDispatch, isImmediate);
  }
};
