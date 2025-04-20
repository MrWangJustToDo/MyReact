import type { MyReactFiberNode } from "./instance";
import type { MaybeArrayMyReactElementNode, MyReactElementNode, UpdateQueue } from "@my-react/react";
import type { ListTree, STATE_TYPE } from "@my-react/react-shared";

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
    trigger?: MyReactFiberNode | MyReactFiberNode[];

    // 最大render耗时
    maxTimeForRender?: number;
  };

  _debugHookTypes: string[];

  _debugRenderChildrenCurrent: MaybeArrayMyReactElementNode[];

  _debugRenderChildrenPrevious: MaybeArrayMyReactElementNode[];

  _debugStrict: boolean;

  _debugIsMount: boolean;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any }>;

  _debugUpdateQueue: ListTree<UpdateQueue>;

  _debugLog: boolean;

  __dev_hmr_revert__: (cb?: () => void) => void;

  __dev_hmr_update__: (state?: STATE_TYPE, cb?: () => void) => void;
}
