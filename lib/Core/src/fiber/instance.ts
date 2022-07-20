import { enableAllCheck, globalDispatch, MyReactInternalType } from '../share';
import { getSafeVDom, getTypeFromVDom, isValidElement } from '../vdom';

import type { MyReactComponent } from '../component';
import type { Action, MyReactHookNode } from '../hook';
import type { MyReactInternalInstance } from '../share';
import type {
  Props,
  ChildrenNode,
  Children,
  DynamicChildrenNode,
} from '../vdom';

export type ComponentUpdateQueue = {
  type: 'state';
  trigger: MyReactComponent;
  isForce?: boolean;
  payLoad?:
    | Record<string, unknown>
    | ((
        state: Record<string, unknown>,
        props: Record<string, unknown>
      ) => Record<string, unknown>);
  callback?: () => void;
};

export type HookUpdateQueue = {
  type: 'hook';
  trigger: MyReactHookNode;
  action: Action;
};

class MyReactFiberInternal extends MyReactInternalType {
  __internal_node_diff__: {
    __renderedChildren__: Array<MyReactFiberNode | MyReactFiberNode[]>;
    __renderedCount__: number;
    __dynamicChildren__: ChildrenNode | null;
    __isRenderDynamic__: boolean;
    __isUpdateRender__: boolean;
    __isIgnoreHook__: boolean;
    __updateTimeStep__: number;
    __lastUpdateTimeStep__: number;
    __updateTimeSpace__: number;
    __fallback__: ChildrenNode | null;
    __root__: boolean;
  } = {
    __renderedChildren__: [],

    __renderedCount__: 1,

    __isRenderDynamic__: false,

    __dynamicChildren__: null,

    __isUpdateRender__: false,

    __isIgnoreHook__: false,

    __updateTimeStep__: Date.now(),

    __lastUpdateTimeStep__: 0,

    __updateTimeSpace__: Infinity,

    __fallback__: null,

    __root__: false,
  };

  get __isUpdateRender__() {
    return this.__internal_node_diff__.__isUpdateRender__;
  }

  set __isUpdateRender__(v) {
    this.__internal_node_diff__.__isUpdateRender__ = v;
  }

  get __isIgnoreHook__() {
    return this.__internal_node_diff__.__isIgnoreHook__;
  }

  set __isIgnoreHook__(v) {
    this.__internal_node_diff__.__isIgnoreHook__ = v;
  }

  get __isRenderDynamic__() {
    return this.__internal_node_diff__.__isRenderDynamic__;
  }

  set __isRenderDynamic__(v) {
    this.__internal_node_diff__.__isRenderDynamic__ = v;
  }

  get __renderedCount__() {
    return this.__internal_node_diff__.__renderedCount__;
  }

  set __renderedCount__(v) {
    this.__internal_node_diff__.__renderedCount__ = v;
  }

  get __renderedChildren__() {
    return this.__internal_node_diff__.__renderedChildren__;
  }

  set __renderedChildren__(v) {
    this.__internal_node_diff__.__renderedChildren__ = v;
  }

  get __dynamicChildren__() {
    return this.__internal_node_diff__.__dynamicChildren__;
  }

  set __dynamicChildren__(v) {
    this.__internal_node_diff__.__dynamicChildren__ = v;
    this.__internal_node_diff__.__isRenderDynamic__ = true;
  }

  get __updateTimeStep__() {
    return this.__internal_node_diff__.__updateTimeStep__;
  }

  set __updateTimeStep__(v) {
    const diff = this.__internal_node_diff__;
    const lastTimeStep = diff.__updateTimeStep__;
    const nowTimeStep = v;
    diff.__lastUpdateTimeStep__ = lastTimeStep;
    diff.__updateTimeStep__ = nowTimeStep;
    diff.__updateTimeSpace__ = nowTimeStep - lastTimeStep;
  }

  get __fallback__() {
    return this.__internal_node_diff__.__fallback__;
  }

  set __fallback__(v) {
    this.__internal_node_diff__.__fallback__ = v;
  }

  get __root__() {
    return this.__internal_node_diff__.__root__;
  }

  set __root__(v) {
    this.__internal_node_diff__.__root__ = v;
  }

  __internal_node_state__ = {
    __pendingCreate__: false,
    __pendingUpdate__: false,
    __pendingAppend__: false,
    __pendingPosition__: false,
    __pendingUnmount__: false,
    __pendingContext__: false,
  };

  get __pendingCreate__() {
    return this.__internal_node_state__.__pendingCreate__;
  }

  set __pendingCreate__(v) {
    this.__internal_node_state__.__pendingCreate__ = v;
  }

  get __pendingUpdate__() {
    return this.__internal_node_state__.__pendingUpdate__;
  }

  set __pendingUpdate__(v) {
    this.__internal_node_state__.__pendingUpdate__ = v;
  }

  get __pendingAppend__() {
    return this.__internal_node_state__.__pendingAppend__;
  }

  set __pendingAppend__(v) {
    this.__internal_node_state__.__pendingAppend__ = v;
  }

  get __pendingPosition__() {
    return this.__internal_node_state__.__pendingPosition__;
  }

  set __pendingPosition__(v) {
    this.__internal_node_state__.__pendingPosition__ = v;
  }

  get __pendingUnmount__() {
    return this.__internal_node_state__.__pendingUnmount__;
  }

  set __pendingUnmount__(v) {
    this.__internal_node_state__.__pendingUnmount__ = v;
  }

  get __pendingContext__() {
    return this.__internal_node_state__.__pendingContext__;
  }

  set __pendingContext__(v) {
    this.__internal_node_state__.__pendingContext__ = v;
  }

  __internal_node_dom__: {
    dom: HTMLElement | Text | null;
    nameSpace: string | null;
  } = {
    dom: null,
    nameSpace: null,
  };

  get dom() {
    return this.__internal_node_dom__.dom;
  }

  set dom(v) {
    this.__internal_node_dom__.dom = v;
  }

  get nameSpace() {
    return this.__internal_node_dom__.nameSpace;
  }

  set nameSpace(v) {
    this.__internal_node_dom__.nameSpace = v;
  }

  __internal_node_event__: Record<
    string,
    ((...args: any[]) => void) & { cb?: any[] }
  > = {};

  __internal_node_context__: {
    __dependence__: MyReactInternalInstance[];
    __contextMap__: Record<string, MyReactFiberNode>;
  } = {
    __dependence__: [],
    __contextMap__: {},
  };

  get __dependence__() {
    return this.__internal_node_context__.__dependence__;
  }

  set __dependence__(v) {
    this.__internal_node_context__.__dependence__ = v;
  }

  get __contextMap__() {
    return this.__internal_node_context__.__contextMap__;
  }

  set __contextMap__(v) {
    this.__internal_node_context__.__contextMap__ = v;
  }

  addDependence(node: MyReactInternalInstance) {
    const dependence = this.__dependence__;
    if (dependence.every((n) => n !== node)) {
      dependence.push(node);
    }
  }

  removeDependence(node: MyReactInternalInstance) {
    const dependence = this.__dependence__;
    this.__dependence__ = dependence.filter((n) => n !== node);
  }

  __internal_node_props__: {
    __vdom__: null | DynamicChildrenNode;
    __prevVdom__: null | DynamicChildrenNode;
    __props__: Props;
    __prevProps__: Props;
    __children__: Props['children'] | null;
  } = {
    __vdom__: null,
    __prevVdom__: null,
    __props__: {},
    __prevProps__: {},
    __children__: null,
  };

  get __vdom__() {
    return this.__internal_node_props__.__vdom__;
  }

  set __vdom__(v) {
    const props = this.__internal_node_props__;
    props.__vdom__ = v;
    props.__props__ = typeof v === 'object' ? v?.props || {} : {};
    props.__children__ = typeof v === 'object' ? v?.props.children : [];
  }

  get __props__() {
    return this.__internal_node_props__.__props__;
  }

  get __children__() {
    return this.__internal_node_props__.__children__;
  }

  get __prevVdom__() {
    return this.__internal_node_props__.__prevVdom__;
  }

  set __prevVdom__(v) {
    const props = this.__internal_node_props__;
    props.__prevVdom__ = v;
    props.__prevProps__ = typeof v === 'object' ? v?.props || {} : {};
  }

  get __prevProps__() {
    return this.__internal_node_props__.__prevProps__;
  }

  __internal_node_update__: {
    updateQueue: Array<ComponentUpdateQueue | HookUpdateQueue>;
  } = {
    updateQueue: [],
  };

  get updateQueue() {
    return this.__internal_node_update__.updateQueue;
  }

  set updateQueue(v) {
    this.__internal_node_update__.updateQueue = v;
  }

  __internal_node_hook__: {
    hookHead: null | MyReactHookNode;
    hookFoot: null | MyReactHookNode;
    hookList: MyReactHookNode[];
    hookType: MyReactHookNode['hookType'][];
  } = {
    hookHead: null,
    hookFoot: null,
    hookList: [],
    hookType: [],
  };

  get hookHead() {
    return this.__internal_node_hook__.hookHead;
  }
  set hookHead(v) {
    this.__internal_node_hook__.hookHead = v;
  }
  get hookFoot() {
    return this.__internal_node_hook__.hookFoot;
  }
  set hookFoot(v) {
    this.__internal_node_hook__.hookFoot = v;
  }
  get hookList() {
    return this.__internal_node_hook__.hookList;
  }
  set hookList(v) {
    this.__internal_node_hook__.hookList = v;
  }
  get hookType() {
    return this.__internal_node_hook__.hookType;
  }
  set hookType(v) {
    this.__internal_node_hook__.hookType = v;
  }
}

export class MyReactFiberNode extends MyReactFiberInternal {
  fiberIndex = 0;

  mount = true;

  children: MyReactFiberNode[] = [];

  child: MyReactFiberNode | null = null;

  fiberHead: MyReactFiberNode | null = null;

  fiberFoot: MyReactFiberNode | null = null;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  instance: MyReactInternalInstance | null = null;

  // hookHead: null | MyReactHookNode = null;

  // hookFoot: null | MyReactHookNode = null;

  // hookList: MyReactHookNode[] = [];

  // hookType: MyReactHookNode['hookType'][] = [];

  element: DynamicChildrenNode;

  __needUpdate__ = true;

  __needTrigger__ = false;

  constructor(
    index: number,
    parent: MyReactFiberNode | null,
    element: DynamicChildrenNode
  ) {
    super();
    this.parent = parent;
    this.fiberIndex = index;
    this.element = getSafeVDom(element);
    this.__vdom__ = getSafeVDom(element);
  }

  addChild(child: MyReactFiberNode) {
    this.children.push(child);
    if (this.fiberFoot) {
      this.fiberFoot.sibling = child;
      this.fiberFoot = child;
    } else {
      this.child = child;
      this.fiberHead = child;
      this.fiberFoot = child;
    }
  }

  initialParent() {
    if (this.parent) {
      this.parent.addChild(this);
      if (this.parent.nameSpace) {
        this.nameSpace = this.parent.nameSpace;
      }
      if (this.parent.__isSuspense__) {
        this.__fallback__ = this.parent.__props__.fallback as ChildrenNode;
      } else {
        this.__fallback__ = this.parent.__fallback__;
      }
      const contextMap = Object.assign(
        {},
        this.parent.__contextMap__,
        this.__contextMap__
      );
      if (
        typeof this.element === 'object' &&
        typeof this.element?.type === 'object' &&
        this.__isContextProvider__
      ) {
        const contextObj = (this.element?.type as any)['Context'] as {
          id: string;
        };
        const contextId = contextObj['id'];
        contextMap[contextId] = this;
      }
      this.__contextMap__ = contextMap;
    }
  }

  installParent(newParent: MyReactFiberNode) {
    this.parent = newParent;
    this.sibling = null;
    this.initialParent();
  }

  updateRenderState() {
    if (enableAllCheck.current) {
      this.__renderedCount__ += 1;
      this.__updateTimeStep__ = Date.now();
    }
  }

  beforeUpdate() {
    this.child = null;
    this.children = [];
    this.fiberHead = null;
    this.fiberFoot = null;
  }

  prepareUpdate() {
    this.__needUpdate__ = true;
    this.__isUpdateRender__ = true;
  }

  afterUpdate() {
    this.__needUpdate__ = false;
    this.__needTrigger__ = false;
    this.__isIgnoreHook__ = false;
    this.__isUpdateRender__ = false;
    this.__isRenderDynamic__ = false;
  }

  // when update, install new vdom
  installVDom(vdom: DynamicChildrenNode) {
    const safeVDom = getSafeVDom(vdom);
    this.element = safeVDom;
    this.__vdom__ = safeVDom;
  }

  initialType() {
    const vdom = this.element;
    if (isValidElement(vdom)) {
      if ((vdom as Children).type === 'svg') {
        this.nameSpace = 'http://www.w3.org/2000/svg';
      }
      const nodeType = getTypeFromVDom(vdom as Children);
      this.setNodeType(nodeType);
      return;
    }

    if (typeof vdom === 'object') {
      this.setNodeType({ __isEmptyNode__: true });
    } else {
      this.setNodeType({ __isTextNode__: true });
    }
  }

  checkIsSameType(vdom: ChildrenNode) {
    const safeVDom = getSafeVDom(vdom);
    if (isValidElement(safeVDom)) {
      const typedElement = safeVDom as Children;
      const currentElement = this.element as Children;
      const nodeType = getTypeFromVDom(typedElement);
      const result = this.isSameType(nodeType);

      if (result) {
        if (this.__isDynamicNode__ || this.__isPlainNode__) {
          return Object.is(currentElement.type, typedElement.type);
        }
        if (
          this.__isObjectNode__ &&
          typeof typedElement.type === 'object' &&
          typeof currentElement.type === 'object'
        ) {
          return Object.is(
            typedElement.type['$$typeof'],
            currentElement.type['$$typeof']
          );
        }
        return true;
      } else {
        return false;
      }
    }
    if (typeof safeVDom === 'object') {
      return this.__isEmptyNode__;
    } else {
      return this.__isTextNode__;
    }
  }

  addHook(hookNode: MyReactHookNode) {
    this.hookList.push(hookNode);
    this.hookType.push(hookNode.hookType);
    if (!this.hookHead) {
      this.hookHead = hookNode;
      this.hookFoot = hookNode;
    } else if (this.hookFoot) {
      this.hookFoot.hookNext = hookNode;
      hookNode.hookPrev = this.hookFoot;
      this.hookFoot = hookNode;
    }
  }

  applyRef() {
    if (this.__isPlainNode__) {
      const typedElement = this.element as Children;
      if (this.dom) {
        const ref = typedElement.ref;
        if (typeof ref === 'object' && ref !== null) {
          ref.current = this.dom;
        } else if (typeof ref === 'function') {
          ref(this.dom as HTMLElement);
        }
      } else {
        throw new Error('do not have a dom for plain node');
      }
    }
  }

  applyVDom() {
    this.__prevVdom__ = this.__isTextNode__
      ? this.__vdom__
      : Object.assign({}, this.__vdom__);
  }

  installInstance(instance: MyReactInternalInstance) {
    this.instance = instance;
  }

  update() {
    globalDispatch.current.pendingUpdate(this);
  }
}
