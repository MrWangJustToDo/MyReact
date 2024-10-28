import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue, processLazyComponentUpdate } from "../dispatchQueue";
import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { triggerRevert, triggerUpdate } from "../renderUpdate";
import { getFiberTreeWithFiber, getTypeFromElementNode, NODE_TYPE, safeCallWithFiber } from "../share";

import type { MyReactFiberNodeDev } from "./interface";
import type { UpdateState } from "../dispatchQueue";
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

    return element;
  }
  _addDependence(instance: MyReactInternalInstance): void {
    this.dependence = this.dependence || new Set();

    this.dependence.add(instance);
  }
  _delDependence(instance: MyReactInternalInstance): void {
    this.dependence?.delete(instance);
  }
  _update(state?: STATE_TYPE) {
    triggerUpdateOnFiber(this, state);
  }
}

export const prepareUpdateOnFiber = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, isImmediate?: boolean) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const processQueue = () => {
    const flag = enableConcurrentMode.current;

    let updateState: UpdateState | null = null;

    if (include(fiber.type, NODE_TYPE.__class__)) {
      updateState = processClassComponentUpdateQueue(fiber, renderDispatch, flag);
    } else if (include(fiber.type, NODE_TYPE.__function__)) {
      updateState = processFunctionComponentUpdateQueue(fiber, renderDispatch, flag);
    } else if (include(fiber.type, NODE_TYPE.__lazy__)) {
      updateState = processLazyComponentUpdate(fiber);
    } else {
      throw new Error("unknown runtime error, this is a bug for @my-react");
    }

    if (updateState?.needUpdate) {
      safeCallWithFiber({
        fiber,
        action: function safeCallFiberTriggerListener() {
          listenerMap.get(renderDispatch)?.fiberTrigger?.forEach((cb) => cb(fiber, updateState));
        },
      });

      safeCallWithFiber({
        fiber,
        action: function safeCallFiberUpdateListener() {
          listenerMap.get(renderDispatch)?.fiberUpdate?.forEach((cb) => cb(fiber));
        },
      });

      if (updateState.isSync) {
        renderPlatform.microTask(function triggerSyncUpdateOnFiber() {
          triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerSyncForce__ : STATE_TYPE.__triggerSync__, updateState.callback);
        });
      } else {
        renderPlatform.microTask(function triggerConcurrentUpdateOnFiber() {
          triggerUpdate(fiber, updateState.isForce ? STATE_TYPE.__triggerConcurrentForce__ : STATE_TYPE.__triggerConcurrent__, updateState.callback);
        });
      }
    }
  };

  if (isImmediate) {
    if (__DEV__) {
      (function processQueueImmediately() {
        processQueue();
      })();
    } else {
      processQueue();
    }
  } else {
    if (__DEV__) {
      renderPlatform.microTask(function processQueueAsync() {
        processQueue();
      });
    } else {
      renderPlatform.microTask(processQueue);
    }
  }
};

export const triggerUpdateOnFiber = (fiber: MyReactFiberNode, state?: STATE_TYPE) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  renderPlatform.microTask(function triggerUpdateOnFiber() {
    triggerUpdate(fiber, state);
  });
};

function hmrRevert(this: MyReactFiberNode, cb?: () => void) {
  if (include(this.state, STATE_TYPE.__unmount__)) return;

  triggerRevert(this, cb);
}

function hmrUpdate(this: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) {
  if (include(this.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const fiber = this;

  renderPlatform.microTask(function triggerHMRUpdateOnFiber() {
    triggerUpdate(fiber, state, cb);
  });
}

Object.defineProperty(MyReactFiberNode.prototype, "isMyReactFiberNode", {
  value: true,
  configurable: true,
});

Object.defineProperty(MyReactFiberNode.prototype, "return", {
  get: function (this: MyReactFiberNode) {
    return this.parent;
  },
  configurable: true,
});

Object.defineProperty(MyReactFiberNode.prototype, "stateNode", {
  get: function (this: MyReactFiberNode | MyReactFiberContainer) {
    return this.nativeNode || (this as MyReactFiberContainer).containerNode;
  },
  configurable: true,
});

if (__DEV__) {
  Object.defineProperty(MyReactFiberNode.prototype, "_debugLog", {
    get: function (this: MyReactFiberNode) {
      const { str, arr } = getFiberTreeWithFiber(this);

      console.log(str, ...arr);

      return true;
    },
    configurable: true,
  });

  Object.defineProperty(MyReactFiberNode.prototype, "__hmr_revert__", {
    value: hmrRevert,
    configurable: true,
  });

  Object.defineProperty(MyReactFiberNode.prototype, "__hmr_update__", {
    value: hmrUpdate,
    configurable: true,
  });

  // TODO remove
  Object.defineProperty(MyReactFiberNode.prototype, "_devRevert", {
    value: hmrRevert,
  });

  // TODO remove
  Object.defineProperty(MyReactFiberNode.prototype, "_devUpdate", {
    value: hmrUpdate,
  });
}

export interface MyReactFiberContainer extends MyReactFiberNode {
  containerNode: NativeNode;
  renderDispatch: CustomRenderDispatch;
}
