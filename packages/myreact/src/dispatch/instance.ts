import type { createContext, MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams, MyReactHookNode } from "../hook";
import type { RenderScope } from "../scope";
import type { LinkTreeList } from "../share";
import type { FiberDispatch } from "./interface";

export class EmptyDispatch implements FiberDispatch {
  strictMap: Record<string, boolean> = {};

  suspenseMap: Record<string, MyReactElementNode> = {};

  effectMap: Record<string, (() => void)[]> = {};

  layoutEffectMap: Record<string, (() => void)[]> = {};

  contextMap: Record<string, Record<string, MyReactFiberNode>> = {};

  unmountMap: Record<string, (MyReactFiberNode | MyReactFiberNode[])[]> = {};

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] | undefined }>> = {};

  trigger(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveLazy(): boolean {
    return false;
  }
  resolveRef(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): MyReactHookNode | null {
    return null;
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveStrictValue(_fiber: MyReactFiberNode): boolean {
    return false;
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveSuspenseElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null) {
    return null;
  }
  resolveContextValue(
    _fiber: MyReactFiberNode | null,
    _contextObject: ReturnType<typeof createContext> | null
  ): Record<string, unknown> | null {
    return null;
  }
  resolveComponentQueue(_fiber: MyReactFiberNode): void {
    return void 0;
  }
  resolveHookQueue(_fiber: MyReactFiberNode): void {
    return void 0;
  }
  // TODO this part of logic should not include global dispatch interface
  // start
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    return false;
  }
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void {
    void 0;
  }
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    void 0;
  }
  beginProgressList(_scope: RenderScope): void {
    void 0;
  }
  endProgressList(_scope: RenderScope): void {
    void 0;
  }
  generateUpdateList(_fiber: MyReactFiberNode, _scope: RenderScope): void {
    void 0;
  }
  // end
  pendingCreate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]): void {
    void 0;
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }
  removeFiber(_fiber: MyReactFiberNode): void {
    void 0;
  }
}
