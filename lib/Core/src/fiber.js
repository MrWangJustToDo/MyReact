import { MyReactComponent } from "./component.js";
import { createDom } from "./dom.js";
import {
  enableEventSystem,
  isMounted,
  pendingModifyFiberArray,
} from "./env.js";
import { MyReactHookNode } from "./hook.js";
import { processUpdatePosition } from "./position.js";
import { MyReactInstance, MyReactTypeInternalInstance } from "./share.js";
import { asyncUpdate, pushUpdate } from "./update.js";
import { isValidElement, MyReactVDom } from "./vdom.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushFiber(fiber) {
  if (!fiber.__needUpdate__) {
    fiber.__needUpdate__ = true;

    fiber.fiberAlternate = fiber;

    pendingModifyFiberArray.current.push(fiber);
  }

  asyncUpdate();
}

class MyReactFiberInternalInstance extends MyReactTypeInternalInstance {
  __INTERNAL_DIFF__ = {
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

    __updateTimeStep__: Date.now(),

    __lastUpdateTimeStep__: null,
  };

  __INTERNAL_STATE__ = {
    __pendingUpdate__: false,
    __pendingUnmount__: false,
    __pendingPosition__: false,
  };

  get __diffMount__() {
    return this.__INTERNAL_DIFF__.__diffMount__;
  }

  set __diffMount__(v) {
    this.__INTERNAL_DIFF__.__diffMount__ = v;
  }

  get __diffPrevRender__() {
    return this.__INTERNAL_DIFF__.__diffPrevRender__;
  }

  set __diffPrevRender__(v) {
    this.__INTERNAL_DIFF__.__diffPrevRender__ = v;
  }

  get __renderedChildren__() {
    return this.__INTERNAL_DIFF__.__renderedChildren__;
  }

  set __renderedChildren__(v) {
    this.__INTERNAL_DIFF__.__renderedChildren__ = v;
  }

  get __pendingUpdate__() {
    return this.__INTERNAL_STATE__.__pendingUpdate__;
  }

  get __pendingPosition__() {
    return this.__INTERNAL_STATE__.__pendingPosition__;
  }

  get __pendingUnmount__() {
    return this.__INTERNAL_STATE__.__pendingUnmount__;
  }

  set __pendingUpdate__(v) {
    this.__INTERNAL_STATE__.__pendingUpdate__ = v;
  }

  set __pendingPosition__(v) {
    this.__INTERNAL_STATE__.__pendingPosition__ = v;
  }

  set __pendingUnmount__(v) {
    this.__INTERNAL_STATE__.__pendingUnmount__ = v;
  }

  get __renderedCount__() {
    return this.__INTERNAL_DIFF__.__renderedCount__;
  }

  set __renderedCount__(v) {
    this.__INTERNAL_DIFF__.__renderedCount__ = v;
  }
}

class MyReactFiberEventHandlerInstance extends MyReactFiberInternalInstance {
  __INTERNAL_EVENT_STATE__ = {};

  __INTERNAL_EVENT_SYSTEM__ = {
    addEventListener: (event, cb, isCapture) => {
      if (enableEventSystem.current) {
        if (typeof isCapture === "object" && isCapture !== null) {
          throw new Error(
            "event system not support object options, pls use dom.addEventListener(), will improve this later"
          );
        }
        const cacheEventName = `${event}_${isCapture ? "true" : "false"}`;
        if (this.__INTERNAL_EVENT_STATE__[cacheEventName]) {
          this.__INTERNAL_EVENT_STATE__[cacheEventName].cb = cb;
        } else {
          const handler = (...args) => {
            if (handler.cb) {
              handler.cb.call(null, ...args);
            }
          };
          handler.cb = cb;
          this.__INTERNAL_EVENT_STATE__[cacheEventName] = handler;
          this.dom.addEventListener(event, handler, isCapture);
        }
      } else {
        this.dom.addEventListener(event, cb, isCapture);
      }
    },
    removeEventListener: (event, cb, isCapture) => {
      if (enableEventSystem.current) {
        const cacheEventName = `${event}_${isCapture ? "true" : "false"}`;
        if (!this.__INTERNAL_EVENT_STATE__[cacheEventName]) {
          console.log(cacheEventName);
          throw new Error("can not remove event listener");
        }
        this.__INTERNAL_EVENT_STATE__[cacheEventName].cb = null;
      } else {
        this.dom.removeEventListener(event, cb, isCapture);
      }
    },
  };
}

class MyReactFiberNode extends MyReactFiberEventHandlerInstance {
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
   * @type MyReactVDom
   */
  __vdom__ = null;

  __needUpdate__ = false;

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
    super();
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
    this._initialUpdate();
    this._initialParent();
  }

  _initialUpdate() {
    if (this.fiberAlternate) {
      const { fiberAlternate } = this;

      fiberAlternate.mount = false;

      fiberAlternate.fiberAlternate = null;

      fiberAlternate.__needUpdate__ = false;

      this.__renderedCount__ = fiberAlternate.__renderedCount__ + 1;

      this.__INTERNAL_EVENT_STATE__ = fiberAlternate.__INTERNAL_EVENT_STATE__;
    }
  }

  _initialParent() {
    if (this.fiberParent) {
      this.fiberParent.addChild(this);
    }
  }

  /**
   *
   * @param {MyReactVDom} newVDom
   */
  installVDom(newVDom) {
    this.__vdom__ = newVDom;
    this.key = newVDom.key;
    this._processType();
    this._processDom();
    this._processRef();
    this._processMemoProps();
  }

  _processType() {
    const VDom = this.__vdom__;
    if (isValidElement(VDom)) {
      this._processSucceedType(VDom);
      return;
    }

    if (typeof VDom === "object") {
      this.__INTERNAL_NODE_TYPE__.__isEmptyNode__ = true;
      return;
    }

    this.__INTERNAL_NODE_TYPE__.__isTextNode__ = true;
  }

  _processDom() {
    if (this.__isTextNode__ || this.__isPlainNode__) {
      this.dom = this.dom || createDom(this);
    }
    if (this.__isPortal__) {
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
      }
    }
  }

  _processMemoProps() {
    this.memoProps = this.__isTextNode__ ? null : this.__vdom__.props;
  }

  reset() {
    this.fiberChildHead = null;
    this.fiberChildFoot = null;
    this.child = null;
    this.children = [];
    this.__renderedChildren__ = [];
  }

  updated() {
    this.initial = false;
    this.__needUpdate__ = false;
    if (!this.effect) this.fiberAlternate = null;
  }

  updateDiffState() {
    if (this.fiberAlternate) {
      this.__renderedCount__ = this.fiberAlternate.__renderedCount__ + 1;
    } else {
      this.__renderedCount__ = this.__renderedCount__ + 1;
    }
  }

  stopUpdate() {
    const alternate = this.fiberAlternate;
    if (alternate !== this) {
      this.child = alternate.child;
      this.children = alternate.children;
      this.fiberChildHead = alternate.fiberChildHead;
      this.fiberChildFoot = alternate.fiberChildFoot;
      this.__renderedChildren__ = alternate.__renderedChildren__;
      this.children.forEach((child) => (child.fiberParent = this));
    }
  }

  /**
   *
   * @param {MyReactFiberNode} parentFiber
   */
  installParent(parentFiber) {
    this.fiberParent = parentFiber;
    this.fiberSibling = null;
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
    if (!this.child) {
      this.child = childFiber;
      this.fiberChildHead = childFiber;
      this.fiberChildFoot = childFiber;
    } else {
      this.fiberChildFoot.fiberSibling = childFiber;
      this.fiberChildFoot = childFiber;
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
    hookList = [],
    listeners = [],
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

  newFiberNode.updateDiffState();

  return newFiberNode;
}

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {MyReactVDom} newVDom
 * @returns
 */
function createFiberNodeWithUpdate(
  {
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList = [],
    listeners = [],
    instance,
  },
  newVDom
) {
  const newFiber = createFiberNode(
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
  );

  if (isMounted.current && newFiber.dom && newFiber.effect) {
    pushUpdate(newFiber);
  }

  return newFiber;
}

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {{newVDom: MyReactVDom, previousRenderFiber: MyReactFiberNode}} param
 * @returns
 */
function createFiberNodeWithPosition(
  {
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList = [],
    listeners = [],
    instance,
  },
  { newVDom, previousRenderFiber }
) {
  const newFiber = createFiberNode(
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
  );

  if (
    newFiber.fiberAlternate
      ? newFiber.fiberAlternate !== previousRenderFiber
      : newFiber !== previousRenderFiber
  ) {
    processUpdatePosition(newFiber, previousRenderFiber);
  }

  return newFiber;
}

/**
 *
 * @param {{key: string, deepIndex: number, fiberParent: MyReactFiberNode, fiberAlternate: MyReactFiberNode, effect: string, dom: HTMLElement, hookHead: MyReactHookNode, hookFoot: MyReactHookNode, hookList: MyReactHookNode[], listeners: MyReactInstance[], instance: MyReactInstance }} param
 * @param {{newVDom: MyReactVDom, previousRenderFiber: MyReactFiberNode}} param
 * @returns
 */
function createFiberNodeWithUpdateAndPosition(
  {
    key,
    deepIndex,
    fiberParent,
    fiberAlternate,
    effect,
    dom,
    hookHead,
    hookFoot,
    hookList = [],
    listeners = [],
    instance,
  },
  { newVDom, previousRenderFiber }
) {
  const newFiber = createFiberNodeWithUpdate(
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
  );

  if (
    newFiber.fiberAlternate
      ? newFiber.fiberAlternate !== previousRenderFiber
      : newFiber !== previousRenderFiber
  ) {
    processUpdatePosition(newFiber, previousRenderFiber);
  }

  return newFiber;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactVDom} vdom
 */
function updateFiberNode(fiber, parentFiber, vdom) {
  fiber.fiberAlternate = fiber;

  fiber.updateDiffState();

  fiber.installVDom(vdom);

  fiber.installParent(parentFiber);

  return fiber;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 * @param {MyReactFiberNode} previousRenderFiber
 * @param {MyReactVDom} vdom
 * @returns
 */
function updateFiberNodeWithPosition(
  fiber,
  parentFiber,
  previousRenderFiber,
  vdom
) {
  const newFiber = updateFiberNode(fiber, parentFiber, vdom);

  if (newFiber !== previousRenderFiber) {
    processUpdatePosition(newFiber, previousRenderFiber);
  }

  return newFiber;
}

export {
  MyReactFiberNode,
  createFiberNode,
  createFiberNodeWithUpdate,
  createFiberNodeWithPosition,
  createFiberNodeWithUpdateAndPosition,
  updateFiberNode,
  updateFiberNodeWithPosition,
};
