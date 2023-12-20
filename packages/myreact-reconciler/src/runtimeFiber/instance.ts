import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";
import { triggerRevert, triggerUpdate } from "../renderUpdate";
import { getFiberTreeWithFiber, getTypeFromElementNode, NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElement, MyReactElementNode, MyReactElementType, MyReactInternalInstance, RenderFiber, RenderHook, UpdateQueue } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

type NativeNode = Record<string, any>;

const { currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

export const emptyProps = {};

export class MyReactFiberNode implements RenderFiber {
  ref: MyReactElement["ref"];

  key: MyReactElement["key"];

  state: STATE_TYPE = STATE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  mode: 0 | 1 = 0;

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

  pendingState: Record<string, unknown>;

  memoizedState: Record<string, unknown>;

  _devRevert: (cb?: () => void) => void;

  _devUpdate: (state?: STATE_TYPE, cb?: () => void) => void;

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
  _prepare(initial?: boolean): void {
    const renderPlatform = currentRenderPlatform.current;

    const processQueue = () => {
      const flag = enableConcurrentMode.current;

      const updateState = include(this.type, NODE_TYPE.__class__)
        ? processClassComponentUpdateQueue(this, flag)
        : processFunctionComponentUpdateQueue(this, flag);

      if (updateState?.needUpdate) {
        if (updateState.isSync) {
          renderPlatform.microTask(() =>
            triggerUpdate(this, updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__, updateState.callback)
          );
        } else {
          renderPlatform.microTask(() =>
            triggerUpdate(this, updateState.isForce ? STATE_TYPE.__triggerConcurrentForce__ : STATE_TYPE.__triggerConcurrent__, updateState.callback)
          );
        }
      }
    };

    if (initial) {
      processQueue();
    } else {
      renderPlatform.microTask(processQueue);
    }
  }
  _update(state?: STATE_TYPE) {
    if (include(this.state, STATE_TYPE.__unmount__)) return;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.microTask(() => triggerUpdate(this, state));
  }
}

if (__DEV__) {
  Object.defineProperty(MyReactFiberNode.prototype, "_debugLogTree", {
    get: function (this: MyReactFiberNode) {
      const { str, arr } = getFiberTreeWithFiber(this);

      console.log(str, ...arr);

      return true;
    },
  });
  Object.defineProperty(MyReactFiberNode.prototype, "_devRevert", {
    value: function (this: MyReactFiberNode, cb?: () => void) {
      if (include(this.state, STATE_TYPE.__unmount__)) return;

      triggerRevert(this, cb);
    },
  });
  Object.defineProperty(MyReactFiberNode.prototype, "_devUpdate", {
    value: function (this: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) {
      if (include(this.state, STATE_TYPE.__unmount__)) return;

      const renderPlatform = currentRenderPlatform.current;

      renderPlatform.microTask(() => triggerUpdate(this, state, cb));
    },
  });
}

export interface MyReactFiberContainer extends MyReactFiberNode {
  containerNode: NativeNode;
}
