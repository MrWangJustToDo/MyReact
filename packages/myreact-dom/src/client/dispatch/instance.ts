import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import {
  generateContextMap,
  getContextMapFromMap,
  processComponentUpdateQueue,
  processHookUpdateQueue,
} from "@my-react/react-reconciler";

import {
  getFiberWithDom,
  getIsSVGFromMap,
  LinkTreeList,
  pendingUpdateFiberList,
  pendingUpdateFiberListArray,
  triggerUpdate,
} from "@ReactDOM_shared";

import { updateAllAsync, updateAllSync } from "../update";

import { append } from "./append";
import { context } from "./context";
import { create } from "./create";
import { effect, layoutEffect } from "./effect";
import { fallback } from "./fallback";
import { position } from "./position";
import { unmount } from "./unmount";
import { update } from "./update";

import type {
  MyReactFiberNode,
  FiberDispatch,
  MyReactElementNode,
  MyReactFiberNodeDev,
  createContext,
} from "@my-react/react";

const { safeCallWithFiber } = __my_react_shared__;

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export class ClientDispatch implements FiberDispatch {
  rootFiber: MyReactFiberNode | null = null;

  rootContainer: { [p: string]: any } = {};

  isAppMounted = false;

  isAppCrash = false;

  effectMap: Record<string, (() => void)[]> = {};

  layoutEffectMap: Record<string, (() => void)[]> = {};

  suspenseMap: Record<string, MyReactElementNode> = {};

  elementTypeMap: Record<string, boolean> = {};

  contextMap: Record<string, Record<string, MyReactFiberNode>> = {};

  unmountMap: Record<string, (MyReactFiberNode | MyReactFiberNode[])[]> = {};

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] | undefined }>> = {};

  trigger(_fiber: MyReactFiberNode): void {
    triggerUpdate(_fiber);
  }
  resolveLazy(): boolean {
    return true;
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    const parent = _fiber.parent;
    const element = _fiber.element;
    if (typeof element === "object" && _fiber.type & NODE_TYPE.__isSuspense__) {
      this.suspenseMap[_fiber.uid] = element?.props["fallback"] as MyReactElementNode;
    } else {
      if (parent) {
        this.suspenseMap[_fiber.uid] = this.suspenseMap[parent.uid];
      } else {
        this.suspenseMap[_fiber.uid] = null;
      }
    }
    if (__DEV__) {
      const typedFiber = _fiber as MyReactFiberNodeDev;

      typedFiber._debugSuspense = this.suspenseMap[_fiber.uid];
    }
  }
  resolveSuspenseElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return this.suspenseMap[_fiber.uid];
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    generateContextMap(_fiber, this.contextMap);
  }
  resolveContextFiber(
    _fiber: MyReactFiberNode,
    _contextObject: ReturnType<typeof createContext> | null
  ): MyReactFiberNode | null {
    if (_contextObject) {
      const contextMap = getContextMapFromMap(_fiber.parent, this.contextMap);
      return contextMap[_contextObject.id] || null;
    } else {
      return null;
    }
  }
  resolveComponentQueue(_fiber: MyReactFiberNode): void {
    processComponentUpdateQueue(_fiber);
  }
  resolveHookQueue(_fiber: MyReactFiberNode): void {
    processHookUpdateQueue(_fiber);
  }
  beginProgressList(): void {
    pendingUpdateFiberList.current = new LinkTreeList();
  }
  endProgressList(): void {
    if (pendingUpdateFiberList.current?.length) {
      pendingUpdateFiberListArray.current.push(pendingUpdateFiberList.current);
    }
    pendingUpdateFiberList.current = null;
  }
  generateUpdateList(_fiber: MyReactFiberNode): void {
    if (_fiber) {
      if (pendingUpdateFiberList.current) {
        if (
          _fiber.patch & PATCH_TYPE.__pendingCreate__ ||
          _fiber.patch & PATCH_TYPE.__pendingUpdate__ ||
          _fiber.patch & PATCH_TYPE.__pendingAppend__ ||
          _fiber.patch & PATCH_TYPE.__pendingPosition__
        ) {
          pendingUpdateFiberList.current.append(_fiber, _fiber.fiberIndex);
        } else if (
          this.effectMap[_fiber.uid]?.length ||
          this.unmountMap[_fiber.uid]?.length ||
          this.layoutEffectMap[_fiber.uid]?.length
        ) {
          pendingUpdateFiberList.current.append(_fiber, _fiber.fiberIndex);
        }
      } else {
        throw new Error("unknown error for running");
      }
    }
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    const _isSVG = getIsSVGFromMap(_fiber, this.elementTypeMap);

    const _result = safeCallWithFiber({
      fiber: _fiber,
      action: () => create(_fiber, _hydrate, _parentFiberWithDom, _isSVG),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => update(_fiber, _result, _isSVG),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => append(_fiber, _parentFiberWithDom),
    });

    let _final = _hydrate;

    if (_fiber.child) {
      _final = this.reconcileCommit(_fiber.child, _result, _fiber.node ? _fiber : _parentFiberWithDom);
      fallback(_fiber);
    }

    safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

    Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _fiber.node ? _result : _final, _parentFiberWithDom);
    }

    if (_fiber.node) {
      return _result;
    } else {
      return _final;
    }
  }
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void {
    _list.listToFoot((_fiber) => {
      const _isSVG = getIsSVGFromMap(_fiber, this.elementTypeMap);
      safeCallWithFiber({
        fiber: _fiber,
        action: () => create(_fiber, false, _fiber, _isSVG),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => update(_fiber, false, _isSVG),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => unmount(_fiber),
      });

      safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });
    });
  }
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    _list.listToHead((_fiber) => {
      const _parentFiberWithDom = getFiberWithDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

      safeCallWithFiber({
        fiber: _fiber,
        action: () => position(_fiber, _parentFiberWithDom),
      });
    });

    _list.listToFoot((_fiber) => {
      const _parentFiberWithDom = getFiberWithDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

      safeCallWithFiber({
        fiber: _fiber,
        action: () => append(_fiber, _parentFiberWithDom),
      });
    });

    _list.reconcile((_fiber) => {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => layoutEffect(_fiber),
      });

      Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
    });
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__)) {
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
    _fiber.patch |= PATCH_TYPE.__pendingContext__;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__pendingPosition__;
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]): void {
    const exist = this.unmountMap[_fiber.uid] || [];
    this.unmountMap[_fiber.uid] = [...exist, _pendingUnmount];
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    const exist = this.layoutEffectMap[_fiber.uid] || [];
    this.layoutEffectMap[_fiber.uid] = [...exist, _layoutEffect];
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    const exist = this.effectMap[_fiber.uid] || [];
    this.effectMap[_fiber.uid] = [...exist, _effect];
  }
  removeFiber(_fiber: MyReactFiberNode): void {
    delete this.suspenseMap[_fiber.uid];
    delete this.effectMap[_fiber.uid];
    delete this.layoutEffectMap[_fiber.uid];
    delete this.contextMap[_fiber.uid];
    delete this.unmountMap[_fiber.uid];
    delete this.eventMap[_fiber.uid];
  }
  updateAllSync(): void {
    updateAllSync();
  }
  updateAllAsync(): void {
    updateAllAsync();
  }
}
