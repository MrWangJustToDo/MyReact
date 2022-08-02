import { getTypeFromVDom, isValidElement } from '../element';
import { enableAllCheck, globalDispatch, MyReactInternalType } from '../share';

import type { MyReactComponent } from '../component';
import type {
  createContext,
  forwardRef,
  memo,
  Props,
  ChildrenNode,
  Children,
  DynamicChildrenNode,
} from '../element';
import type { Action, MyReactHookNode } from '../hook';
import type { MyReactInternalInstance } from '../share';

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
    __renderedChildHead__: MyReactFiberNode | null;
    __renderedChildFoot__: MyReactFiberNode | null;
    __renderedCount__: number;
    __dynamicChildren__: ChildrenNode | null;
    __isRenderDynamic__: boolean;
    __isUpdateRender__: boolean;
    __updateTimeStep__: number;
    __lastUpdateTimeStep__: number;
    __updateTimeSpace__: number;
    __fallback__: ChildrenNode | null;
    __root__: boolean;
  } = {
    __renderedChildren__: [],

    __renderedChildHead__: null,

    __renderedChildFoot__: null,

    __renderedCount__: 1,

    __isRenderDynamic__: false,

    __dynamicChildren__: null,

    __isUpdateRender__: false,

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

  get __renderedChildHead__() {
    return this.__internal_node_diff__.__renderedChildHead__;
  }

  set __renderedChildHead__(v) {
    this.__internal_node_diff__.__renderedChildHead__ = v;
  }

  get __renderedChildFoot__() {
    return this.__internal_node_diff__.__renderedChildFoot__;
  }

  set __renderedChildFoot__(v) {
    this.__internal_node_diff__.__renderedChildFoot__ = v;
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

  get __pendingContext__() {
    return this.__internal_node_state__.__pendingContext__;
  }

  set __pendingContext__(v) {
    this.__internal_node_state__.__pendingContext__ = v;
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

  // __internal_node_dom__: {
  //   dom: Element | Text | null;
  //   nameSpace: string | null;
  // } = {
  //   dom: null,
  //   nameSpace: null,
  // };

  // get dom() {
  //   return this.__internal_node_dom__.dom;
  // }

  // set dom(v) {
  //   this.__internal_node_dom__.dom = v;
  // }

  // get nameSpace() {
  //   return this.__internal_node_dom__.nameSpace;
  // }

  // set nameSpace(v) {
  //   this.__internal_node_dom__.nameSpace = v;
  // }

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

  __internal_node_update__: {
    __compUpdateQueue__: Array<ComponentUpdateQueue>;
    __hookUpdateQueue__: Array<HookUpdateQueue>;
  } = {
    __compUpdateQueue__: [],
    __hookUpdateQueue__: [],
  };

  __internal_node_effect__: {
    __effectQueue__: Array<() => void>;
    __layoutEffectQueue__: Array<() => void>;
  } = {
    __effectQueue__: [],
    __layoutEffectQueue__: [],
  };

  __internal_node_unmount__: {
    __unmountQueue__: Array<MyReactFiberNode | MyReactFiberNode[]>;
  } = {
    __unmountQueue__: [],
  };

  get __compUpdateQueue__() {
    return this.__internal_node_update__.__compUpdateQueue__;
  }

  set __compUpdateQueue__(v) {
    this.__internal_node_update__.__compUpdateQueue__ = v;
  }

  get __hookUpdateQueue__() {
    return this.__internal_node_update__.__hookUpdateQueue__;
  }

  set __hookUpdateQueue__(v) {
    this.__internal_node_update__.__hookUpdateQueue__ = v;
  }

  get __unmountQueue__() {
    return this.__internal_node_unmount__.__unmountQueue__;
  }

  set __unmountQueue__(v) {
    this.__internal_node_unmount__.__unmountQueue__ = v;
  }

  get __effectQueue__() {
    return this.__internal_node_effect__.__effectQueue__;
  }

  set __effectQueue__(v) {
    this.__internal_node_effect__.__effectQueue__ = v;
  }

  get __layoutEffectQueue__() {
    return this.__internal_node_effect__.__layoutEffectQueue__;
  }

  set __layoutEffectQueue__(v) {
    this.__internal_node_effect__.__layoutEffectQueue__ = v;
  }
}

export class MyReactFiberNode extends MyReactFiberInternal {
  fiberIndex = 0;

  mount = true;

  dom: Element | Text | null = null;

  nameSpace: string | null = null;

  children: MyReactFiberNode[] = [];

  child: MyReactFiberNode | null = null;

  parent: MyReactFiberNode | null = null;

  sibling: MyReactFiberNode | null = null;

  instance: MyReactInternalInstance | null = null;

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
    this.element = element;
    this.__vdom__ = element;
  }

  addChild(child: MyReactFiberNode) {
    this.children.push(child);
    if (this.__renderedChildFoot__) {
      this.__renderedChildFoot__.sibling = child;
      this.__renderedChildFoot__ = child;
    } else {
      this.child = child;
      this.__renderedChildHead__ = child;
      this.__renderedChildFoot__ = child;
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
        const typedElementType = this.element.type as ReturnType<
          typeof createContext
        >['Provider'];
        const contextObj = typedElementType['Context'];
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
    this.__renderedChildHead__ = null;
    this.__renderedChildFoot__ = null;
  }

  triggerUpdate() {
    this.__needUpdate__ = true;
    this.__needTrigger__ = true;
    this.__isUpdateRender__ = true;
  }

  prepareUpdate() {
    this.__needUpdate__ = true;
    this.__isUpdateRender__ = true;
  }

  afterUpdate() {
    this.__needUpdate__ = false;
    this.__needTrigger__ = false;
    this.__isUpdateRender__ = false;
    this.__isRenderDynamic__ = false;
  }

  // when update, install new vdom
  installVDom(vdom: DynamicChildrenNode) {
    this.element = vdom;
    this.__vdom__ = vdom;
  }

  // TODO
  checkVDom() {
    if (enableAllCheck.current) {
      const vdom = this.element;
      if (isValidElement(vdom)) {
        const typedVDom = vdom;
        if (!typedVDom._store['validType']) {
          if (this.__isContextConsumer__) {
            if (typeof typedVDom.props.children !== 'function') {
              throw new Error(`Consumer need a function children`);
            }
          }
          if (this.__isMemo__ || this.__isForwardRef__) {
            const typedType = typedVDom.type as
              | ReturnType<typeof forwardRef>
              | ReturnType<typeof memo>;
            if (
              typeof typedType.render !== 'function' &&
              typeof typedType.render !== 'object'
            ) {
              throw new Error('invalid render type');
            }
            if (
              this.__isForwardRef__ &&
              typeof typedType.render !== 'function'
            ) {
              throw new Error('forwardRef() need a function component');
            }
          }
          if (typedVDom.ref) {
            if (
              typeof typedVDom.ref !== 'object' &&
              typeof typedVDom.ref !== 'function'
            ) {
              throw new Error(
                'unSupport ref usage, should be a function or a object like {current: any}'
              );
            }
          }
          if (typedVDom.key && typeof typedVDom.key !== 'string') {
            throw new Error(`invalid key type, ${typedVDom.key}`);
          }
          if (
            typedVDom.props.children &&
            typedVDom.props['dangerouslySetInnerHTML']
          ) {
            throw new Error(
              'can not render contain `children` and `dangerouslySetInnerHTML`'
            );
          }
          if (typedVDom.props['dangerouslySetInnerHTML']) {
            if (
              typeof typedVDom.props['dangerouslySetInnerHTML'] !== 'object' ||
              !Object.prototype.hasOwnProperty.call(
                typedVDom.props['dangerouslySetInnerHTML'],
                '__html'
              )
            ) {
              throw new Error(
                'invalid dangerouslySetInnerHTML props, should like {__html: string}'
              );
            }
          }
          typedVDom._store['validType'] = true;
        }
      }
    }
  }

  initialType() {
    const vdom = this.element;
    const nodeType = getTypeFromVDom(vdom);
    this.setNodeType(nodeType);
    if (isValidElement(vdom)) {
      if (vdom.type === 'svg') this.nameSpace = 'http://www.w3.org/2000/svg';
    }
  }

  checkIsSameType(vdom: ChildrenNode) {
    const nodeType = getTypeFromVDom(vdom);
    const result = this.isSameType(nodeType);
    const element = vdom as Children;
    const currentElement = this.element as Children;
    if (result) {
      if (this.__isDynamicNode__ || this.__isPlainNode__) {
        return Object.is(currentElement.type, element.type);
      }
      if (
        this.__isObjectNode__ &&
        typeof element.type === 'object' &&
        typeof currentElement.type === 'object'
      ) {
        return Object.is(
          element.type['$$typeof'],
          currentElement.type['$$typeof']
        );
      }
      return true;
    } else {
      return false;
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

  checkHook(hookNode: MyReactHookNode) {
    if (enableAllCheck.current) {
      if (
        hookNode.hookType === 'useMemo' ||
        hookNode.hookType === 'useEffect' ||
        hookNode.hookType === 'useCallback' ||
        hookNode.hookType === 'useLayoutEffect'
      ) {
        if (typeof hookNode.value !== 'function') {
          throw new Error(`${hookNode.hookType} initial error`);
        }
      }
      if (hookNode.hookType === 'useContext') {
        if (typeof hookNode.value !== 'object' || hookNode.value === null) {
          throw new Error(`${hookNode.hookType} initial error`);
        }
      }
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
          ref(this.dom as Element);
        }
      } else {
        throw new Error('do not have a dom for plain node');
      }
    }
    if (this.__isClassComponent__) {
      const typedElement = this.element as Children;
      if (this.instance) {
        const ref = typedElement.ref;
        if (typeof ref === 'object' && ref !== null) {
          ref.current = this.instance;
        } else if (typeof ref === 'function') {
          ref(this.instance);
        }
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
    globalDispatch.current.trigger(this);
  }

  unmount() {
    this.hookList.forEach((hook) => hook.unmount());
    this.instance && this.instance.unmount();
    this.mount = false;
    this.__needUpdate__ = false;
    this.__needTrigger__ = false;
    this.__pendingCreate__ = false;
    this.__pendingUpdate__ = false;
    this.__pendingAppend__ = false;
    this.__pendingPosition__ = false;
  }
}
