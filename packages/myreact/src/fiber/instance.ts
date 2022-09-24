import { NODE_TYPE, PATCH_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import { EmptyDispatch } from "../dispatch";
import { getTypeFromElement, isValidElement } from "../element";
import { EmptyRenderScope } from "../scope";

import { checkFiberElement, checkFiberHook, checkFiberInstance } from "./check";

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

  fiberIndex: number;

  mount = true;

  invoked = false;

  node: RenderNode | null = null;

  children: MyReactFiberNode[] = [];

  renderedChildren: Array<MyReactFiberNode[] | MyReactFiberNode> = [];

  childListHead: MyReactFiberNode | null = null;

  childListFoot: MyReactFiberNode | null = null;

  child: MyReactFiberNode | null = null;

  root: MyReactFiberNodeRoot;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  instance: MyReactInternalInstance | null = null;

  // current fiber all the context
  context: MyReactFiberNode[] = [];

  dependence: MyReactInternalInstance[] = [];

  hookNodeArray: MyReactHookNode[] = [];

  hookTypeArray: HOOK_TYPE[] = [];

  hookListHead: MyReactHookNode | null = null;

  hookListFoot: MyReactHookNode | null = null;

  element: MyReactElementNode;

  type: NODE_TYPE = NODE_TYPE.__initial__;

  patch: PATCH_TYPE = PATCH_TYPE.__initial__;

  mode: UPDATE_TYPE = UPDATE_TYPE.__initial__;

  updateQueue: UpdateQueue[] = [];

  pendingProps: MyReactElement["props"] = {};

  memoizedProps: MyReactElement["props"] | null = null;

  constructor(fiberIndex: number, parent: MyReactFiberNode | null, element: MyReactElementNode) {
    this.uid = "my_react_" + fiberId++;
    this.fiberIndex = fiberIndex;
    this.parent = parent;
    this.element = element;
    this.root = this.parent?.root || (this as unknown as MyReactFiberNodeRoot);
    this.initialPops();
  }

  addChild(child: MyReactFiberNode) {
    this.children.push(child);
    if (this.childListFoot) {
      this.childListFoot.sibling = child;
      this.childListFoot = child;
    } else {
      this.child = child;
      this.childListHead = child;
      this.childListFoot = child;
    }
  }

  initialParent() {
    if (this.parent) {
      this.parent.addChild(this);
      const globalDispatch = this.root.dispatch;
      globalDispatch.resolveSuspenseMap(this);
      globalDispatch.resolveContextMap(this);
      globalDispatch.resolveStrictMap(this);
    }
  }

  installParent(parent: MyReactFiberNode) {
    this.parent = parent;
    this.sibling = null;
    this.initialParent();
  }

  addDependence(node: MyReactInternalInstance) {
    if (this.dependence.every((n) => n !== node)) this.dependence.push(node);
  }

  removeDependence(node: MyReactInternalInstance) {
    this.dependence = this.dependence.filter((n) => n !== node);
  }

  addContext(fiber: MyReactFiberNode | null) {
    if (!fiber) return;
    this.context.push(fiber);
  }

  removeContext(fiber: MyReactFiberNode | null) {
    if (!fiber) return;
    const index = this.context.indexOf(fiber);
    if (index !== -1) this.context.splice(index, 1);
  }

  beforeUpdate() {
    this.child = null;
    this.children = [];
    this.childListHead = null;
    this.childListFoot = null;
    this.renderedChildren = [];
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

  // TODO
  checkElement() {
    if (__DEV__) {
      checkFiberElement(this);
    }
  }

  initialType() {
    const element = this.element;
    const type = getTypeFromElement(element);
    this.type = type;
  }

  checkIsSameType(element: MyReactElementNode) {
    // if (this.mode & UPDATE_TYPE.__trigger__) return true;
    const type = getTypeFromElement(element);
    const result = type === this.type;
    const typedIncomingElement = element as MyReactElement;
    const typedExistElement = this.element as MyReactElement;
    if (result) {
      if (this.type & (NODE_TYPE.__isDynamicNode__ | NODE_TYPE.__isPlainNode__)) {
        return Object.is(typedExistElement.type, typedIncomingElement.type);
      }
      if (this.type & NODE_TYPE.__isObjectNode__ && typeof typedIncomingElement.type === "object" && typeof typedExistElement.type === "object") {
        return Object.is(typedExistElement.type["$$typeof"], typedIncomingElement.type["$$typeof"]);
      }
    }
    return result;
  }

  addHook(hookNode: MyReactHookNode) {
    this.hookNodeArray.push(hookNode);
    this.hookTypeArray.push(hookNode.hookType);
    if (!this.hookListFoot) {
      this.hookListFoot = hookNode;
      this.hookListHead = hookNode;
    } else {
      this.hookListFoot.hookNext = hookNode;
      hookNode.hookPrev = this.hookListFoot;
      this.hookListFoot = hookNode;
    }
  }

  // TODO
  checkHook() {
    if (__DEV__) {
      checkFiberHook(this);
    }
  }

  applyElement() {
    this.memoizedProps = Object.assign({}, this.pendingProps);
  }

  installInstance(instance: MyReactInternalInstance) {
    this.instance = instance;
  }

  // TODO
  checkInstance() {
    if (__DEV__) {
      checkFiberInstance(this);
    }
  }

  update() {
    this.root.dispatch.trigger(this);
  }

  unmount() {
    this.hookNodeArray.forEach((hook) => hook.unmount());
    this.instance && this.instance.unmount();
    this.mount = false;
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
  }
}

export class MyReactFiberNodeRoot extends MyReactFiberNode {
  dispatch: FiberDispatch = new EmptyDispatch();

  scope: RenderScope = new EmptyRenderScope();
}

export class MyReactFiberNodeDev extends MyReactFiberNode {
  _debugRenderState = {
    renderCount: 0,
    mountTime: 0,
    prevUpdateTime: 0,
    updateTimeStep: 0,
    currentUpdateTime: 0,
  };

  _debugContextMap: Record<string, MyReactFiberNode> = {};

  _debugDynamicChildren: MaybeArrayMyReactElementNode;

  _debugGlobalDispatch: FiberDispatch | null = null;

  _debugSuspense: MyReactElementNode;

  _debugStrict = false;

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any[] }> = {};
}
