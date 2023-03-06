import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams } from "../hook";

export interface FiberDispatch {
  triggerUpdate(_fiber: MyReactFiberNode): void;

  triggerError(_fiber: MyReactFiberNode, _error: Error): void;

  initialFiberNode(_fiber: MyReactFiberNode): void;

  updateFiberNode(_fiber: MyReactFiberNode): void;

  resolveHookNode(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): any | null;

  processClassComponentQueue(_fiber: MyReactFiberNode): void;

  processFunctionComponentQueue(_fiber: MyReactFiberNode): void;
}
