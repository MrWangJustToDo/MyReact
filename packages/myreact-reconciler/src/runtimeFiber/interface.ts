import type { MyReactFiberNode } from "./instance";
import type { MaybeArrayMyReactElementNode, MyReactElementNode } from "@my-react/react";
import type { HOOK_TYPE } from "@my-react/react-shared";

export interface MyReactFiberNodeDev extends MyReactFiberNode {
  _debugRenderState: { renderCount: number; mountTime: number; prevUpdateTime: number; currentUpdateTime: number };

  _debugHookTypes: HOOK_TYPE[];

  _debugContextMap: Record<string, MyReactFiberNode>;

  _debugDynamicChildren: MaybeArrayMyReactElementNode;

  _debugChildren: MyReactFiberNode[];

  _debugSuspense: MyReactElementNode;

  _debugStrict: boolean;

  _debugScope: MyReactFiberNode;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any[] }>;

  _debugErrorBoundaries: MyReactFiberNode;
}
