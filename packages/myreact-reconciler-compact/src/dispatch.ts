/* eslint-disable @typescript-eslint/no-this-alias */
import {
  CustomRenderDispatch,
  NODE_TYPE,
  safeCall,
  listenerMap,
  processState,
  processHook,
  devErrorWithFiber,
  triggerError,
  processPromise,
} from "@my-react/react-reconciler";

import { append, create, position, remove, setRef, unsetRef, update } from "./api";
import { ReconcilerDispatchFiber } from "./dispatchFiber";
import { initialMap, unmountMap } from "./dispatchMap";
import { ReconcilerDispatchMount } from "./dispatchMount";

import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react";
import type { MyReactFiberRoot, MyReactFiberNode } from "@my-react/react-reconciler";
import type { ListTree } from "@my-react/react-shared";

const initialRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,
};

export const createDispatch = (rootNode: any, rootFiber: MyReactFiberRoot, rootElement: MyReactElementNode, config: any) => {
  class ReconcilerDispatch extends CustomRenderDispatch {
    enableUpdate = true;

    runtimeDom = {
      hostContextMap: new WeakMap<MyReactFiberNode, any>(),
      elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    };

    runtimeRef = initialRef;

    dispatchFiber(_fiber: MyReactFiberNode): void {
      ReconcilerDispatchFiber(_fiber);
    }

    commitCreate(_fiber: MyReactFiberNode): void {
      create(_fiber, this, config);
    }

    commitUpdate(_fiber: MyReactFiberNode): void {
      update(_fiber, this, config);
    }

    commitAppend(_fiber: MyReactFiberNode): void {
      append(_fiber, this, config);
    }

    commitPosition(_fiber: MyReactFiberNode): void {
      position(_fiber, this, config);
    }

    commitSetRef(_fiber: MyReactFiberNode): void {
      setRef(_fiber, config);
    }

    commitUnsetRef(_fiber: MyReactFiberNode): void {
      unsetRef(_fiber);
    }

    commitClear(_fiber: MyReactFiberNode): void {
      remove(_fiber, this, config);
    }

    reconcileCommit(_fiber: MyReactFiberNode): void {
      config.prepareForCommit?.(rootNode);

      const instance = this;

      safeCall(function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      });

      safeCall(function safeCallBeforeCommitListener() {
        listenerMap.get(instance).beforeCommit.forEach((cb) => cb());
      });

      ReconcilerDispatchMount(_fiber, this, config);

      safeCall(function safeCallAfterCommitListener() {
        listenerMap.get(instance).afterCommit.forEach((cb) => cb());
      });

      safeCall(function safeCallAfterCommit() {
        instance.afterCommit?.();
      });

      config.resetAfterCommit?.(rootNode);
    }

    reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
      config.prepareForCommit?.(rootNode);

      super.reconcileUpdate(_list);

      config.resetAfterCommit?.(rootNode);
    }

    patchToFiberInitial(_fiber: MyReactFiberNode): void {
      initialMap(_fiber, this, config);
    }

    patchToFiberUnmount(_fiber: MyReactFiberNode): void {
      unmountMap(_fiber, this);
    }

    dispatchState(_params: UpdateQueue): void {
      return processState(_params);
    }

    dispatchHook(_params: RenderHookParams): unknown {
      return processHook(_params);
    }

    dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
      return processPromise(_params.fiber, _params.promise);
    }

    dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
      if (__DEV__) {
        devErrorWithFiber(_params.fiber, _params.error);
      }

      triggerError(_params.fiber, _params.error);

      return void 0;
    }
  }

  return new ReconcilerDispatch(rootNode, rootFiber, rootElement);
};

export type ReconcilerDispatch = ReturnType<typeof createDispatch>;
