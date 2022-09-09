import { getTypeFromElement, isValidElement } from "../element";
import { HOOK_TYPE } from "../hook";
import { globalDispatch } from "../share";

import { NODE_TYPE, PATCH_TYPE, UPDATE_TYPE } from "./symbol";

import type { MyReactComponent } from "../component";
import type { FiberDispatch } from "../dispatch";
import type { memo, forwardRef, MyReactElement, MyReactElementNode, MaybeArrayMyReactElementNode } from "../element";
import type { Action, MyReactHookNode } from "../hook";
import type { MyReactInternalInstance } from "../internal";

type RenderNode = { [p: string]: any };

export type ComponentUpdateQueue = {
  type: "component";
  trigger: MyReactComponent;
  isForce?: boolean;
  payLoad?:
    | Record<string, unknown>
    | ((state: Record<string, unknown>, props: Record<string, unknown>) => Record<string, unknown>);
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

  node: RenderNode | null = null;

  children: MyReactFiberNode[] = [];

  renderedChildren: Array<MyReactFiberNode[] | MyReactFiberNode> = [];

  childListHead: MyReactFiberNode | null = null;

  childListFoot: MyReactFiberNode | null = null;

  child: MyReactFiberNode | null = null;

  root: MyReactFiberNode;

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

  mode: UPDATE_TYPE = UPDATE_TYPE.__run__;

  updateQueue: UpdateQueue[] = [];

  pendingProps: MyReactElement["props"] = {};

  memoizedProps: MyReactElement["props"] | null = null;

  constructor(fiberIndex: number, parent: MyReactFiberNode | null, element: MyReactElementNode) {
    this.uid = "my_react_" + fiberId++;
    this.fiberIndex = fiberIndex;
    this.parent = parent;
    this.element = element;
    this.root = this.parent?.root || this;
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
      globalDispatch.current.resolveSuspenseMap(this);
      globalDispatch.current.resolveContextMap(this);
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
    if (this.context.every((f) => f !== fiber)) this.context.push(fiber);
  }

  removeContext(fiber: MyReactFiberNode | null) {
    if (!fiber) return;
    this.context = this.context.filter((f) => f !== fiber);
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
    updateSymbol |= UPDATE_TYPE.__run__;
    updateSymbol |= UPDATE_TYPE.__update__;
    updateSymbol |= UPDATE_TYPE.__trigger__;
    this.mode = updateSymbol;
  }

  prepareUpdate() {
    let updateSymbol = UPDATE_TYPE.__initial__;
    updateSymbol |= UPDATE_TYPE.__run__;
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
      const element = this.element;
      if (isValidElement(element)) {
        const typedElement = element;
        if (!typedElement._store["validType"]) {
          if (this.type & NODE_TYPE.__isContextConsumer__) {
            if (typeof typedElement.props.children !== "function") {
              throw new Error(`Consumer need a function children`);
            }
          }
          if (this.type & (NODE_TYPE.__isMemo__ | NODE_TYPE.__isForwardRef__)) {
            const typedType = typedElement.type as ReturnType<typeof forwardRef> | ReturnType<typeof memo>;
            if (typeof typedType.render !== "function" && typeof typedType.render !== "object") {
              throw new Error("invalid render type");
            }
            if (this.type & NODE_TYPE.__isForwardRef__ && typeof typedType.render !== "function") {
              throw new Error("forwardRef() need a function component");
            }
          }
          if (typedElement.ref) {
            if (typeof typedElement.ref !== "object" && typeof typedElement.ref !== "function") {
              throw new Error("unSupport ref usage, should be a function or a object like `{current: any}`");
            }
          }
          if (typedElement.key && typeof typedElement.key !== "string") {
            throw new Error(`invalid key type, ${typedElement.key}`);
          }
          if (typedElement.props.children && typedElement.props["dangerouslySetInnerHTML"]) {
            throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current element");
          }
          if (typedElement.props["dangerouslySetInnerHTML"]) {
            if (
              typeof typedElement.props["dangerouslySetInnerHTML"] !== "object" ||
              !Object.prototype.hasOwnProperty.call(typedElement.props["dangerouslySetInnerHTML"], "__html")
            ) {
              throw new Error("invalid dangerouslySetInnerHTML props, should like {__html: string}");
            }
          }
          typedElement._store["validType"] = true;
        }
      }
    }
  }

  initialType() {
    const element = this.element;
    const type = getTypeFromElement(element);
    this.type = type;
  }

  checkIsSameType(element: MyReactElementNode) {
    if (this.mode & UPDATE_TYPE.__trigger__) return true;
    const type = getTypeFromElement(element);
    const result = type === this.type;
    const typedIncomingElement = element as MyReactElement;
    const typedExistElement = this.element as MyReactElement;
    if (result) {
      if (this.type & (NODE_TYPE.__isDynamicNode__ | NODE_TYPE.__isPlainNode__)) {
        return Object.is(typedExistElement.type, typedIncomingElement.type);
      }
      if (
        this.type & NODE_TYPE.__isObjectNode__ &&
        typeof typedIncomingElement.type === "object" &&
        typeof typedExistElement.type === "object"
      ) {
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
      const hookNode = this.hookListFoot as MyReactHookNode;
      if (
        hookNode.hookType === HOOK_TYPE.useMemo ||
        hookNode.hookType === HOOK_TYPE.useEffect ||
        hookNode.hookType === HOOK_TYPE.useCallback ||
        hookNode.hookType === HOOK_TYPE.useLayoutEffect
      ) {
        if (typeof hookNode.value !== "function") {
          throw new Error(`${hookNode.hookType} initial error`);
        }
      }
      if (hookNode.hookType === HOOK_TYPE.useContext) {
        if (typeof hookNode.value !== "object" || hookNode.value === null) {
          throw new Error(`${hookNode.hookType} initial error`);
        }
      }
    }
  }

  applyRef() {
    if (this.type & NODE_TYPE.__isPlainNode__) {
      const typedElement = this.element as MyReactElement;
      if (this.node) {
        const ref = typedElement.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = this.node;
        } else if (typeof ref === "function") {
          ref(this.node);
        }
      } else {
        throw new Error("plain element do not have a native node");
      }
    }
    if (this.type & NODE_TYPE.__isClassComponent__) {
      const typedElement = this.element as MyReactElement;
      if (this.instance) {
        const ref = typedElement.ref;
        if (typeof ref === "object" && ref !== null) {
          ref.current = this.instance;
        } else if (typeof ref === "function") {
          ref(this.instance);
        }
      } else {
        throw new Error("class component do not have a instance");
      }
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
    void 0;
  }

  update() {
    globalDispatch.current.trigger(this);
  }

  unmount() {
    this.hookNodeArray.forEach((hook) => hook.unmount());
    this.instance && this.instance.unmount();
    this.mount = false;
    this.mode = UPDATE_TYPE.__initial__;
    this.patch = PATCH_TYPE.__initial__;
  }
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

  _debugEventMap: Record<string, ((...args: any[]) => void) & { cb?: any[] }> = {};
}
