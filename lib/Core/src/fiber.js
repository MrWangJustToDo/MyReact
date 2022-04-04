import { MyReactComponent } from "./component.js";
import { createDom } from "./dom.js";
import { MyReactHookNode } from "./hook.js";
import { MyReactInstance } from "./share.js";
import { pushFiber } from "./update.js";
import { isValidElement, MyReactVDom } from "./vdom.js";

class MyReactFiberNode {
  mount = true;

  initial = true;

  memoProps = null;

  memoState = null;

  /**
   * @type MyReactFiberNode
   */
  fiberFirstChild = null;

  /**
   * @type MyReactFiberNode
   */
  fiberLastChild = null;

  /**
   * @type MyReactFiberNode
   */
  fiberPrevRender = null;

  diffMount = false;

  /**
   * @type MyReactFiberNode[]
   */
  children = [];

  /**
   * @type MyReactFiberNode[]
   */
  renderedChildren = [];

  /**
   * @type MyReactFiberNode
   */
  fiberNext = null;

  /**
   * @type MyReactVDom
   */
  __vdom__ = null;

  __needUpdate__ = false;

  __pendingPosition__ = false;

  __pendingUpdate__ = false;

  __pendingUnmount__ = false;

  __renderCount__ = 1;

  __highLightCover__ = null;

  __updateTimeStep__ = Date.now();

  __lastUpdateTimeStep__ = null;

  constructor(
    key,
    deepIndex,
    /**
     * @type MyReactFiberNode
     */
    fiberParent,
    /**
     * @type MyReactFiberNode
     */
    fiberAlternate,
    effect,
    dom,
    /**
     * @type MyReactHookNode
     */
    hookHead,
    /**
     * @type MyReactHookNode
     */
    hookFoot,
    /**
     * @type MyReactHookNode[]
     */
    hookList,
    listeners,
    /**
     * @type MyReactInstance & MyReactComponent
     */
    instance
  ) {
    this.key = key;
    this.deepIndex = deepIndex;
    this.fiberParent = fiberParent;
    this.fiberAlternate = fiberAlternate;
    this.effect = effect;
    this.dom = dom;
    this.hookHead = hookHead;
    this.hookFoot = hookFoot;
    this.hookList = hookList;
    this.listeners = listeners;
    this.instance = instance;
    this._initialState();
    this._initialUpdate();
    this._initialType();
    this._initialParent();
  }

  _initialState() {
    this.hookList = this.hookList || [];
    this.listeners = this.listeners || [];
  }

  _initialUpdate() {
    if (this.fiberAlternate) {
      this.fiberAlternate.mount = false;
      this.fiberAlternate.fiberAlternate = null;
      // no need
      // this.__needUpdate__ = this.fiberAlternate.__needUpdate__;
      this.fiberAlternate.__needUpdate__ = false;
      this.__renderCount__ = this.fiberAlternate.__renderCount__ + 1;
      this.__lastUpdateTimeStep__ = this.fiberAlternate.__updateTimeStep__;
    }
  }

  _initialType() {
    this.__isEmptyNode__ = false;
    this.__isTextNode__ = false;
    this.__isPlainNode__ = false;
    this.__isClonedNode__ = false;
    this.__isFragmentNode__ = false;
    // 对象转换为节点   //
    this.__isObjectNode__ = false;
    this.__isForwardRef__ = false;
    this.__isPortal__ = false;
    this.__isMemo__ = false;
    this.__isContextProvider__ = false;
    this.__isContextConsumer__ = false;
    // 动态节点 //
    this.__isDynamicNode__ = false;
    this.__isClassComponent__ = false;
    this.__isFunctionComponent__ = false;
  }

  _initialParent() {
    if (this.fiberParent) {
      this.fiberParent.addChild(this);
    }
  }

  _processType() {
    const VDom = this.__vdom__;
    if (isValidElement(VDom)) {
      this.__isEmptyNode__ = VDom.__isEmptyNode__;

      this.__isPlainNode__ = VDom.__isPlainNode__;

      this.__isFragmentNode__ = VDom.__isFragmentNode__;

      this.__isDynamicNode__ = VDom.__isDynamicNode__;

      this.__isObjectNode__ = VDom.__isObjectNode__;

      this.__isPortal__ = VDom.__isPortal__;

      this.__isMemo__ = VDom.__isMemo__;

      this.__isForwardRef__ = VDom.__isForwardRef__;

      this.__isClassComponent__ = VDom.__isClassComponent__;

      this.__isFunctionComponent__ = VDom.__isFunctionComponent__;

      this.__isContextProvider__ = VDom.__isContextProvider__;

      this.__isContextConsumer__ = VDom.__isContextConsumer__;
    } else {
      if (typeof VDom === "object") {
        this.__isEmptyNode__ = true;
      } else {
        this.__isTextNode__ = true;
      }
    }
  }

  _processDom() {
    if (this.__isTextNode__ || this.__isPlainNode__) {
      this.dom = this.dom || createDom(this);
    }
    if (this.__isPortal__) {
      if (!this.__vdom__.props.container) {
        throw new Error("createPortal() need a dom container");
      }
      this.dom = this.__vdom__.props.container;
    }
  }

  _processRef() {
    if (this.__isPlainNode__) {
      const { ref } = this.__vdom__;
      if (typeof ref === "object") {
        ref.current = this.dom;
      } else if (typeof ref === "function") {
        ref.call(null, this.dom);
      } else if (ref) {
        throw new Error("unSupport ref usage");
      }
    }
  }

  _processMemoProps() {
    this.memoProps = this.__isTextNode__ ? null : this.__vdom__.props;
  }

  reset() {
    this.fiberFirstChild = null;
    this.fiberLastChild = null;
    this.renderedChildren = [];
    this.children = [];
  }

  stopUpdate() {
    const alternate = this.fiberAlternate;
    if (alternate !== this) {
      this.children = alternate.children;
      this.children.forEach((child) => (child.fiberParent = this));
    } else {
      throw new Error("预料之外的错误");
    }
  }

  installVDom(newVDom) {
    this.__vdom__ = newVDom;
    this._processType();
    this._processDom();
    this._processRef();
    this._processMemoProps();
  }

  /**
   *
   * @param {MyReactFiberNode} parentFiber
   */
  installParent(parentFiber) {
    this.fiberParent = parentFiber;
    this._initialParent();
  }

  /**
   *
   * @param {MyReactComponent & MyReactInstance} instance
   */
  installInstance(instance) {
    this.instance = instance;
  }

  /**
   *
   * @param {MyReactHookNode} hookNode
   */
  installHook(hookNode) {
    this.addHook(hookNode);
  }

  addListener(node) {
    if (this.listeners.every((_node) => _node !== node)) {
      this.listeners.push(node);
    }
  }

  removeListener(node) {
    this.listeners = this.listeners.filter((_node) => _node !== node);
  }

  /**
   *
   * @param {MyReactFiberNode} childFiber
   */
  addChild(childFiber) {
    this.children.push(childFiber);
    if (!this.fiberFirstChild) {
      this.fiberFirstChild = childFiber;
      this.fiberLastChild = childFiber;
    } else {
      this.fiberLastChild.fiberNext = childFiber;
      this.fiberLastChild = childFiber;
    }
  }

  /**
   *
   * @param {MyReactHookNode} hookNode
   */
  addHook(hookNode) {
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

  update() {
    if (this.mount) {
      pushFiber(this);
    } else {
      console.error("update a unmount fiber");
    }
  }
}

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {MyReactVDom} newVDom
 * @returns
 */
function createFiberNode(
  {
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance,
  },
  newVDom
) {
  const newFiberNode = new MyReactFiberNode(
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList,
    listeners,
    instance
  );

  newFiberNode.installVDom(newVDom);

  !newFiberNode.__isTextNode__ && (newVDom.__fiber__ = newFiberNode);

  return newFiberNode;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom} vdom
 */
function updateFiberNode(fiber, parentFiber, vdom) {
  fiber.fiberAlternate = fiber;

  fiber.installVDom(vdom);

  fiber.installParent(parentFiber);

  return fiber;
}

export { createFiberNode, updateFiberNode, MyReactFiberNode };
