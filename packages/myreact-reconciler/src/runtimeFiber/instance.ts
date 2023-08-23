import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, include, merge } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";
import { triggerError, triggerRevert, triggerUpdate } from "../renderUpdate";
import { getTypeFromElementNode, NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElement, MyReactElementNode, MyReactElementType, MyReactInternalInstance, RenderFiber, RenderHook, UpdateQueue } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

type NativeNode = Record<string, any>;

const { currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

export const emptyProps = {};

export type PendingStateType = {
  isForce: boolean;
  callback: Array<() => void>;
  pendingState: Record<string, unknown>;
};

export type PendingStateTypeWithError = {
  state?: PendingStateType;
  error?: ErrorType;
};

export type MemoizedStateType = Record<string, unknown>;

export type MemoizedStateTypeWithError = {
  stableState?: MemoizedStateType;
  revertState?: MemoizedStateType;
};

export type ErrorType = {
  stack: string;
  error: Error;
  // used for revert from error for hmr
  revertState: Record<string, unknown>;
};

export class MyReactFiberNode implements RenderFiber {
  ref: MyReactElement["ref"];

  key: MyReactElement["key"];

  state: STATE_TYPE = STATE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  nativeNode: Record<string, any>;

  elementType: MyReactElementType | null;

  hookList: ListTree<RenderHook> | null;

  dependence: Set<MyReactInternalInstance> | null;

  instance: MyReactInternalInstance | null;

  child: MyReactFiberNode | null = null;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  updateQueue: ListTree<UpdateQueue> | null;

  pendingProps: MyReactElement["props"] = emptyProps;

  memoizedProps: MyReactElement["props"] = emptyProps;

  pendingState: PendingStateTypeWithError | PendingStateType;

  memoizedState: MemoizedStateTypeWithError | MemoizedStateType;

  _revert: () => void;

  constructor(element: MyReactElementNode) {
    this.state = STATE_TYPE.__create__;

    this._installElement(element);
  }

  _installElement(element: MyReactElementNode) {
    const { key, ref, nodeType, elementType, pendingProps } = getTypeFromElementNode(element);

    this.ref = ref;

    this.key = key;

    this.type = nodeType;

    this.elementType = elementType;

    this.pendingProps = pendingProps;

    if (__DEV__) {
      const typeThis = this as unknown as MyReactFiberNodeDev;

      typeThis._debugElement = element;
    }
  }
  _addDependence(instance: MyReactInternalInstance): void {
    this.dependence = this.dependence || new Set();

    this.dependence.add(instance);
  }
  _removeDependence(instance: MyReactInternalInstance): void {
    this.dependence.delete(instance);
  }
  _unmount(): void {
    if (include(this.state, STATE_TYPE.__unmount__)) return;

    this.hookList?.listToFoot((h) => h._unmount());

    this.instance && this.instance._unmount();

    this.patch = PATCH_TYPE.__initial__;

    this.state = STATE_TYPE.__initial__;
  }
  _prepare(): void {
    const renderPlatform = currentRenderPlatform.current;

    const processQueue = () => {
      const flag = enableConcurrentMode.current;

      const needUpdate = include(this.type, NODE_TYPE.__class__)
        ? processClassComponentUpdateQueue(this, flag)
        : processFunctionComponentUpdateQueue(this, flag);

      if (needUpdate?.needUpdate) this._update(needUpdate.isSync ? STATE_TYPE.__triggerSync__ : STATE_TYPE.__triggerConcurrent__);
    };

    renderPlatform.microTask(processQueue);
  }
  _update(state?: STATE_TYPE) {
    if (include(this.state, STATE_TYPE.__unmount__)) return;

    state = state || STATE_TYPE.__triggerSync__;

    if (this.state === STATE_TYPE.__stable__) {
      this.state = state;
    } else {
      this.state = merge(this.state, state);
    }

    triggerUpdate(this);
  }
  _error(error: Error) {
    if (include(this.state, STATE_TYPE.__unmount__)) return;

    triggerError(this, error);
  }
}

if (__DEV__) {
  MyReactFiberNode.prototype._revert = function () {
    if (include(this.state, STATE_TYPE.__unmount__)) return;

    triggerRevert(this);
  };
}

export interface MyReactFiberContainer extends MyReactFiberNode {
  containerNode: NativeNode;
}
