import { MyReactHookNode } from "../hook/index.js";
import { MyReactComponent } from "../component/index.js";
import { safeCallWithFiber, warning } from "../debug.js";
import { pendingUpdate } from "../update/index.js";
import {
  enableEventSystem,
  enableAllCheck,
  enableControlComponent,
} from "../env.js";
import { MyReactVDom, getTypeFromVDom, isValidElement } from "../vdom/index.js";
import { COMPONENT_METHOD, createRef, MyReactInternalType } from "../share.js";

class MyReactFiberInternal extends MyReactInternalType {
  __internal_node_diff__ = {
    __diffMount__: false,

    /**
     * @type MyReactFiberNode
     */
    __diffPrevRender__: null,

    /**
     * @type MyReactFiberNode[]
     */
    __renderedChildren__: [],

    __renderedCount__: 1,

    __renderDynamic__: false,

    __updateRender__: false,

    __updateTimeStep__: Date.now(),

    __lastUpdateTimeStep__: null,

    __newestFiber__: createRef(this),
  };

  get __diffMount__() {
    return this.__internal_node_diff__.__diffMount__;
  }

  set __diffMount__(v) {
    this.__internal_node_diff__.__diffMount__ = v;
  }

  get __diffPrevRender__() {
    return this.__internal_node_diff__.__diffPrevRender__;
  }

  set __diffPrevRender__(v) {
    this.__internal_node_diff__.__diffPrevRender__ = v;
  }

  get __updateRender__() {
    return this.__internal_node_diff__.__updateRender__;
  }

  set __updateRender__(v) {
    this.__internal_node_diff__.__updateRender__ = v;
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

  get __renderDynamic__() {
    return this.__internal_node_diff__.__renderDynamic__;
  }

  set __renderDynamic__(v) {
    this.__internal_node_diff__.__renderDynamic__ = v;
  }

  get __newestFiber__() {
    return this.__internal_node_diff__.__newestFiber__;
  }

  set __newestFiber__(v) {
    this.__internal_node_diff__.__newestFiber__ = v;
  }

  __internal_node_state__ = {
    __pendingMount__: false,
    __pendingUpdate__: false,
    __pendingUnmount__: false,
    __pendingPosition__: false,
  };

  get __pendingMount__() {
    return this.__internal_node_state__.__pendingMount__;
  }

  set __pendingMount__(v) {
    this.__internal_node_state__.__pendingMount__ = v;
  }

  get __pendingUpdate__() {
    return this.__internal_node_state__.__pendingUpdate__;
  }

  set __pendingUpdate__(v) {
    this.__internal_node_state__.__pendingUpdate__ = v;
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

  /**
   * @type string
   */
  nameSpace;

  /**
   * @type HTMLElement
   */
  dom;

  __internal_event_state__ = {};

  addEventListener(event, cb, isCapture) {
    if (enableEventSystem.current) {
      const eventName = `${event}_${isCapture}`;
      if (this.__internal_event_state__[eventName]) {
        this.__internal_event_state__[eventName].cb.push(cb);
      } else {
        const handler = (...args) => {
          const e = args[0];
          e.nativeEvent = e;
          safeCallWithFiber({
            action: () =>
              handler.cb.forEach(
                (cb) => typeof cb === "function" && cb.call(null, ...args)
              ),
            fiber: this,
          });
          if (enableControlComponent.current) {
            // TODO more
            if (this.__vdom__.type === "input" && event === "input") {
              if (this.memoProps?.value !== undefined) {
                this.dom["value"] = this.memoProps.value;
              }
            }
          }
        };
        handler.cb = [cb];
        this.__internal_event_state__[eventName] = handler;
        this.dom.addEventListener(event, handler, isCapture);
      }
    } else {
      this.dom.addEventListener(event, cb, isCapture);
    }
  }

  removeEventListener(event, cb, isCapture) {
    if (enableEventSystem.current) {
      const eventName = `${event}_${isCapture}`;
      if (!this.__internal_event_state__[eventName]) return;
      this.__internal_event_state__[eventName].cb =
        this.__internal_event_state__[eventName].cb.filter(
          (_cb) => _cb !== cb || typeof _cb !== "function"
        );
    } else {
      this.dom.removeEventListener(event, cb, isCapture);
    }
  }

  __internal_context_map__ = {
    /**
     * @type MyReactInstance[]
     */
    __dependence__: [],

    __contextMap__: {},
  };

  get __dependence__() {
    return this.__internal_context_map__.__dependence__;
  }

  set __dependence__(v) {
    this.__internal_context_map__.__dependence__ = v;
  }

  get __contextMap__() {
    return this.__internal_context_map__.__contextMap__;
  }

  set __contextMap__(v) {
    this.__internal_context_map__.__contextMap__ = v;
  }

  /**
   *
   * @param {MyReactInstance} node
   */
  addDependence(node) {
    const dependence = this.__dependence__;
    if (dependence.every((n) => n !== node)) {
      dependence.push(node);
    }
  }

  /**
   *
   * @param {MyReactInstance} node
   */
  removeDependence(node) {
    const dependence = this.__dependence__;
    this.__dependence__ = dependence.filter((n) => n !== node);
  }
}

class MyReactFiberNode extends MyReactFiberInternal {
  key;

  /**
   * @type number
   */
  deepIndex;

  /**
   * @type 'PLACEMENT' | 'UPDATE' | 'POSITION'
   */
  effect;

  mount = true;

  initial = true;

  memoProps = null;

  memoState = null;

  /**
   * @type MyReactFiberNode[]
   */
  children = [];

  /**
   * @type MyReactFiberNode[]
   */
  child = null;

  /**
   * @type MyReactFiberNode
   */
  fiberChildHead = null;

  /**
   * @type MyReactFiberNode
   */
  fiberChildFoot = null;

  /**
   * @type MyReactFiberNode
   */
  fiberParent = null;

  /**
   * @type MyReactFiberNode
   */
  fiberSibling = null;

  /**
   * @type MyReactFiberNode
   */
  fiberAlternate = null;

  /**
   * @type MyReactHookNode
   */
  hookHead;

  /**
   * @type MyReactHookNode
   */
  hookFoot;

  /**
   * @type MyReactHookNode[]
   */
  hookList = [];

  /**
   * @type MyReactInstance & MyReactComponent
   */
  instance = null;

  /**
   * @type MyReactVDom
   */
  __vdom__ = null;

  /**
   * @type MyReactVDom
   */
  __preRenderVdom__ = null; // used for update dom

  __needUpdate__ = false;

  constructor(key, deepIndex, fiberParent, fiberAlternate, effect) {
    super();
    this.key = key;
    this.deepIndex = deepIndex;
    this.fiberParent = fiberParent;
    this.fiberAlternate = fiberAlternate;
    this.effect = effect;
  }

  /**
   *
   * @param {MyReactFiberNode} childFiber
   */
  addChild(childFiber) {
    if (enableAllCheck.current) {
      if (this.children.some((f) => f === childFiber)) {
        throw new Error("already add child");
      }
    }
    this.children.push(childFiber);
    if (!this.child) {
      this.child = childFiber;
      this.fiberChildHead = childFiber;
      this.fiberChildFoot = childFiber;
    } else {
      this.fiberChildFoot.fiberSibling = childFiber;
      this.fiberChildFoot = childFiber;
    }
  }

  initialParent() {
    if (this.fiberParent) {
      this.fiberParent.addChild(this);
      if (this.fiberParent.nameSpace) {
        this.nameSpace = this.fiberParent.nameSpace;
      }
    }
  }

  initialContext() {
    if (this.fiberParent) {
      // get ContextMap from parent fiber
      const contextMap = Object.assign(
        {},
        this.fiberParent.__contextMap__,
        this.__contextMap__
      );
      // after vdom install
      if (this.__isContextProvider__) {
        // get context id;
        const contextObject = this.__vdom__.type.Context;
        const contextId = contextObject.id;
        contextMap[contextId] = this;
        // if (contextMap[contextId]) {
        //   contextMap[contextId].current = this;
        // } else {
        //   contextMap[contextId] = createRef(this);
        // }
      }
      this.__contextMap__ = contextMap;
    }
  }

  /**
   *
   * @param {MyReactFiberNode} parentFiber
   */
  installParent(parentFiber) {
    this.fiberParent = parentFiber;
    this.fiberSibling = null;
    this.initialParent();
  }

  updateFromAlternate() {
    if (this.fiberAlternate) {
      const { fiberAlternate } = this;
      if (fiberAlternate !== this) {
        // inherit
        this.dom = fiberAlternate.dom;

        this.hookHead = fiberAlternate.hookHead;
        this.hookFoot = fiberAlternate.hookFoot;
        this.instance = fiberAlternate.instance;

        this.hookList = fiberAlternate.hookList.slice(0);

        this.__preRenderVdom__ = fiberAlternate.__preRenderVdom__;

        this.__dependence__ = fiberAlternate.__dependence__.slice(0);

        this.__newestFiber__ = fiberAlternate.__newestFiber__;

        this.__renderedChildren__ =
          fiberAlternate.__renderedChildren__.slice(0);

        this.__internal_node_type__ = Object.assign(
          {},
          fiberAlternate.__internal_node_type__
        );

        this.__internal_event_state__ = Object.assign(
          {},
          fiberAlternate.__internal_event_state__
        );

        // update
        // fiberAlternate.dom = null;
        // fiberAlternate.hookList = [];
        // fiberAlternate.hookHead = null;
        // fiberAlternate.hookFoot = null;
        // fiberAlternate.instance = null;
        fiberAlternate.mount = false;
        fiberAlternate.effect = null;
        fiberAlternate.fiberAlternate = null;
        fiberAlternate.__needUpdate__ = false;
        // fiberAlternate.__internal_node_type__ = null;
        // fiberAlternate.__internal_node_diff__ = null;
        // fiberAlternate.__internal_event_state__ = null;
      }
      this.__updateRender__ = true;
      this.__newestFiber__.current = this;
      this.__renderedCount__ = fiberAlternate.__renderedCount__ + 1;
    }
  }

  beforeTransform() {
    this.child = null;
    this.children = [];
    this.fiberChildHead = null;
    this.fiberChildFoot = null;
    this.__renderedChildren__ = [];
  }

  afterTransform() {
    this.initial = false;
    this.fiberAlternate = null;
    this.__needUpdate__ = false;
  }

  /**
   *
   * @param {MyReactHookNode} hookNode
   */
  addHook(hookNode) {
    if (enableAllCheck.current) {
      if (this.hookList.some((h) => h === hookNode)) {
        throw new Error("already add hook");
      }
    }
    this.hookList.push(hookNode);
    if (!this.hookHead) {
      this.hookHead = hookNode;
      this.hookFoot = hookNode;
    } else {
      this.hookFoot.hookNext = hookNode;
      hookNode.hookPrev = this.hookFoot;
      this.hookFoot = hookNode;
    }
  }

  /**
   *
   * @param {MyReactHookNode} hookNode
   */
  checkHook(hookNode) {
    if (enableAllCheck.current) {
      if (
        hookNode.hookType === "useMemo" ||
        hookNode.hookType === "useEffect" ||
        hookNode.hookType === "useCallback" ||
        hookNode.hookType === "useLayoutEffect"
      ) {
        if (typeof hookNode.value !== "function") {
          throw new Error(`${this.hookType} initial error`);
        }
      }

      if (hookNode.hookType === "useContext") {
        if (typeof hookNode.value !== "object" || hookNode.value === null) {
          throw new Error(`${this.hookType} initial error`);
        }
      }
    }
  }

  update() {
    if (this.mount) {
      pendingUpdate(this);
    } else {
      warning({ message: "can not update unmount fiber", fiber: this });
    }
  }

  prepareUpdate() {
    this.__needUpdate__ = true;
    this.__updateRender__ = true;
    this.fiberAlternate = this;
  }

  memoChildren() {
    const { fiberAlternate } = this;
    if (fiberAlternate !== this) {
      this.child = fiberAlternate.child;
      this.children = fiberAlternate.children;
      this.fiberChildHead = fiberAlternate.fiberChildHead;
      this.fiberChildFoot = fiberAlternate.fiberChildFoot;
      this.__renderedChildren__ = fiberAlternate.__renderedChildren__;
      this.children.forEach((child) => (child.fiberParent = this));
    }
  }

  /**
   *
   * @param {MyReactVDom} vdom
   */
  installVDom(vdom) {
    this.__vdom__ = vdom;
    this.key = vdom?.key;
    this.memoProps = vdom?.props;
    // TODO need improve
    if (vdom?.type === "svg") this.nameSpace = "http://www.w3.org/2000/svg";
  }

  /**
   *
   * @param {MyReactVDom} vdom
   */
  checkVDom(vdom) {
    if (enableAllCheck.current) {
      if (isValidElement(vdom)) {
        // TODO
        if (!vdom.__validType__) {
          if (this.__isContextConsumer__) {
            if (typeof vdom.children !== "function") {
              throw new Error(
                `Consumer's children must as a function, got ${vdom.children}`
              );
            }
          }
          if (this.__isPortal__) {
            if (!vdom.props.container) {
              throw new Error("createPortal() need a dom container");
            }
          }
          if (this.__isMemo__ || this.__isForwardRef__) {
            if (typeof vdom.type.render !== "function") {
              if (
                typeof vdom.type.render !== "object" ||
                !vdom.type.render.type
              ) {
                throw new Error(`invalid render type, ${vdom.type}`);
              }
            }
          }
          if (this.__isForwardRef__) {
            if (
              typeof vdom.type.render === "function" &&
              vdom.type.render.prototype?.isMyReactComponent
            ) {
              throw new Error(
                "forwardRef need a function component, but get a class component"
              );
            }
          }
          if (vdom.ref) {
            if (
              typeof vdom.ref !== "object" &&
              typeof vdom.ref !== "function"
            ) {
              throw new Error("unSupport ref usage");
            }
          }
          if (typeof vdom.type === "object") {
            if (!vdom.type?.type) {
              throw new Error("invalid element type");
            }
          }
          if (
            vdom.key &&
            typeof vdom.key !== "string" &&
            typeof vdom.key !== "number"
          ) {
            throw new Error("invalid key props");
          }
          vdom.__validType__ = true;
        }
      }
    }
  }

  initialType() {
    const { __vdom__: vdom } = this;
    if (isValidElement(vdom)) {
      const nodeType = getTypeFromVDom(vdom);
      this.setNodeType(nodeType);
      return;
    }

    if (typeof vdom === "object") {
      this.setNodeType({ __isEmptyNode__: true });
      return;
    }

    this.setNodeType({ __isTextNode__: true });
  }

  resetEffect() {
    if (!this.__isPlainNode__ && !this.__isTextNode__) {
      this.effect = null;
    }
  }

  resetPortal() {
    if (this.__isPortal__) {
      this.dom = this.__vdom__.props.container;
    }
  }

  /**
   *
   * @param {MyReactVDom} vdom
   */
  checkIsSameType(vdom) {
    if (isValidElement(vdom)) {
      const nodeType = getTypeFromVDom(vdom);

      const result = this.isSameType(nodeType);

      if (result) {
        if (this.__isDynamicNode__ || this.__isPlainNode__) {
          return this.__vdom__.type === vdom.type;
        }
        if (this.__isObjectNode__) {
          return this.__vdom__.type.type === vdom.type.type;
        }
        return true;
      } else {
        return false;
      }
    }

    if (typeof vdom === "object") return this.__isEmptyNode__;

    return this.__isTextNode__;
  }

  applyRef() {
    if (this.__isPlainNode__) {
      if (this.dom) {
        const { ref } = this.__vdom__;
        if (typeof ref === "object") {
          ref.current = this.dom;
        } else if (typeof ref === "function") {
          ref.call(null, this.dom);
        }
      } else {
        throw new Error("not have a dom for plainNode");
      }
    }
  }

  // after dom update
  applyVDom() {
    this.__preRenderVdom__ = this.__isTextNode__
      ? this.__vdom__
      : Object.assign({}, this.__vdom__);
  }

  /**
   *
   * @param {MyReactInstance & MyReactComponent} instance
   */
  installInstance(instance) {
    this.instance = instance;
  }

  /**
   *
   * @param {MyReactInstance & MyReactComponent} instance
   */
  checkInstance(instance) {
    if (enableAllCheck.current) {
      // todo
      COMPONENT_METHOD.forEach((key) => {
        if (instance[key] && typeof instance[key] !== "function") {
          throw new Error(`current component method ${key} has wrong type`);
        }
      });
    }
  }
}

export { MyReactFiberNode };
