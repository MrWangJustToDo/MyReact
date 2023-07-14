import { processHookNode } from "../processHook";
import { processState } from "../processState";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { LogProps, RenderFiber, RenderHook, RenderPlatform, UpdateQueue } from "@my-react/react";
import type { ListTreeNode, HOOK_TYPE } from "@my-react/react-shared";

export class CustomRenderPlatform implements RenderPlatform {
  log(_props: LogProps): void {
    void 0;
  }
  microTask(_task: () => void): void {
    void 0;
  }
  macroTask(_task: () => void): void {
    void 0;
  }
  yieldTask(_task: () => void): () => void {
    return void 0;
  }
  getFiberTree(_fiber: MyReactFiberNode): string {
    return "";
  }
  getHookTree(_treeHookNode: ListTreeNode<MyReactHookNode>, _errorType: { lastRender: HOOK_TYPE; nextRender: HOOK_TYPE }): string {
    return "";
  }
  dispatchHook(_params: Pick<RenderHook<Record<string, any>>, "reducer" | "deps" | "type" | "value">): unknown {
    return processHookNode(_params);
  }
  dispatchState(_params: UpdateQueue): void {
    processState(_params);
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): void {
    const { fiber, error } = _params;

    fiber?._error(error);
  }
}
