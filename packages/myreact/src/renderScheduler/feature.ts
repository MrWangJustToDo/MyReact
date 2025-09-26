import { UniqueArray } from "@my-react/react-shared";

import { macroTask, microTask, yieldTask } from "../share";

import type { createContext, MyReactElementNode } from "../element";
import type { MyReactInternalInstance } from "../internal";
import type { RenderFiber } from "../renderFiber";
import type { RenderHookParams } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { RenderScheduler } from "./interface";

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
    throw new Error("Method not implemented.");
  }
  readContext(_params: ReturnType<typeof createContext>): unknown {
    throw new Error("Method not implemented.");
  }
  readPromise(_params: Promise<unknown>): unknown {
    throw new Error("Method not implemented.");
  }
  dispatchHook(_params: RenderHookParams): unknown {
    throw new Error("Method not implemented.");
  }
  dispatchState(_params: UpdateQueue): void {
    throw new Error("Method not implemented.");
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }
  dispatchPromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }
  dispatchSuspensePromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }

  dispatchSet = new UniqueArray<MyReactInternalInstance>();
}
