import type { RenderFiber } from "../renderFiber";
import type { RenderHook, RenderHookParams } from "../renderHook";
import type { UpdateQueue } from "../renderQueue";
import type { ListTreeNode } from "@my-react/react-shared";

export type LogProps = {
  message: string | Error;
  fiber?: RenderFiber;
  triggerOnce?: boolean;
  level?: "warn" | "error";
  dispatchError?: boolean;
};

interface DefaultRenderPlatform {
  log(_props: LogProps): void;

  microTask(_task: () => void): void;

  macroTask(_task: () => void): void;

  yieldTask(_task: () => void): () => void;

  getFiberTree(_fiber: RenderFiber): string;

  getHookTree(_treeHookNode: ListTreeNode<RenderHook>, _errorType: { lastRender: RenderHook["type"]; nextRender: RenderHook["type"] }): string;

  dispatchHook(_params: RenderHookParams): unknown;

  dispatchState(_params: UpdateQueue): void;

  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): void;
}

export type RenderPlatform<T = Record<string, any>> = DefaultRenderPlatform & T;
