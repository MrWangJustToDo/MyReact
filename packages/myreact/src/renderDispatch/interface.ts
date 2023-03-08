import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams } from "../hook";

interface DefaultRenderDispatch {
  triggerUpdate(_fiber: MyReactFiberNode): void;

  triggerError(_fiber: MyReactFiberNode, _error: Error): void;

  resolveHookNode(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): any | null;

  processClassComponentQueue(_fiber: MyReactFiberNode): void;

  processFunctionComponentQueue(_fiber: MyReactFiberNode): void;
}

export type RenderDispatch<T = Record<string, any>> = DefaultRenderDispatch & T;
