import { UniqueArray } from "@my-react/react-shared";

import { macroTask, microTask, yieldTask } from "../share";

import type { createContext, MyReactElementNode } from "../element";
import type { MyReactInternalInstance } from "../internal";
import type { RenderFiber } from "../renderFiber";
import type { RenderHookParams } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { RenderScheduler } from "./interface";

const createNotImplementedError = (methodName: string): Error => {
  return new Error(
    `[@my-react/react] "${methodName}" is not implemented. This usually means:
  1. You have multiple versions of @my-react/react installed - run "npm ls @my-react/react" or "pnpm why @my-react/react" to check
  2. The reconciler package (@my-react/react-reconciler) is not properly initialized
  3. You're trying to use React features before the render platform is set up

Please ensure you have a single version of @my-react/react and that your renderer is properly configured.`
  );
};

export class Scheduler implements RenderScheduler {
  microTask(_task: () => void): void {
    microTask(_task);
  }
  macroTask(_task: () => void): void {
    macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    return yieldTask(_task);
  }
  getFiberTree(_fiber: RenderFiber): string {
    throw createNotImplementedError("getFiberTree");
  }
  readContext(_params: ReturnType<typeof createContext>): unknown {
    throw createNotImplementedError("readContext");
  }
  readPromise(_params: Promise<unknown>): unknown {
    throw createNotImplementedError("readPromise");
  }
  dispatchHook(_params: RenderHookParams): unknown {
    throw createNotImplementedError("dispatchHook");
  }
  dispatchState(_params: UpdateQueue): void {
    throw createNotImplementedError("dispatchState");
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): MyReactElementNode {
    throw createNotImplementedError("dispatchError");
  }
  dispatchPromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode {
    throw createNotImplementedError("dispatchPromise");
  }
  dispatchSuspensePromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode {
    throw createNotImplementedError("dispatchSuspensePromise");
  }

  dispatchSet = new UniqueArray<MyReactInternalInstance>();
}
