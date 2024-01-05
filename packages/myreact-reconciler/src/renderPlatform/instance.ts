import { UniqueArray } from "@my-react/react-shared";

import { getFiberTree, getHookTree } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { RenderFiber, RenderHookParams, RenderPlatform, UpdateQueue } from "@my-react/react";
import type { ListTreeNode, HOOK_TYPE } from "@my-react/react-shared";

export class CustomRenderPlatform implements RenderPlatform {
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
    return getFiberTree(_fiber);
  }
  getHookTree(_treeHookNode: ListTreeNode<MyReactHookNode>, _errorType: { lastRender: HOOK_TYPE; nextRender: HOOK_TYPE }): string {
    return getHookTree(_treeHookNode, _errorType);
  }
  dispatchHook(_params: RenderHookParams): unknown {
    return void 0;
  }
  dispatchState(_params: UpdateQueue): void {
    void 0;
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): void {
    void 0;
  }

  dispatchPromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): void {
    void 0;
  }

  dispatchSet = new UniqueArray<CustomRenderDispatch>();
}
