import { __my_react_internal__, __my_react_scheduler__, __my_react_shared__ } from "@my-react/react";

import { processHook } from "../processHook";
import { processPromise } from "../processPromise";
import { processState } from "../processState";
import { CustomRenderPlatform } from "../renderPlatform";
import { triggerError } from "../renderUpdate";
import { devErrorWithFiber, enableFiberForLog, enableValidMyReactElement } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

const { yieldTask, macroTask, microTask } = __my_react_scheduler__;

class ReconcilerPlatform extends CustomRenderPlatform {
  microTask(_task: () => void): void {
    microTask(_task);
  }
  macroTask(_task: () => void): void {
    macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    return yieldTask(_task);
  }
  dispatchState(_params: UpdateQueue): void {
    processState(_params);
  }
  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(_params);
  }
  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    processPromise(_params.fiber, _params.promise);
    return void 0;
  }
  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    if (__DEV__) {
      devErrorWithFiber(_params.fiber, _params.error);
    }
    triggerError(_params.fiber, _params.error);
    return void 0;
  }
}

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  enableDebugFiled.current = true;

  enableScopeTreeLog.current = true;

  enableFiberForLog.current = true;

  enableValidMyReactElement.current = false;

  const renderPlatform = currentRenderPlatform.current as ReconcilerPlatform;

  if (!renderPlatform) {
    const MyReactReconcilerPlatform = new ReconcilerPlatform();

    initRenderPlatform(MyReactReconcilerPlatform);
  }
};
