import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include } from "@my-react/react-shared";

import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { prepareUpdateOnFiber, type MyReactFiberNode } from "../runtimeFiber";
import { getInstanceOwnerFiber } from "../runtimeGenerate";
import { enableLogForCurrentFlowIsRunning, getElementName, onceWarnWithKeyAndFiber, safeCallWithCurrentFiber, syncFlush } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactHookNode } from "../runtimeHook";
import type { MyReactComponent, MyReactInternalInstance, RenderFiber, UpdateQueue } from "@my-react/react";

export type UpdateQueueDev = UpdateQueue<{
  _debugType: string;
  _debugCreateTime: number;
  _debugBeforeValue: any;
  _debugAfterValue: any;
  _debugBaseValue: any;
  _debugRunTime: number;
}>;

const { currentComponentFiber, currentRunningFiber } = __my_react_internal__;

const { enableDebugFiled } = __my_react_shared__;

const MAX_UPDATE_COUNT = 25;

let lastRenderComponentFiber: RenderFiber | null = null;

let lastRenderComponentTimeStep: number | null = null;

let renderCount = 0;

export const processState = (renderDispatch: CustomRenderDispatch, _params: UpdateQueue) => {
  if (__DEV__ && enableDebugFiled.current) {
    const typedUpdateQueue = _params as UpdateQueueDev;

    typedUpdateQueue._debugCreateTime = Date.now();

    typedUpdateQueue._debugType = UpdateQueueType[_params.type];
  }

  const ownerFiber = getInstanceOwnerFiber(_params.trigger as MyReactInternalInstance);

  if (!renderDispatch) return;

  _params.isRetrigger = currentRunningFiber.current === ownerFiber || !!_params.isRetrigger;

  _params.isImmediate =
    typeof _params.isImmediate === "boolean"
      ? _params.isImmediate
      : _params.isRetrigger || (renderDispatch.isAppMounted ? !!currentRunningFiber.current : false);

  safeCallWithCurrentFiber({
    fiber: ownerFiber,
    action: function safeCallFiberStateListener() {
      renderDispatch.callOnFiberState(ownerFiber, _params);
    },
  });

  const isImmediate = _params.isImmediate;

  const isRetrigger = _params.isRetrigger;

  if (_params.type === UpdateQueueType.component) {
    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

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
      } else if (enableLogForCurrentFlowIsRunning.current && !isErrorBoundariesComponent(ownerFiber)) {
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

    const trigger = _params.trigger as MyReactComponent;

    safeCallWithCurrentFiber({
      fiber: ownerFiber,
      action: function safeCallInstanceStateListener() {
        renderDispatch.callOnInstanceState(trigger, ownerFiber, _params);
      },
    });

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(renderDispatch, ownerFiber, isImmediate, isRetrigger);
  } else if (_params.type === UpdateQueueType.hook) {
    if (!ownerFiber || include(ownerFiber?.state, STATE_TYPE.__unmount__)) return;

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
      } else if (enableLogForCurrentFlowIsRunning.current && !isErrorBoundariesComponent(ownerFiber)) {
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

    const trigger = _params.trigger as MyReactHookNode;

    safeCallWithCurrentFiber({
      fiber: ownerFiber,
      action: function safeCallHookStateListener() {
        renderDispatch.callOnHookState(trigger, ownerFiber, _params);
      },
    });

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(renderDispatch, ownerFiber, isImmediate, isRetrigger);
  } else {
    const ownerFiber = _params.trigger as MyReactFiberNode;

    if (!ownerFiber || include(ownerFiber.state, STATE_TYPE.__unmount__)) return;

    ownerFiber.updateQueue = ownerFiber.updateQueue || new ListTree();

    ownerFiber.updateQueue.push(_params);

    prepareUpdateOnFiber(renderDispatch, ownerFiber, isImmediate, isRetrigger);
  }
};
