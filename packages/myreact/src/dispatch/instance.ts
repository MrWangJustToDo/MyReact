import type { createContext, MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams, MyReactHookNode } from "../hook";
import type { RenderScope } from "../scope";
import type { FiberDispatch } from "./interface";
import type { LinkTreeList } from "@my-react/react-shared";

export class EmptyDispatch implements FiberDispatch {
  strictMap: Record<string, boolean> = {};

  scopeIdMap: Record<string, string | undefined> = {};

  errorBoundariesMap: Record<string, MyReactFiberNode | undefined> = {};

  keepLiveMap: Record<string, MyReactFiberNode[]> = {};

  suspenseMap: Record<string, MyReactElementNode> = {};

  effectMap: Record<string, (() => void)[]> = {};

  layoutEffectMap: Record<string, (() => void)[]> = {};

  contextMap: Record<string, Record<string, MyReactFiberNode>> = {};

  unmountMap: Record<string, MyReactFiberNode[]> = {};

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] | undefined }>> = {};

  trigger(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return null;
  }
  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): MyReactHookNode | null {
    return null;
  }
  resolveScopeIdMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveScopeId(_fiber: MyReactFiberNode): string {
    return "";
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveStrictValue(_fiber: MyReactFiberNode): boolean {
    return false;
  }
  resolveKeepLiveMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveKeepLive(_fiber: MyReactFiberNode, _element: MyReactElementNode): MyReactFiberNode | null {
    return null;
  }
  resolveElementTypeMap(_fiber: MyReactFiberNode): void {
    void 0;
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
  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return null;
  }
  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveComponentQueue(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveHookQueue(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveFiberUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveMemorizedProps(_fiber: MyReactFiberNode): void {
    void 0;
  }
  // TODO this part of logic should not include global dispatch interface
  // start
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    return false;
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
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>): void {
    void 0;
  }
  pendingDeactivate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }
  pendingRef(_fiber: MyReactFiberNode): void {
    void 0;
  }
  removeFiber(_fiber: MyReactFiberNode): void {
    void 0;
  }
}
