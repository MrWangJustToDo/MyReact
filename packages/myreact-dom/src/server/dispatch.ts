import { __my_react_shared__, cloneElement } from "@my-react/react";
import {
  defaultGenerateContextMap,
  defaultGenerateSuspenseMap,
  defaultGetContextMapFromMap,
  defaultGetContextValue,
  processHookNode,
} from "@my-react/react-reconciler";
import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { append, create, update } from "./dom";

import type { FiberDispatch, MyReactFiberNode, MyReactElementNode, createContext, CreateHookParams, MyReactHookNode } from "@my-react/react";
import type { LinkTreeList } from "@my-react/react-shared";

const { safeCallWithFiber } = __my_react_shared__;

export class ServerDispatch implements FiberDispatch {
  effectMap: Record<string, (() => void)[]> = {};

  strictMap: Record<string, boolean> = {};

  keepLiveMap: Record<string, MyReactFiberNode[]> = {};

  layoutEffectMap: Record<string, (() => void)[]> = {};

  suspenseMap: Record<string, MyReactElementNode> = {};

  svgTypeMap: Record<string, boolean> = {};

  contextMap: Record<string, Record<string, MyReactFiberNode>> = {};

  unmountMap: Record<string, Array<LinkTreeList<MyReactFiberNode>>> = {};

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
  resolveKeepLive(_fiber: MyReactFiberNode, _element: MyReactElementNode): MyReactFiberNode | null {
    return null;
  }
  resolveKeepLiveMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveStrictValue(_fiber: MyReactFiberNode): boolean {
    return false;
  }
  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): MyReactHookNode | null {
    return processHookNode(_fiber, _hookParams);
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    defaultGenerateSuspenseMap(_fiber, this.suspenseMap);
  }
  resolveSuspenseElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return cloneElement(this.suspenseMap[_fiber.uid]);
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    defaultGenerateContextMap(_fiber, this.contextMap);
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode | null {
    if (_contextObject) {
      const contextMap = defaultGetContextMapFromMap(_fiber.parent, this.contextMap);
      return contextMap[_contextObject.id] || null;
    } else {
      return null;
    }
  }
  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  resolveComponentQueue(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveHookQueue(_fiber: MyReactFiberNode): void {
    void 0;
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    safeCallWithFiber({ fiber: _fiber, action: () => create(_fiber) });
    safeCallWithFiber({ fiber: _fiber, action: () => update(_fiber) });
    safeCallWithFiber({
      fiber: _fiber,
      action: () => append(_fiber, _parentFiberWithDom),
    });
    if (_fiber.child) {
      this.reconcileCommit(_fiber.child, _hydrate, _fiber.node ? _fiber : _parentFiberWithDom);
    }
    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
    }
    return true;
  }
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    void 0;
  }
  beginProgressList(): void {
    void 0;
  }
  endProgressList(): void {
    void 0;
  }
  generateUpdateList(_fiber: MyReactFiberNode | MyReactFiberNode[] | null): void {
    void 0;
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & NODE_TYPE.__isPortal__) {
      throw new Error("should not use portal element on the server");
    }
    if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
      _fiber.patch |= PATCH_TYPE.__pendingCreate__;
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
      _fiber.patch |= PATCH_TYPE.__pendingUpdate__;
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
      _fiber.patch |= PATCH_TYPE.__pendingAppend__;
    }
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingDeactivate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingMemorizedProps(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>): void {
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
