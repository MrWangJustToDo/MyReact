import { NODE_TYPE, PATCH_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import { EmptyDispatch } from "../dispatch";
import { getTypeFromElement, isValidElement } from "../element";
import { EmptyRenderScope } from "../scope";

import type { MyReactComponent } from "../component";
import type { FiberDispatch } from "../dispatch";
import type { MyReactElement, MyReactElementNode, MaybeArrayMyReactElementNode } from "../element";
import type { Action, MyReactHookNode } from "../hook";
import type { MyReactInternalInstance } from "../internal";
import type { RenderScope } from "../scope";
import type { HOOK_TYPE } from "@my-react/react-shared";

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

let fiberId = 0;

export class MyReactFiberNode {
  uid: string;

  mounted = true;

  activated = true;

  invoked = false;

  node: RenderNode | null = null;

  children: MyReactFiberNode[] = [];

  return: Array<MyReactFiberNode[] | MyReactFiberNode> | MyReactFiberNode | null = null;

  child: MyReactFiberNode | null = null;

  root: MyReactFiberNodeRoot;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  instance: MyReactInternalInstance | null = null;

  dependence: MyReactInternalInstance[] = [];

  hookNodes: MyReactHookNode[] = [];

  element: MyReactElementNode;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  mode: UPDATE_TYPE = UPDATE_TYPE.__initial__;

  updateQueue: UpdateQueue[] = [];

  pendingProps: MyReactElement["props"] = {};

  memoizedProps: MyReactElement["props"] | null = null;

  constructor(parent: MyReactFiberNode | null, element: MyReactElementNode) {
    this.uid = "fiber_" + fiberId++;
    this.parent = parent;
    this.element = element;
    this.root = this.parent?.root || (this as unknown as MyReactFiberNodeRoot);
    this.initialPops();
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

  initialParent() {
    if (this.parent) this.parent.addChild(this);
    const globalDispatch = this.root.globalDispatch;
    globalDispatch.resolveElementTypeMap(this);
    globalDispatch.resolveSuspenseMap(this);
    globalDispatch.resolveContextMap(this);
    globalDispatch.resolveStrictMap(this);
  }

  // TODO change name to `updateParent`
  installParent(parent: MyReactFiberNode) {
    this.parent = parent;
    this.sibling = null;
    this.parent?.addChild(this);
  }

  addDependence(node: MyReactInternalInstance) {
    if (this.dependence.every((n) => n !== node)) this.dependence.push(node);
  }

  removeDependence(node: MyReactInternalInstance) {
    this.dependence = this.dependence.filter((n) => n !== node);
  }

  beforeUpdate() {
    this.child = null;
    this.children = [];
    this.return = null;
  }

  triggerUpdate() {
    let updateSymbol = UPDATE_TYPE.__initial__;
    updateSymbol |= UPDATE_TYPE.__update__;
    updateSymbol |= UPDATE_TYPE.__trigger__;
    this.mode = updateSymbol;
  }

  prepareUpdate() {
    let updateSymbol = UPDATE_TYPE.__initial__;
    updateSymbol |= UPDATE_TYPE.__update__;
    this.mode = updateSymbol;
  }

  afterUpdate() {
    this.mode = UPDATE_TYPE.__initial__;
  }

  installElement(element: MyReactElementNode) {
    this.element = element;
    this.initialPops();
  }

  initialPops() {
    const element = this.element;
    if (isValidElement(element)) {
      this.pendingProps = Object.assign({}, element.props);
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
    this.hookNodes.push(hookNode);
  }

  applyElement() {
    this.memoizedProps = Object.assign({}, this.pendingProps);
  }

  installInstance(instance: MyReactInternalInstance) {
    this.instance = instance;
  }

  update() {
    if (!this.activated || !this.mounted) return;
    this.root.globalDispatch.trigger(this);
  }

  unmount() {
    this.hookNodes.forEach((hook) => hook.unmount());
    this.instance && this.instance.unmount();
    this.mounted = false;
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
    this.root.globalDispatch.removeFiber(this);
  }

  deactivate() {
    this.hookNodes.forEach((hook) => hook.unmount());
    this.instance && this.instance.unmount();
    this.activated = false;
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
  }
}

export class MyReactFiberNodeRoot extends MyReactFiberNode {
  globalDispatch: FiberDispatch = new EmptyDispatch();

  globalScope: RenderScope = new EmptyRenderScope();
}

export class MyReactFiberNodeDev extends MyReactFiberNode {
  _debugRenderState = {
    renderCount: 0,
    mountTime: 0,
    prevUpdateTime: 0,
    updateTimeStep: 0,
    currentUpdateTime: 0,
  };

  _debugHookTypes: HOOK_TYPE[] = [];

  _debugContextMap: Record<string, MyReactFiberNode> = {};

  _debugDynamicChildren: MaybeArrayMyReactElementNode;

  _debugGlobalDispatch: FiberDispatch | null = null;

  _debugSuspense: MyReactElementNode;

  _debugStrict = false;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any[] }> = {};

  _debugKeepLiveCache: MyReactFiberNode[];
}
