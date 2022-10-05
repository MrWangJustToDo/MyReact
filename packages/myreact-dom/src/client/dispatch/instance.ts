import { cloneElement, __my_react_shared__ } from "@my-react/react";
import {
  defaultGenerateContextMap,
  defaultGetContextMapFromMap,
  defaultGetContextValue,
  processComponentUpdateQueue,
  processHookNode,
  processHookUpdateQueue,
} from "@my-react/react-reconciler";
import { LinkTreeList, NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { enableFastLoop, generateKeepLiveMap, generateStrictMap, generateSuspenseMap, getKeepLiveFiber, isSVG, setRef } from "@my-react-dom-shared";

import { triggerUpdate } from "../update";

import { append } from "./append";
import { context } from "./context";
import { create } from "./create";
import { deactivate } from "./deactivate";
import { effect, layoutEffect } from "./effect";
import { fallback } from "./fallback";
import { position } from "./position";
import { unmount } from "./unmount";
import { update } from "./update";

import type { MyReactFiberNode, FiberDispatch, MyReactElementNode, createContext, CreateHookParams, MyReactHookNode, RenderScope } from "@my-react/react";

const { safeCallWithFiber, enableStrictLifeCycle } = __my_react_shared__;

export class ClientDispatch implements FiberDispatch {
  strictMap: Record<string, boolean> = {};

  keepLiveMap: Record<string, MyReactFiberNode[]> = {};

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
  resolveRef(_fiber: MyReactFiberNode): void {
    setRef(_fiber);
  }
  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): MyReactHookNode | null {
    return processHookNode(_fiber, _hookParams);
  }
  resolveKeepLive(_fiber: MyReactFiberNode, _element: MyReactElementNode): MyReactFiberNode | null {
    return getKeepLiveFiber(_fiber, this.keepLiveMap, _element);
  }
  resolveKeepLiveMap(_fiber: MyReactFiberNode): void {
    generateKeepLiveMap(_fiber, this.keepLiveMap);
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    generateStrictMap(_fiber, this.strictMap);
  }
  resolveStrictValue(_fiber: MyReactFiberNode): boolean {
    return this.strictMap[_fiber.uid] && enableStrictLifeCycle.current;
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    generateSuspenseMap(_fiber, this.suspenseMap);
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
    processComponentUpdateQueue(_fiber);
  }
  resolveHookQueue(_fiber: MyReactFiberNode): void {
    processHookUpdateQueue(_fiber);
  }
  beginProgressList(_scope: RenderScope): void {
    if (_scope.updateFiberList?.length) {
      _scope.updateFiberListArray.push(_scope.updateFiberList);
    }
    _scope.updateFiberList = new LinkTreeList();
  }
  endProgressList(_scope: RenderScope): void {
    if (_scope.updateFiberList?.length) {
      _scope.updateFiberListArray.push(_scope.updateFiberList);
    }
    _scope.updateFiberList = null;
  }
  generateUpdateList(_fiber: MyReactFiberNode, _scope: RenderScope): void {
    if (_fiber) {
      _scope.updateFiberList = _scope.updateFiberList || new LinkTreeList();
      if (
        _fiber.patch & PATCH_TYPE.__pendingCreate__ ||
        _fiber.patch & PATCH_TYPE.__pendingUpdate__ ||
        _fiber.patch & PATCH_TYPE.__pendingAppend__ ||
        _fiber.patch & PATCH_TYPE.__pendingContext__ ||
        _fiber.patch & PATCH_TYPE.__pendingPosition__ ||
        _fiber.patch & PATCH_TYPE.__pendingDeactivate__
      ) {
        _scope.updateFiberList.append(_fiber, _fiber.fiberIndex);
      } else if (this.effectMap[_fiber.uid]?.length || this.unmountMap[_fiber.uid]?.length || this.layoutEffectMap[_fiber.uid]?.length) {
        _scope.updateFiberList.append(_fiber, _fiber.fiberIndex);
      }
    }
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    const _isSVG = isSVG(_fiber, this.elementTypeMap);

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
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    if (enableFastLoop.current) {
      _list.reconcileList({
        toFoot: (_fiber) => {
          if (_fiber.mount) {
            const _isSVG = isSVG(_fiber, this.elementTypeMap);
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

            safeCallWithFiber({ fiber: _fiber, action: () => deactivate(_fiber) });

            // Promise.resolve().then(() =>
            //   safeCallWithFiber({
            //     fiber: _fiber,
            //     action: () => {
            //       unmount(_fiber);
            //       update(_fiber, false, _isSVG);
            //       append(_fiber);
            //     },
            //   })
            // );

            safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });

            safeCallWithFiber({
              fiber: _fiber,
              action: () => append(_fiber),
            });
          }
        },
        toHead: (_fiber) => {
          if (_fiber.mount) {
            safeCallWithFiber({
              fiber: _fiber,
              action: () => position(_fiber),
            });

            safeCallWithFiber({
              fiber: _fiber,
              action: () => layoutEffect(_fiber),
            });

            // requestAnimationFrame(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

            // setTimeout(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

            Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
          }
        },
      });
    } else {
      _list.listToFoot((_fiber) => {
        if (_fiber.mount) {
          const _isSVG = isSVG(_fiber, this.elementTypeMap);
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

          safeCallWithFiber({ fiber: _fiber, action: () => deactivate(_fiber) });

          safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });
        }
      });

      _list.listToHead((_fiber) => {
        if (_fiber.mount) {
          safeCallWithFiber({
            fiber: _fiber,
            action: () => position(_fiber),
          });
        }
      });

      _list.listToFoot((_fiber) => {
        if (_fiber.mount) {
          safeCallWithFiber({
            fiber: _fiber,
            action: () => append(_fiber),
          });
        }
      });

      _list.reconcile((_fiber) => {
        if (_fiber.mount) {
          safeCallWithFiber({
            fiber: _fiber,
            action: () => layoutEffect(_fiber),
          });

          Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
        }
      });
    }
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
  pendingDeactivate(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__pendingDeactivate__;
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
    delete this.eventMap[_fiber.uid];
    delete this.strictMap[_fiber.uid];
    delete this.effectMap[_fiber.uid];
    delete this.contextMap[_fiber.uid];
    delete this.unmountMap[_fiber.uid];
    delete this.keepLiveMap[_fiber.uid];
    delete this.suspenseMap[_fiber.uid];
    delete this.elementTypeMap[_fiber.uid];
    delete this.layoutEffectMap[_fiber.uid];
  }
}
