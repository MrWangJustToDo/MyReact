import { NODE_TYPE, PATCH_TYPE, UPDATE_TYPE, ListTree } from "@my-react/react-shared";

import { getTypeFromElement, isValidElement } from "../element";

import { checkFiberElement, checkFiberHook, checkFiberInstance } from "./check";

import type { MyReactComponent } from "../component";
import type { RenderController } from "../controller";
import type { FiberDispatch } from "../dispatch";
import type { MyReactElement, MyReactElementNode } from "../element";
import type { Action, MyReactHookNode } from "../hook";
import type { MyReactInternalInstance } from "../internal";
import type { RenderPlatform } from "../platform";
import type { RenderScope } from "../scope";

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

  // rollback current version of keepLive logic
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

    this.initialElement(element);

    this.installParent(parent);
  }

  addChild(child: MyReactFiberNode) {
    const last = this.children[this.children.length - 1];

    if (last) {
      last.sibling = child;
    } else {
      this.child = child;
    }

    this.children.push(child);
  }

  installParent(parent: MyReactFiberNode | null) {
    this.parent = parent;

    this.sibling = null;

    this.parent?.addChild(this);
  }

  addDependence(node: MyReactInternalInstance) {
    this.dependence.add(node);
  }

  removeDependence(node: MyReactInternalInstance) {
    this.dependence.delete(node);
  }

  beforeUpdate() {
    this.child = null;

    this.children = [];

    this.return = null;
  }

  // current fiber call .update() function
  triggerUpdate() {
    this.mode |= UPDATE_TYPE.__trigger__;
  }

  // parent fiber update, then child need update too
  prepareUpdate() {
    this.mode |= UPDATE_TYPE.__update__;
  }

  afterUpdate() {
    this.mode = UPDATE_TYPE.__initial__;
  }

  initialElement(element: MyReactElementNode) {
    this.element = element;

    this.initialType();

    this.initialPops();
  }

  installElement(element: MyReactElementNode) {
    if (__DEV__) checkFiberElement(this, element);

    this.element = element;

    this.initialPops();
  }

  initialPops() {
    const element = this.element;
    if (isValidElement(element)) {
      this.pendingProps = Object.assign({}, element.props);
      this.ref = element.ref;
      this.elementType = element.type;
    } else {
      this.pendingProps = {};
    }
  }

  initialType() {
    const element = this.element;
    const type = getTypeFromElement(element);
    this.type = type;
  }

  addHook(hookNode: MyReactHookNode) {
    if (__DEV__) checkFiberHook(this, hookNode);
    this.hookNodes.push(hookNode);
  }

  applyProps() {
    this.memoizedProps = Object.assign({}, this.pendingProps);
  }

  installInstance(instance: MyReactInternalInstance) {
    if (__DEV__) checkFiberInstance(this, instance);
    this.instance = instance;
  }

  // force update current fiber and loop to the end
  update() {
    if (!this.isMounted) return;
    this.root.renderDispatch.triggerUpdate(this);
  }

  error(error: Error) {
    if (!this.isMounted) return;
    this.root.renderDispatch.triggerError(this, error);
  }

  unmount() {
    if (!this.isMounted) return;
    this.hookNodes.forEach((h) => h.unmount());
    this.instance && this.instance.unmount();
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
  }

  // clear() {
  //   this.node = null;
  //   this.child = null;
  //   this.return = null;
  //   this.parent = null;
  //   this.sibling = null;
  //   this.children = null;
  //   this.instance = null;
  //   this.hookNodes = null;
  //   this.dependence = null;
  //   this.isMounted = false;
  // }
}

export interface MyReactFiberNodeRoot extends MyReactFiberNode {
  renderScope: RenderScope;

  renderDispatch: FiberDispatch;

  renderPlatform: RenderPlatform;

  renderController: RenderController;
}
