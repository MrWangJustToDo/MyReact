import type { createContext, MyReactElementNode } from "../element";
import type { MyReactInternalInstance } from "../internal";
import type { RenderFiber } from "../renderFiber";
import type { RenderHookParams } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { UniqueArray } from "@my-react/react-shared";

/**
 * @public
 */
export interface DefaultRenderScheduler {
  dispatchSet: UniqueArray<MyReactInternalInstance>;

  microTask(_task: () => void): void;

  macroTask(_task: () => void): void;

  yieldTask(_task: () => void): () => void;

  getFiberTree(_fiber: RenderFiber): string;

  readContext(_params: ReturnType<typeof createContext>): unknown;

  readPromise(_params: Promise<unknown>): unknown;

  dispatchHook(_params: RenderHookParams): unknown;

  dispatchState(_params: UpdateQueue): void;

  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): MyReactElementNode;

  dispatchPromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode;

  dispatchSuspensePromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode;
}

/**
 * @public
 */
export type RenderScheduler<T = Record<string, any>> = DefaultRenderScheduler & T;
