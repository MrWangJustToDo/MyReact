import { NODE_TYPE, PATCH_TYPE, UPDATE_TYPE, ListTree } from "@my-react/react-shared";

import { getTypeFromElement, isValidElement } from "../element";

import { checkFiberElement, checkFiberHook, checkFiberInstance } from "./check";

import type { MyReactComponent } from "../component";
import type { MyReactElement, MyReactElementNode } from "../element";
import type { Action, MyReactHookNode } from "../hook";
import type { MyReactInternalInstance } from "../internal";
import type { RenderController } from "../renderController";
import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../renderPlatform";
import type { RenderScope } from "../renderScope";

type RenderNode = { [p: string]: any };

export type ComponentUpdateQueue = {
  type: "component";
  trigger: MyReactComponent;
  isForce?: boolean;
  payLoad?: Record<string, unknown> | ((state: Record<string, unknown>, props: Record<string, unknown>) => Record<string, unknown>);
  callback?: () => void;
};

export type HookUpdateQueue = {
  type: "hook";
  trigger: MyReactHookNode;
  isForce?: boolean;
  payLoad?: Action;
  callback?: () => void;
};

export type UpdateQueue = ComponentUpdateQueue | HookUpdateQueue;

const emptyObj = {};

export class MyReactFiberNode {
  isMounted = true;

  // TODO
  // isActivated = true;

  isInvoked = false;

  node: RenderNode | null = null;

  ref: MyReactElement["ref"] = null;

  children: MyReactFiberNode[] = [];

  return: Array<MyReactFiberNode[] | MyReactFiberNode> | MyReactFiberNode | null = null;

  child: MyReactFiberNode | null = null;

  root: MyReactFiberNodeRoot;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  instance: MyReactInternalInstance | null = null;

  dependence: Set<MyReactInternalInstance> = new Set();

  hookNodes: MyReactHookNode[] = [];

  element: MyReactElementNode;

  elementType: MyReactElement["type"] | null = null;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  mode: UPDATE_TYPE = UPDATE_TYPE.__initial__;

  updateQueue: ListTree<UpdateQueue> = new ListTree();

  pendingProps: MyReactElement["props"] = emptyObj;

  memoizedProps: MyReactElement["props"] | null = null;

  constructor(parent: MyReactFiberNode | null, element: MyReactElementNode) {
    this.root = parent?.root || (this as unknown as MyReactFiberNodeRoot);

    this._initialElement(element);

    this._installParent(parent);
  }

  _addChild(child: MyReactFiberNode) {
    const last = this.children[this.children.length - 1];

    if (last) {
      last.sibling = child;
    } else {
      this.child = child;
    }

    this.children.push(child);
  }

  _installParent(parent: MyReactFiberNode | null) {
    this.parent = parent;

    this.sibling = null;

    this.parent?._addChild(this);
  }

  _addDependence(node: MyReactInternalInstance) {
    this.dependence.add(node);
  }

  _removeDependence(node: MyReactInternalInstance) {
    this.dependence.delete(node);
  }

  _beforeUpdate() {
    this.child = null;

    this.children = [];

    this.return = null;
  }

  // current fiber call .update() function
  _triggerUpdate() {
    this.mode |= UPDATE_TYPE.__trigger__;
  }

  // parent fiber update, then child need update too
  _prepareUpdate() {
    this.mode |= UPDATE_TYPE.__update__;
  }

  _afterUpdate() {
    this.mode = UPDATE_TYPE.__initial__;
  }

  _initialElement(element: MyReactElementNode) {
    this.element = element;

    this._initialType();

    this._initialPops();
  }

  _installElement(element: MyReactElementNode) {
    if (__DEV__) checkFiberElement(this, element);

    this.element = element;

    this._initialPops();
  }

  _initialPops() {
    const element = this.element;
    if (isValidElement(element)) {
      this.pendingProps = Object.assign({}, element.props);
      this.ref = element.ref;
      this.elementType = element.type;
    } else {
      this.pendingProps = {};
    }
  }

  _initialType() {
    const element = this.element;
    const type = getTypeFromElement(element);
    this.type = type;
  }

  _addHook(hookNode: MyReactHookNode) {
    if (__DEV__) checkFiberHook(this, hookNode);
    this.hookNodes.push(hookNode);
  }

  _applyProps() {
    this.memoizedProps = Object.assign({}, this.pendingProps);
  }

  _installInstance(instance: MyReactInternalInstance) {
    if (__DEV__) checkFiberInstance(this, instance);
    this.instance = instance;
  }

  // force update current fiber and loop to the end
  _update() {
    if (!this.isMounted) return;
    this.root.renderDispatch.triggerUpdate(this);
  }

  _error(error: Error) {
    if (!this.isMounted) return;
    this.root.renderDispatch.triggerError(this, error);
  }

  _unmount() {
    if (!this.isMounted) return;
    this.hookNodes.forEach((h) => h._unmount());
    this.instance && this.instance._unmount();
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
  }
}

export interface MyReactFiberNodeRoot extends MyReactFiberNode {
  renderScope: RenderScope;

  renderDispatch: RenderDispatch;

  renderPlatform: RenderPlatform;

  renderController: RenderController;
}
