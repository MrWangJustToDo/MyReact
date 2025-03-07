import {
  __my_react_internal__,
  type createContext,
  type MyReactElementNode,
  type RenderFiber,
  type RenderHookParams,
  type RenderPlatform,
  type UpdateQueue,
} from "@my-react/react";
import { UniqueArray } from "@my-react/react-shared";

import { defaultReadContext } from "../dispatchContext";
import { defaultReadPromise } from "../dispatchSuspense";
import { getFiberTree, getHookTree } from "../share";

import type { PromiseWithState } from "../processPromise";
import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { ListTreeNode, HOOK_TYPE } from "@my-react/react-shared";

const { Dispatcher } = __my_react_internal__;

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
  readPromise(_params: PromiseWithState<unknown>): unknown {
    return defaultReadPromise(_params);
  }
  readContext(_params: ReturnType<typeof createContext>): unknown {
    return defaultReadContext(_params);
  }
  dispatchHook(_params: RenderHookParams): unknown {
    return void 0;
  }
  dispatchState(_params: UpdateQueue): void {
    void 0;
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): MyReactElementNode {
    return void 0;
  }

  dispatchPromise(_params: { fiber?: RenderFiber; promise?: Promise<unknown> }): MyReactElementNode {
    return void 0;
  }

  dispatcher = Dispatcher;

  dispatchSet = new UniqueArray<CustomRenderDispatch>();
}
