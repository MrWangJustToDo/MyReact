import type { MyReactFiberNode } from "./instance";
import type { MyReactElementNode, UpdateQueue } from "@my-react/react";
import type { HOOK_TYPE, ListTree } from "@my-react/react-shared";

export interface MyReactFiberNodeDev extends MyReactFiberNode {
  _debugElement: MyReactElementNode;

  _debugRenderState: { mountTime: number; renderCount?: number; updateTime?: number; updateTimeInterval?: number };

  _debugHookTypes: HOOK_TYPE[];

  _debugContextMap: Record<string, MyReactFiberNode>;

  _debugRenderChildrenCurrent: MyReactFiberNode[];

  _debugRenderChildrenPrevious: MyReactFiberNode[];

  _debugSuspense: MyReactElementNode;

  _debugStrict: boolean;

  _debugIsMount: boolean;

  _debugScope: MyReactFiberNode;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any[] }>;

  _debugErrorBoundaries: MyReactFiberNode;

  _debugUpdateQueue: ListTree<UpdateQueue>;
}
