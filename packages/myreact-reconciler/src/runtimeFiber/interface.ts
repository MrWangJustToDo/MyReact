import type { MyReactFiberNode } from "./instance";
import type { MyReactElementNode, UpdateQueue } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export interface MyReactFiberNodeDev extends MyReactFiberNode {
  _debugElement: MyReactElementNode;

  _debugRenderState: {
    mountTimeStep: number;
    renderCount?: number;
    updateTimeStep?: number;
    // 本次更新距离上次时间差
    timeForUpdate?: number;
    // 本地render花费时间
    timeForRender?: number;
    trigger?: MyReactFiberNode;
  };

  _debugHookTypes: string[];

  _debugContextMap: Record<string, MyReactFiberNode>;

  _debugRenderChildrenCurrent: MyReactFiberNode[];

  _debugRenderChildrenPrevious: MyReactFiberNode[];

  _debugSuspense: MyReactFiberNode;

  _debugStrict: boolean;

  _debugIsMount: boolean;

  _debugScope: MyReactFiberNode;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any }>;

  _debugErrorBoundaries: MyReactFiberNode;

  _debugUpdateQueue: ListTree<UpdateQueue>;

  _debugLogTree: boolean;
}
