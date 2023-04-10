import { __my_react_shared__ } from "@my-react/react";
import { ListTree, PATCH_TYPE, STATE_TYPE, UniqueArray } from "@my-react/react-shared";

import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";
import { triggerError, triggerUpdate } from "../renderUpdate";
import { getTypeFromElementNode, NODE_TYPE } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactElement, MyReactElementNode, MyReactElementType, MyReactInternalInstance, RenderFiber, RenderHook, UpdateQueue , MyReactComponent} from "@my-react/react";

type NativeNode = Record<string, any>;

const emptyProps = {};

const { enableSyncFlush } = __my_react_shared__;

export class MyReactFiberNode implements RenderFiber {
  ref: MyReactElement["ref"];

  key: MyReactElement["key"];

  state: STATE_TYPE = STATE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  nativeNode: Record<string, any> = null;

  container: MyReactContainer;

  element: MyReactElementNode;

  elementType: MyReactElementType | null;

  hookList: ListTree<RenderHook> = new ListTree();

  dependence: Set<MyReactInternalInstance> = new Set();

  instance: MyReactInternalInstance | null = null;

  child: MyReactFiberNode | null = null;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  updateQueue: ListTree<UpdateQueue> = new ListTree();

  pendingProps: MyReactElement["props"] = emptyProps;

  memoizedProps: MyReactElement["props"] = emptyProps;

  constructor(element: MyReactElementNode) {
    const { key, ref, nodeType, elementType, pendingProps } = getTypeFromElementNode(element);

    this.ref = ref;

    this.key = key;

    this.type = nodeType;

    this.element = element;

    this.elementType = elementType;

    this.pendingProps = pendingProps;
  }

  _addDependence(instance: MyReactInternalInstance): void {
    this.dependence.add(instance);
  }
  _removeDependence(instance: MyReactInternalInstance): void {
    this.dependence.delete(instance);
  }
  _unmount(): void {
    if (this.state & STATE_TYPE.__unmount__) return;

    this.hookList.listToFoot((h) => h._unmount());

    this.instance && this.instance._unmount();

    this.patch = PATCH_TYPE.__initial__;

    this.state = STATE_TYPE.__initial__;
  }
  _prepare(): void {
    const currentIsSync = enableSyncFlush.current;

    const renderPlatform = this.container.renderPlatform;

    const callBack = () => {
      const needUpdate = this.type & NODE_TYPE.__class__ ? processClassComponentUpdateQueue(this) : processFunctionComponentUpdateQueue(this);

      if (needUpdate) this._update(currentIsSync ? STATE_TYPE.__triggerSync__ : STATE_TYPE.__triggerConcurrent__);
    };

    renderPlatform.microTask(callBack);
  }
  _update(state?: STATE_TYPE) {
    if (this.state & STATE_TYPE.__unmount__) return;

    triggerUpdate(this, state || STATE_TYPE.__triggerSync__);
  }
  _error(error: Error) {
    if (this.state & STATE_TYPE.__unmount__) return;

    triggerError(this, error);
  }
}

export class MyReactFiberContainer extends MyReactFiberNode {
  containerNode: NativeNode;

  constructor(element: MyReactElement, containerNode: NativeNode) {
    super(element);

    this.containerNode = containerNode;
  }
}

export class MyReactContainer {
  rootNode: NativeNode;

  rootFiber: MyReactFiberNode;

  renderDispatch: CustomRenderDispatch;

  renderPlatform: CustomRenderPlatform;

  isAppMounted = false;

  isAppCrashed = false;

  scheduledFiber: MyReactFiberNode | null = null;

  errorBoundaryInstance: MyReactComponent | null = null;

  nextWorkingFiber: MyReactFiberNode | null = null;

  commitFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray();

  constructor(rootNode: NativeNode, rootFiber: MyReactFiberNode, renderPlatform: CustomRenderPlatform, renderDispatch: CustomRenderDispatch) {
    this.rootNode = rootNode;

    this.rootFiber = rootFiber;

    this.renderPlatform = renderPlatform;

    this.renderDispatch = renderDispatch;
  }

  _generateCommitList(_fiber: MyReactFiberNode) {
    if (!_fiber) return;

    if (_fiber.patch !== PATCH_TYPE.__initial__) {
      this.commitFiberList = this.commitFiberList || new ListTree();

      this.commitFiberList.push(_fiber);
    }
  }
}
