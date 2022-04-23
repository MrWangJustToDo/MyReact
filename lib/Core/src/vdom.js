import { MyReactInstance, MyReactTypeInternalInstance } from "./share.js";
import {
  Consumer,
  ForwardRef,
  Fragment,
  logCurrentRunningFiber,
  Memo,
  Portal,
  Provider,
} from "./tools.js";

export const once = (action) => {
  let flag = false;
  return (...args) => {
    if (!flag) {
      flag = true;
      action.call(null, ...args);
    }
  };
};

class VDomInternalInstance extends MyReactTypeInternalInstance {
  __INTERNAL_STATE__ = {
    __clonedNode__: null,
    __validKey__: false,
    __validType__: false,
    __dynamicChildren__: null,
  };

  get __clonedNode__() {
    return this.__INTERNAL_STATE__.__clonedNode__;
  }
  get __validKey__() {
    return this.__INTERNAL_STATE__.__validKey__;
  }
  get __validType__() {
    return this.__INTERNAL_STATE__.__validType__;
  }
  get __dynamicChildren__() {
    return this.__INTERNAL_STATE__.__dynamicChildren__;
  }
  set __clonedNode__(v) {
    this.__INTERNAL_STATE__.__clonedNode__ = v;
  }
  set __validKey__(v) {
    this.__INTERNAL_STATE__.__validKey__ = v;
  }
  set __validType__(v) {
    this.__INTERNAL_STATE__.__validType__ = v;
  }
  set __dynamicChildren__(v) {
    this.__INTERNAL_STATE__.__dynamicChildren__ = v;
  }
}

class MyReactVDom extends VDomInternalInstance {
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
    super();
    const { key, ref, ...resProps } = props || {};
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = resProps;
    this.children = children;
    this._processType();
    this._checkValidVDom();
  }

  _processType() {
    let rawType = this.type;
    if (typeof this.type === "object" && this.type !== null) {
      this.__INTERNAL_NODE_TYPE__.__isObjectNode__ = true;
      rawType = this.type.type;
    }
    // internal element
    switch (rawType) {
      case Fragment:
        this.__INTERNAL_NODE_TYPE__.__isFragmentNode__ = true;
        return;
      case Provider:
        this.__INTERNAL_NODE_TYPE__.__isContextProvider__ = true;
        return;
      case Consumer:
        this.__INTERNAL_NODE_TYPE__.__isContextConsumer__ = true;
        return;
      case Portal:
        this.__INTERNAL_NODE_TYPE__.__isPortal__ = true;
        return;
      case Memo:
        this.__INTERNAL_NODE_TYPE__.__isMemo__ = true;
        return;
      case ForwardRef:
        this.__INTERNAL_NODE_TYPE__.__isForwardRef__ = true;
        return;
    }

    if (typeof rawType === "function") {
      this.__INTERNAL_NODE_TYPE__.__isDynamicNode__ = true;
      if (rawType.prototype.isMyReactComponent) {
        this.__INTERNAL_NODE_TYPE__.__isClassComponent__ = true;
      } else {
        this.__INTERNAL_NODE_TYPE__.__isFunctionComponent__ = true;
      }
      return;
    }

    if (typeof rawType === "string") {
      this.__INTERNAL_NODE_TYPE__.__isPlainNode__ = true;
      return;
    }

    this.__INTERNAL_NODE_TYPE__.__isEmptyNode__ = true;
  }

  _checkValidVDom() {
    // in progress...
    if (!this.__validType__) {
      if (this.__isContextConsumer__) {
        if (typeof this.children !== "function") {
          throw new Error("Consumer need function as children");
        }
      }
      if (this.__isContextProvider__) {
        if (!this.props.value) {
          throw new Error("Provider need a value props");
        }
      }
      if (this.__isPortal__) {
        if (!this.props.container) {
          throw new Error("createPortal() need a dom container");
        }
      }
      if (this.__isMemo__ || this.__isForwardRef__) {
        if (typeof this.type.render !== "function") {
          if (typeof this.type.render !== "object" || !this.type.render.type) {
            throw new Error("render type must as a function");
          }
        }
      }
      if (this.ref) {
        if (typeof this.ref !== "object" && typeof this.ref !== "function") {
          throw new Error("unSupport ref usage");
        }
      }
      if (typeof this.type === "object") {
        if (!this.type?.type) {
          throw new Error("invalid element type");
        }
      }
      if (
        this.key &&
        typeof this.key !== "string" &&
        typeof this.key !== "number"
      ) {
        throw new Error("invalid key props");
      }
      this.__validType__ = true;
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
  let hasLog = false;
  children.forEach((c) => {
    if (isValidElement(c) && !c.__validKey__) {
      if (obj[c.key]) {
        throw new Error("array child have duplicate key");
      }
      if (c.key === undefined) {
        if (!hasLog) {
          console.error(
            "each array child must have a unique key props",
            logCurrentRunningFiber()
          );
        }
        hasLog = true;
      } else {
        obj[c.key] = true;
      }
      c.__validKey__ = true;
    }
  });
}

/**
 *
 * @param {MyReactVDom[]} children
 */
const checkArrayChildrenKey = (children) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      checkValidKey(child);
    } else if (isValidElement(child)) {
      child.__validKey__ = true;
    }
  });
};

/**
 *
 * @param {MyReactVDom[] | MyReactVDom} children
 */
const checkSingleChildrenKey = (children) => {
  if (Array.isArray(children)) {
    checkValidKey(children);
  } else if (isValidElement(children)) {
    children.__validKey__ = true;
  }
};

function createElement(type, props, children) {
  const childrenLength = arguments.length - 2;

  props = props || {};

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
  } else {
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
    clonedElement.__clonedNode__ = true;
    return clonedElement;
  } else {
    return element;
  }
}

/**
 *
 * @param {MyReactVDom | any} element
 * @returns
 */
function isValidElement(element) {
  if (element instanceof MyReactVDom) {
    return true;
  } else {
    return false;
  }
}

export { createElement, cloneElement, isValidElement, MyReactVDom };
