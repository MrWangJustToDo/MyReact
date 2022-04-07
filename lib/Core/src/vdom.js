import { MyReactPureComponent } from "./component.js";
import { MyReactFiberNode } from "./fiber.js";
import { MyReactInstance, once } from "./share.js";
import {
  Consumer,
  ForwardRef,
  Fragment,
  logCurrentRunningFiber,
  Memo,
  Portal,
  Provider,
} from "./tools.js";

class MyReactVDom {
  constructor(
    /**
     * @type typeof MyReactInstance
     */
    type,
    props,
    /**
     * @type MyReactVDom[]
     */
    children
  ) {
    const { key, ref, ...resProps } = props || {};
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = resProps;
    this.children = children;
    this._initialType();
    this._processType();
    this._initialProps();
    this._checkValidVDom();
  }

  _initialType() {
    this.__isEmptyNode__ = false;
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

  _processType() {
    let rawType = this.type;
    if (typeof this.type === "object" && this.type !== null) {
      this.__isObjectNode__ = true;
      rawType = this.type.type;
    }
    // internal element
    switch (rawType) {
      case Fragment:
        this.__isFragmentNode__ = true;
        return;
      case Provider:
        this.__isContextProvider__ = true;
        return;
      case Consumer:
        this.__isContextConsumer__ = true;
        return;
      case Portal:
        this.__isPortal__ = true;
        return;
      case Memo:
        this.__isMemo__ = true;
        return;
      case ForwardRef:
        this.__isForwardRef__ = true;
        return;
    }
    if (typeof rawType === "function") {
      this.__isDynamicNode__ = true;
      if (rawType.prototype.isMyReactComponent) {
        this.__isClassComponent__ = true;
      } else {
        this.__isFunctionComponent__ = true;
      }
      return;
    } else if (typeof rawType === "string") {
      this.__isPlainNode__ = true;
      return;
    }
    this.__isEmptyNode__ = true;
  }

  _initialProps() {
    if (
      this.__isClassComponent__ &&
      this.type.prototype.isMyReactMemoComponent &&
      this.type.prototype.isMyReactForwardRefRender
    ) {
      this.props = { ...this.props, ref: this.ref };
    }
    this.__dynamicChildren__ = null;
  }

  _checkValidVDom() {
    if (this.__isContextConsumer__) {
      if (typeof this.children !== "function") {
        throw new Error("Consumer need function as children");
      }
    }
  }
}

function createVDom({ type, props, children }) {
  return new MyReactVDom(type, props, children || props.children);
}

/**
 *
 * @param {MyReactVDom[]} children
 */
function checkValidKey(children) {
  let obj = {};
  children.forEach((c) => {
    if (isValidElement(c)) {
      if (typeof c.key === "object") {
        throw new Error("invalid key type");
      }
      if (obj[c.key]) {
        throw new Error("array child have duplicate key");
      }
      if (c.key === undefined) {
        console.error(
          "each array child must have a unique key props",
          logCurrentRunningFiber()
        );
      } else {
        obj[c.key] = true;
      }
    }
  });
}

/**
 *
 * @param {MyReactVDom[]} children
 */
const checkArrayChildrenKey = once((children) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      checkValidKey(child);
    }
  });
});

/**
 *
 * @param {MyReactVDom[]} children
 */
const checkSingleChildrenKey = once((children) => {
  if (Array.isArray(children)) {
    checkValidKey(children);
  }
});

function createElement(type, props, children) {
  const childrenLength = arguments.length - 2;

  props = props || {};

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
  } else if (Array.isArray(children)) {
    checkSingleChildrenKey(children);
  }

  // 将children参数自动添加到props中
  if (
    (Array.isArray(children) && children.length) ||
    (children !== null && children !== undefined)
  ) {
    props.children = children;
  }

  return createVDom({ type, props, children });
}

function cloneElement(element, props, children) {
  if (element instanceof MyReactVDom) {
    const clonedElement = createElement(
      element.type,
      Object.assign(
        {},
        element.props,
        { key: element.key },
        { ref: element.ref },
        props
      ),
      children,
      ...Array.from(arguments).slice(3)
    );
    clonedElement.__isClonedNode__ = true;
    return clonedElement;
  } else {
    return element;
  }
}

function isValidElement(element) {
  if (element instanceof MyReactVDom) {
    return true;
  } else {
    return false;
  }
}

function memo(MemoRender) {
  class Memo extends MyReactPureComponent {
    get isMyReactMemoComponent() {
      return true;
    }

    get isMyReactForwardRefRender() {
      return typeof MemoRender === "object" && MemoRender.type === ForwardRef;
    }

    render() {
      return createElement(MemoRender, this.props);
    }
  }

  return Memo;
}

export { createElement, cloneElement, isValidElement, MyReactVDom, memo };
