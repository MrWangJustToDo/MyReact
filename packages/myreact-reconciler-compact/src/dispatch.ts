/* eslint-disable @typescript-eslint/no-this-alias */
import { __my_react_internal__ } from "@my-react/react";
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
  getCurrentDispatchFromFiber,
  getCurrentDispatchFromType,
  getCurrentFibersFromType,
  hmr,
  setRefreshHandler,
  typeToFibersMap,
} from "@my-react/react-reconciler";

import { append, create, position, remove, setRef, unsetRef, update } from "./api";
import { ReconcilerDispatchFiber } from "./dispatchFiber";
import { initialMap, unmountMap } from "./dispatchMap";
import { ReconcilerDispatchMount } from "./dispatchMount";
import { ReconcilerDispatchUpdate } from "./dispatchUpdate";

import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react";
import type { MyReactFiberRoot, MyReactFiberNode, HMR } from "@my-react/react-reconciler";
import type { ListTree } from "@my-react/react-shared";

const { currentComponentFiber } = __my_react_internal__;

const initialRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,
};

export const createDispatch = (rootNode: any, rootFiber: MyReactFiberRoot, rootElement: MyReactElementNode, config: any, flag: number) => {
  class ReconcilerDispatch extends CustomRenderDispatch {
    enableUpdate = true;

    enableAsyncLoad = true;

    runtimeDom = {
      hostContextMap: new WeakMap<MyReactFiberNode, any>(),
      elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    };

    runtimeRef = initialRef;

    dispatchFiber(_fiber: MyReactFiberNode): void {
      ReconcilerDispatchFiber(this, _fiber);
    }

    commitCreate(_fiber: MyReactFiberNode): void {
      create(this, _fiber, config);
    }

    commitUpdate(_fiber: MyReactFiberNode): void {
      update(this, _fiber, config);
    }

    commitAppend(_fiber: MyReactFiberNode): void {
      append(this, _fiber, config);
    }

    commitPosition(_fiber: MyReactFiberNode): void {
      position(this, _fiber, config);
    }

    commitSetRef(_fiber: MyReactFiberNode): void {
      setRef(_fiber, config);
    }

    commitUnsetRef(_fiber: MyReactFiberNode): void {
      unsetRef(_fiber);
    }

    commitClear(_fiber: MyReactFiberNode): void {
      remove(this, _fiber, config);
    }

    reconcileCommit(_fiber: MyReactFiberNode): void {
      config.prepareForCommit?.(rootNode);

      const instance = this;

      safeCall(function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      });

      safeCall(function safeCallBeforeCommitListener() {
        listenerMap.get(instance).beforeCommitMount.forEach((cb) => cb());
      });

      ReconcilerDispatchMount(this, _fiber, config);

      safeCall(function safeCallAfterCommitListener() {
        listenerMap.get(instance).afterCommitMount.forEach((cb) => cb());
      });

      safeCall(function safeCallAfterCommit() {
        instance.afterCommit?.();
      });

      config.resetAfterCommit?.(rootNode);
    }

    reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
      config.prepareForCommit?.(rootNode);

      const instance = this;

      safeCall(function safeCallBeforeUpdate() {
        instance.beforeUpdate?.();
      });

      safeCall(function safeCallBeforeUpdateListener() {
        listenerMap.get(instance).beforeCommitUpdate.forEach((cb) => cb());
      });

      ReconcilerDispatchUpdate(this, _list, config);

      safeCall(function safeCallAfterUpdateListener() {
        listenerMap.get(instance).afterCommitUpdate.forEach((cb) => cb());
      });

      safeCall(function safeCallAfterUpdate() {
        instance.afterUpdate?.();
      });

      config.resetAfterCommit?.(rootNode);
    }

    patchToFiberInitial(_fiber: MyReactFiberNode): void {
      initialMap(this, _fiber, config);
    }

    patchToFiberUnmount(_fiber: MyReactFiberNode): void {
      unmountMap(this, _fiber);
    }

    dispatchState(_params: UpdateQueue): void {
      return processState(this, _params);
    }

    dispatchHook(_params: RenderHookParams): unknown {
      return processHook(this, _params);
    }

    dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
      return processPromise(this, _params.fiber, _params.promise);
    }

    dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
      if (__DEV__) {
        devErrorWithFiber(_params.fiber, _params.error);
      }

      triggerError(this, _params.fiber, _params.error);

      return void 0;
    }
  }

  if (__DEV__) {
    Object.defineProperty(ReconcilerDispatch.prototype, "__dev_hmr_runtime__", {
      value: {
        hmr,
        typeToFibersMap,
        setRefreshHandler,
        currentComponentFiber,
        getCurrentFibersFromType,
        getCurrentDispatchFromType,
        getCurrentDispatchFromFiber,
      } as HMR,
    });

    Object.defineProperty(ReconcilerDispatch.prototype, "__dev_hmr_remount__", {
      value: function hmrRemount(this: MyReactFiberNode, cb?: () => void) {
        console.log("not implement yet");
        cb?.();
      },
    });
  }

  const dispatch = new ReconcilerDispatch(rootNode, rootFiber, rootElement);

  dispatch.enableConcurrentMode = flag !== 0;

  dispatch.renderMode = flag !== 0 ? "concurrent" : "legacy";

  return dispatch;
};

export type ReconcilerDispatch = ReturnType<typeof createDispatch>;
