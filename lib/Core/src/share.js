const NODE_TYPE_KEY = [
  "__isTextNode__",
  "__isEmptyNode__",
  "__isPlainNode__",
  "__isFragmentNode__",
  "__isObjectNode__",
  "__isForwardRef__",
  "__isPortal__",
  "__isMemo__",
  "__isContextProvider__",
  "__isContextConsumer__",
  "__isDynamicNode__",
  "__isClassComponent__",
  "__isFunctionComponent__",
];

class MyReactTypeInternalInstance {
  __INTERNAL_NODE_TYPE__ = {
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

  /**
   *
   * @param {{
   *  __isTextNode__: boolean,
   *  __isEmptyNode__: boolean,
   *  __isPlainNode__: boolean,
   *  __isFragmentNode__: boolean,
   *  __isObjectNode__: boolean,
   *  __isForwardRef__: boolean,
   *  __isPortal__: boolean,
   *  __isMemo__: boolean,
   *  __isContextProvider__: boolean,
   *  __isContextConsumer__: boolean,
   *  __isDynamicNode__: boolean,
   *  __isClassComponent__: boolean,
   *  __isFunctionComponent__: boolean,
   * }} props
   */
  _processUpdateType(props) {
    Object.keys(props || {}).forEach((key) => {
      this.__INTERNAL_NODE_TYPE__[key] = props[key];
    });
  }

  /**
   *
   * @param {MyReactTypeInternalInstance} instance
   */
  _processSucceedType(instance) {
    NODE_TYPE_KEY.forEach((key) => {
      this.__INTERNAL_NODE_TYPE__[key] = instance.__INTERNAL_NODE_TYPE__[key];
    });
  }

  /**
   *
   * @param {MyReactTypeInternalInstance} instance
   */
  isSameTypeNode(instance) {
    const result = NODE_TYPE_KEY.every(
      (key) =>
        this.__INTERNAL_NODE_TYPE__[key] ===
        instance.__INTERNAL_NODE_TYPE__[key]
    );
    return result;
  }

  get __isTextNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isTextNode__;
  }
  get __isTextNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isTextNode__;
  }
  get __isEmptyNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isEmptyNode__;
  }
  get __isPlainNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isPlainNode__;
  }
  get __isFragmentNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isFragmentNode__;
  }
  get __isObjectNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isObjectNode__;
  }
  get __isForwardRef__() {
    return this.__INTERNAL_NODE_TYPE__.__isForwardRef__;
  }
  get __isPortal__() {
    return this.__INTERNAL_NODE_TYPE__.__isPortal__;
  }
  get __isMemo__() {
    return this.__INTERNAL_NODE_TYPE__.__isMemo__;
  }
  get __isContextProvider__() {
    return this.__INTERNAL_NODE_TYPE__.__isContextProvider__;
  }
  get __isContextConsumer__() {
    return this.__INTERNAL_NODE_TYPE__.__isContextConsumer__;
  }
  get __isDynamicNode__() {
    return this.__INTERNAL_NODE_TYPE__.__isDynamicNode__;
  }
  get __isClassComponent__() {
    return this.__INTERNAL_NODE_TYPE__.__isClassComponent__;
  }
  get __isFunctionComponent__() {
    return this.__INTERNAL_NODE_TYPE__.__isFunctionComponent__;
  }
}

// source from react code
const isUnitlessNumber = {
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

const singleElement = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true,
};

const createRef = (val) => ({ current: val });

class PriorityQueueByArrayAboutJudge extends Array {
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
    let re = this[0];
    this[0] = this[this.length - 1];
    this.pop();
    this._heapDown(0);
    return re;
  }

  _swap(i, j) {
    let temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  _heapDown(current) {
    let max = current;
    let left = current * 2 + 1;
    let right = current * 2 + 2;
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
    let start = ((this.length - 1) / 2) | 0;
    for (let i = start; i >= 0; i--) {
      this._heapDown(i);
    }
  }
}

const autoSortByDeepIndexFiberArray = new PriorityQueueByArrayAboutJudge(
  (o1, o2) => o1 > o2,
  (fiber) => fiber.deepIndex
);

export {
  createRef,
  singleElement,
  isUnitlessNumber,
  MyReactTypeInternalInstance,
  autoSortByDeepIndexFiberArray,
};
