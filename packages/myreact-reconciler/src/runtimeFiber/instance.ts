import { ListTree, PATCH_TYPE, STATE_TYPE, UniqueArray } from "@my-react/react-shared";

import { triggerError, triggerRoot } from "../renderUpdate";
import { getTypeFromElementNode, NODE_TYPE } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactElement, MyReactElementNode, MyReactElementType, MyReactInternalInstance, RenderFiber, RenderHook, UpdateQueue } from "@my-react/react";

type NativeNode = Record<string, any>;

const emptyProps = {};

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
  _update(): void {
    if (this.state & STATE_TYPE.__unmount__) return;
    this.state = STATE_TYPE.__trigger__;
    triggerRoot(this.container.rootFiber);
    // triggerUpdate(this);
  }
  _error(_error: Error): void {
    if (this.state & STATE_TYPE.__unmount__) return;
    triggerError(this, _error);
  }
  _unmount(): void {
    if (this.state & STATE_TYPE.__unmount__) return;
    this.hookList.listToFoot((h) => h._unmount());
    this.instance && this.instance._unmount();
    this.state = STATE_TYPE.__unmount__;
    this.patch = PATCH_TYPE.__initial__;
  }
}

export class MyReactFiberRoot extends MyReactFiberNode {
  constructor(element: MyReactElement, nativeNode: NativeNode) {
    super(element);

    this.nativeNode = nativeNode;
  }
}

export class MyReactContainer {
  rootNode: NativeNode;

  rootFiber: MyReactFiberNode;

  renderDispatch: CustomRenderDispatch;

  renderPlatform: CustomRenderPlatform;

  isAppMounted: boolean;

  isAppCrashed: boolean;

  triggeredFiber: MyReactFiberNode | null = null;

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
    if (_fiber.patch & PATCH_TYPE.__needCommit__) {
      this.commitFiberList = this.commitFiberList || new ListTree();

      this.commitFiberList.push(_fiber);
    }
  }
}
