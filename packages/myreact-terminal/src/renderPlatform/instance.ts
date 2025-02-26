import { __my_react_internal__, __my_react_scheduler__, __my_react_shared__ } from "@my-react/react";
import { CustomRenderPlatform, processHook, processPromise, processState, triggerError } from "@my-react/react-reconciler";

import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { initRenderPlatform } = __my_react_internal__;

const { macroTask, yieldTask, microTask } = __my_react_scheduler__;

__my_react_shared__.enableConcurrentMode.current = false;

export class TerminalPlatform extends CustomRenderPlatform {
  isTerminal = true;

  microTask(_task: () => void): void {
    microTask(_task);
  }
  macroTask(_task: () => void): void {
    macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    return yieldTask(_task);
  }
  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(_params);
  }
  dispatchError(_params: { fiber: MyReactFiberNode; error: Error }): MyReactElementNode {
    triggerError(_params.fiber, _params.error);
    return void 0;
  }
  dispatchState(_params: UpdateQueue): void {
    processState(_params);
  }
  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown>; }): MyReactElementNode {
    processPromise(_params.fiber, _params.promise);
    return void 0;
  }
}

export const MyReactTerminalPlatform = new TerminalPlatform();

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  initRenderPlatform(MyReactTerminalPlatform);
};
