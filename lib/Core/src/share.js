import { error } from "./debug.js";
import { enableAllCheck } from "./env.js";

const NODE_TYPE_KEY = [
  "__isTextNode__",
  "__isEmptyNode__",
  "__isPlainNode__",
  "__isFragmentNode__",
  // ====  object node ==== //
  "__isObjectNode__",
  "__isMemo__",
  "__isPortal__",
  "__isForwardRef__",
  "__isContextProvider__",
  "__isContextConsumer__",
  // ==== dynamic node ==== //
  "__isDynamicNode__",
  "__isClassComponent__",
  "__isFunctionComponent__",
];

const COMPONENT_METHOD = [
  "shouldComponentUpdate",
  "componentDidMount",
  "componentDidUpdate",
  "componentWillUnmount",
];

const DEFAULT_NODE_TYPE = {
  __isTextNode__: false,
  __isEmptyNode__: false,
  __isPlainNode__: false,
  __isFragmentNode__: false,
  // ====  object node ==== //
  __isObjectNode__: false,
  __isMemo__: false,
  __isPortal__: false,
  __isForwardRef__: false,
  __isContextProvider__: false,
  __isContextConsumer__: false,
  // ==== dynamic node ==== //
  __isDynamicNode__: false,
  __isClassComponent__: false,
  __isFunctionComponent__: false,
};

// number props
const IS_UNIT_LESS_NUMBER = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

const IS_SINGLE_ELEMENT = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true,
};

const EMPTY_ARRAY = [];

const EMPTY_OBJECT = {};

class CustomHeap extends Array {
  constructor(
    judgeFun = (o1, o2) => o1 < o2,
    transferFun = (it) => it,
    ...args
  ) {
    super(...args);
    this.judgeFun = judgeFun;
    this.transferFun = transferFun;
    this._init();
  }

  get length() {
    return this.length;
  }

  peek() {
    return this[0];
  }

  pushValue(val) {
    this.push(val);
    let current = this.length - 1;
    let pre = ((current - 1) / 2) | 0;
    while (
      pre >= 0 &&
      this.judgeFun(
        this.transferFun(this[pre]),
        this.transferFun(this[current])
      )
    ) {
      this._swap(pre, current);
      current = pre;
      pre = ((current - 1) / 2) | 0;
    }
  }

  popTop() {
    const re = this[0];
    this[0] = this[this.length - 1];
    this.pop();
    this._heapDown(0);
    return re;
  }

  _swap(i, j) {
    const temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  _heapDown(current) {
    let max = current;
    const left = current * 2 + 1;
    const right = current * 2 + 2;
    if (
      left < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[left]))
    ) {
      max = left;
    }
    if (
      right < this.length &&
      this.judgeFun(this.transferFun(this[max]), this.transferFun(this[right]))
    ) {
      max = right;
    }
    if (max !== current) {
      this._swap(max, current);
      this._heapDown(max);
    }
  }

  _init() {
    const start = ((this.length - 1) / 2) | 0;
    for (let i = start; i >= 0; i--) {
      this._heapDown(i);
    }
  }
}

const SORT_BY_DEEP_HEAP = new CustomHeap(
  (o1, o2) => o1 > o2,
  (fiber) => fiber.deepIndex
);

class MyReactInternalType {
  __internal_node_type__ = {
    __isTextNode__: false,
    __isEmptyNode__: false,
    __isPlainNode__: false,
    __isFragmentNode__: false,
    // 对象转换为节点   //
    __isObjectNode__: false,
    __isForwardRef__: false,
    __isPortal__: false,
    __isMemo__: false,
    __isContextProvider__: false,
    __isContextConsumer__: false,
    // 动态节点 //
    __isDynamicNode__: false,
    __isClassComponent__: false,
    __isFunctionComponent__: false,
  };

  get __isTextNode__() {
    return this.__internal_node_type__.__isTextNode__;
  }
  get __isEmptyNode__() {
    return this.__internal_node_type__.__isEmptyNode__;
  }
  get __isPlainNode__() {
    return this.__internal_node_type__.__isPlainNode__;
  }
  get __isFragmentNode__() {
    return this.__internal_node_type__.__isFragmentNode__;
  }
  get __isObjectNode__() {
    return this.__internal_node_type__.__isObjectNode__;
  }
  get __isForwardRef__() {
    return this.__internal_node_type__.__isForwardRef__;
  }
  get __isPortal__() {
    return this.__internal_node_type__.__isPortal__;
  }
  get __isMemo__() {
    return this.__internal_node_type__.__isMemo__;
  }
  get __isContextProvider__() {
    return this.__internal_node_type__.__isContextProvider__;
  }
  get __isContextConsumer__() {
    return this.__internal_node_type__.__isContextConsumer__;
  }
  get __isDynamicNode__() {
    return this.__internal_node_type__.__isDynamicNode__;
  }
  get __isClassComponent__() {
    return this.__internal_node_type__.__isClassComponent__;
  }
  get __isFunctionComponent__() {
    return this.__internal_node_type__.__isFunctionComponent__;
  }

  /**
   *
   * @param {{__isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isMemo__: boolean,
   *  __isPortal__: boolean,
   *  __isForwardRef__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean}} props
   */
  setNodeType(props) {
    Object.keys(props || EMPTY_OBJECT).forEach((key) => {
      this.__internal_node_type__[key] = props[key];
    });
  }

  /**
   *
   * @param {{__isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isMemo__: boolean,
   *  __isPortal__: boolean,
   *  __isForwardRef__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean}} props
   */
  isSameType(props) {
    return NODE_TYPE_KEY.every(
      (key) => this.__internal_node_type__[key] === props[key]
    );
  }
}

class MyReactInternalInstance {
  /**
   * @type MyReactFiberNode
   */
  __fiber__ = null;

  /**
   * @type MyReactFiberNode
   */
  __context__ = null;

  /**
   * @type number
   */
  __hecticCount__ = 0;

  /**
   * @type number
   */
  __updateTimeStep__ = null;

  /**
   *
   * @param {MyReactFiberNode} context
   */
  setContext(context) {
    if (this.__context__) this.__context__.removeDependence(this);
    this.__context__ = context;
    this.__context__?.addDependence(this);
  }

  /**
   *
   * @param {MyReactFiberNode} fiber
   */
  setFiber(fiber) {
    this.__fiber__ = fiber;
  }

  updateTimeStep() {
    if (enableAllCheck.current) {
      const now = new Date().getTime();
      if (now - this.__updateTimeStep__ <= 8) {
        this.__hecticCount__ += 1;
      } else {
        this.__hecticCount__ = 0;
      }
      if (this.__hecticCount__ > 40) {
        error({
          message: "look like have a infinity loop on current component",
          fiber: this.__fiber__,
        });
      }
      this.__updateTimeStep__ = now;
    }
  }
}

/**
 *
 * @param {any} val
 * @returns
 */
const createRef = (val) => ({ current: val });

export {
  createRef,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NODE_TYPE_KEY,
  COMPONENT_METHOD,
  DEFAULT_NODE_TYPE,
  SORT_BY_DEEP_HEAP,
  IS_SINGLE_ELEMENT,
  IS_UNIT_LESS_NUMBER,
  MyReactInternalType,
  MyReactInternalInstance,
};
