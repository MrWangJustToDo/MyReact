import { warning } from "../debug.js";
import { enableAllCheck } from "../env.js";
import { DEFAULT_NODE_TYPE } from "../share.js";
import {
  Consumer,
  ForwardRef,
  Fragment,
  Memo,
  Portal,
  Provider,
} from "../symbol.js";
import { once } from "../tool.js";
import { createElement, MyReactVDom } from "./instance.js";

/**
 *
 * @param {MyReactVDom | any} element
 */
const isValidElement = (element) => {
  if (element instanceof MyReactVDom) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @param {MyReactVDom | any} element
 * @param {any} props
 * @param {MyReactVDom[] | any[]} children
 * @returns
 */
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
    if (enableAllCheck.current) {
      clonedElement.__validKey__ = true;
      clonedElement.__validType__ = true;
      clonedElement.__clonedNode__ = true;
    }
    return clonedElement;
  } else {
    return element;
  }
}

/**
 *
 * @param {MyReactVDom[]} children
 */
const checkValidKey = (children) => {
  const obj = {};
  const onceWarningDuplicate = once(warning);
  const onceWarningUndefined = once(warning);
  children.forEach((c) => {
    if (isValidElement(c) && !c.__validKey__) {
      if (obj[c.key]) {
        onceWarningDuplicate({ message: "array child have duplicate key" });
      }
      if (c.key === undefined) {
        onceWarningUndefined({
          message: "each array child must have a unique key props",
          treeOnce: true,
        });
      } else {
        obj[c.key] = true;
      }
      c.__validKey__ = true;
    }
  });
};

/**
 *
 * @param {MyReactVDom[]} children
 */
const checkArrayChildrenKey = (children) => {
  if (enableAllCheck.current) {
    children.forEach((child) => {
      if (Array.isArray(child)) {
        checkValidKey(child);
      } else if (isValidElement(child)) {
        child.__validKey__ = true;
      }
    });
  }
};

/**
 *
 * @param {MyReactVDom[] | MyReactVDom} children
 */
const checkSingleChildrenKey = (children) => {
  if (enableAllCheck.current) {
    if (Array.isArray(children)) {
      checkValidKey(children);
    } else if (isValidElement(children)) {
      children.__validKey__ = true;
    }
  }
};

/**
 *
 * @param {MyReactVDom} vdom
 */
const getTypeFromVDom = (vdom) => {
  const nodeType = Object.assign({}, DEFAULT_NODE_TYPE);
  let rawType = vdom.type;
  if (typeof rawType === "object" && rawType !== null) {
    nodeType.__isObjectNode__ = true;
    rawType = rawType.type;
  }

  switch (rawType) {
    case Fragment:
      nodeType.__isFragmentNode__ = true;
      break;
    case Provider:
      nodeType.__isContextProvider__ = true;
      break;
    case Consumer:
      nodeType.__isContextConsumer__ = true;
      break;
    case Portal:
      nodeType.__isPortal__ = true;
      break;
    case Memo:
      nodeType.__isMemo__ = true;
      break;
    case ForwardRef:
      nodeType.__isForwardRef__ = true;
      break;
  }

  if (typeof rawType === "function") {
    nodeType.__isDynamicNode__ = true;
    if (rawType.prototype?.isMyReactComponent) {
      nodeType.__isClassComponent__ = true;
    } else {
      nodeType.__isFunctionComponent__ = true;
    }
  }

  if (typeof rawType === "string") {
    nodeType.__isPlainNode__ = true;
  }

  return nodeType;
};

export {
  cloneElement,
  isValidElement,
  getTypeFromVDom,
  checkArrayChildrenKey,
  checkSingleChildrenKey,
};
