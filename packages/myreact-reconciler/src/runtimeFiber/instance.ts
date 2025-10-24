import { include, PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { type CustomRenderDispatch } from "../renderDispatch";
import { getFiberTreeWithFiber, getTypeFromElementNode, NODE_TYPE } from "../share";

import { hmrRevert, hmrUpdate } from "./hmr";
import { triggerUpdateOnFiber } from "./trigger";

import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElement, MyReactElementNode, MyReactElementType, MyReactInternalInstance, RenderFiber, RenderHook, UpdateQueue } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

type NativeNode = Record<string, any>;

export const emptyProps = {};

export class MyReactFiberNode implements RenderFiber {
  ref: MyReactElement["ref"];

  key: MyReactElement["key"];

  state: STATE_TYPE = STATE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  nativeNode: Record<string, any>;

  elementType: MyReactElementType | null;

  elementRawType: MyReactElementType | null;

  hookList: ListTree<RenderHook> | null;

  dependence: Set<MyReactInternalInstance> | null;

  instance: MyReactInternalInstance | null;

  child: MyReactFiberNode | null = null;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  updateQueue: ListTree<UpdateQueue> | null;

  pendingProps: MyReactElement["props"] = emptyProps;

  memoizedProps: MyReactElement["props"] = emptyProps;

  refCleanup?: () => void;

  pendingState: Record<string, unknown>;

  memoizedState: Record<string, unknown>;

  pendingText: string;

  memoizedText: string;

  constructor(element: MyReactElementNode) {
    this.state = STATE_TYPE.__create__;

    this._installElement(element);
  }

  _installElement(element: MyReactElementNode) {
    const { key, ref, nodeType, elementType, pendingProps, pendingText } = getTypeFromElementNode(element);

    this.ref = ref;

    this.key = key;

    this.type = nodeType;

    this.elementType = elementType;

    if (include(nodeType, NODE_TYPE.__function__)) {
      this.elementRawType = (element as MyReactElement)?.type;
    }

    this.pendingProps = pendingProps;

    if (typeof pendingText === "string") {
      this.pendingText = pendingText;
    }

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

  Object.defineProperty(MyReactFiberNode.prototype, "__dev_hmr_revert__", {
    value: hmrRevert,
    configurable: true,
  });

  Object.defineProperty(MyReactFiberNode.prototype, "__dev_hmr_update__", {
    value: hmrUpdate,
    configurable: true,
  });
}

export interface MyReactFiberContainer extends MyReactFiberNode {
  containerNode: NativeNode;
}

export interface MyReactFiberRoot extends MyReactFiberNode {
  renderDispatch: CustomRenderDispatch;
}
