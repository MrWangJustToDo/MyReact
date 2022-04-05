import { empty, rootContainer, rootFiber } from "./env.js";
import { createFiberNode, MyReactFiberNode } from "./fiber.js";
import { startRender } from "./render.js";
import { MyReactInstance } from "./share.js";
import {
  isGone,
  isEvent,
  isNew,
  isProperty,
  isStyle,
  Portal,
  ForwardRef,
  Context,
  Provider,
  Consumer,
  getNativeEventName,
} from "./tools.js";
import { createElement } from "./vdom.js";

/**
 *
 * @param {HTMLElement} element
 * @param {{[k: string]: any}} oldProps
 * @param {{[k: string]: any}} newProps
 * @param {MyReactFiberNode} fiber
 * @returns
 */
function updateDom(element, oldProps, newProps, fiber) {
  if (fiber.__isTextNode__) {
    element.textContent = fiber.__vdom__;
  } else if (fiber.__isPlainNode__) {
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        const eventName = getNativeEventName(key.slice(2));
        element.removeEventListener(eventName, oldProps[key]);
      });

    Object.keys(oldProps)
      .filter(isProperty)
      .filter(isGone(newProps))
      .forEach((key) => {
        if (key === "className") {
          element[key] = "";
        } else {
          element.removeAttribute(key);
        }
      });

    Object.keys(newProps)
      .filter(isProperty)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        if (key === "className") {
          element[key] = newProps[key];
        } else {
          element.setAttribute(key, newProps[key]);
        }
      });

    Object.keys(newProps)
      .filter(isEvent)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        const eventName = getNativeEventName(key.slice(2));
        element.addEventListener(eventName, newProps[key]);
      });

    Object.keys(newProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys(newProps[styleKey])
          .filter(isNew(oldProps[styleKey] || empty, newProps[styleKey]))
          .forEach((styleName) => {
            element.style[styleName] = newProps[styleKey][styleName];
          });
      });
  }
  return element;
}

function createDom(fiber) {
  const dom = fiber.__isTextNode__
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.type);

  updateDom(
    dom,
    empty,
    fiber.__isTextNode__ ? empty : fiber.__vdom__.props,
    fiber
  );

  return dom;
}

function render(element, container) {
  rootContainer.current = container;

  const rootElement = createElement(null, null, element);

  const _rootFiber = createFiberNode({ deepIndex: 0 }, rootElement);

  _rootFiber.__root__ = true;

  rootFiber.current = _rootFiber;

  startRender(_rootFiber);
}

function createPortal(element, container) {
  return createElement({ type: Portal }, { container }, element);
}

function createContext(value) {
  const ContextObject = {
    type: Context,
  };

  const ProviderObject = {
    type: Provider,
    value,
  };

  const ConsumerObject = {
    type: Consumer,
    Internal: MyReactInstance,
  };

  Object.defineProperty(ConsumerObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(ProviderObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  ContextObject.Provider = ProviderObject;
  ContextObject.Consumer = ConsumerObject;

  return ContextObject;
}

function forwardRef(ForwardRefRender) {
  return {
    type: ForwardRef,
    render: ForwardRefRender,
  };
}

export {
  updateDom,
  createDom,
  render,
  createContext,
  createPortal,
  forwardRef,
};
