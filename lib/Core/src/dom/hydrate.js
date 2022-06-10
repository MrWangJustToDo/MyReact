import { warning } from "../debug.js";
import { createBrowserDom } from "./client.js";
import { getNativeEventName } from "./tool.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { isProperty, isStyle, isEvent } from "./prop.js";
import { EMPTY_OBJECT, IS_UNIT_LESS_NUMBER } from "../share.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
const domPropsHydrate = (fiber, dom, props) => {
  Object.keys(props)
    .filter(isProperty)
    .forEach((key) => {
      if (key === "className") {
        if (dom[key] !== props[key]) {
          warning({
            message: `hydrate warning, dom class not match from server, server: ${dom[key]}, client: ${props[key]}`,
            fiber,
          });
          dom[key] = props[key];
        }
        return;
      }
      if (key === "value") {
        dom[key] !== props[key];
        return;
      }
      if (
        props[key] !== null &&
        props[key] !== undefined &&
        dom.getAttribute(key) !== props[key]?.toString()
      ) {
        warning({
          message: `hydrate warning, dom attrs not match from server, server: ${dom.getAttribute(
            key
          )}, client: ${props[key]}`,
          fiber,
        });
        dom.setAttribute(key, props[key]);
      }
    });
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
const domEventHydrate = (fiber, dom, props) => {
  Object.keys(props)
    .filter(isEvent)
    .forEach((key) => {
      const { eventName, isCapture } = getNativeEventName(key.slice(2));

      fiber.addEventListener(eventName, props[key], isCapture);
    });
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
const domStyleHydrate = (fiber, dom, props) => {
  Object.keys(props)
    .filter(isStyle)
    .forEach((styleKey) => {
      Object.keys(props[styleKey] || EMPTY_OBJECT).forEach((styleName) => {
        if (!IS_UNIT_LESS_NUMBER[styleName]) {
          if (typeof props[styleKey][styleName] === "number") {
            dom.style[styleName] = `${props[styleKey][styleName]}px`;
            return;
          }
        }
        dom.style[styleName] = props[styleKey][styleName];
      });
    });
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */
const hydrateDom = (fiber, dom) => {
  fiber.dom = dom;

  domPropsHydrate(fiber, dom, fiber.__vdom__?.props || EMPTY_OBJECT);
  domEventHydrate(fiber, dom, fiber.__vdom__?.props || EMPTY_OBJECT);
  domStyleHydrate(fiber, dom, fiber.__vdom__?.props || EMPTY_OBJECT);

  return dom;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */
const checkHydrateDom = (fiber, dom) => {
  if (!dom) {
    warning({
      message: `hydrate warning, dom not render from server`,
      fiber,
    });
    return false;
  }
  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      warning({
        message: `hydrate warning, dom type not match from server, server: ${dom.nodeName
          .toString()
          .toLowerCase()}, client: ${fiber.__vdom__}`,
        fiber,
      });
      return false;
    }
    if (fiber.__vdom__.toString() !== dom.textContent) {
      warning({
        message: `hydrate warning, dom content not match from server, server: ${dom.textContent}, client: ${fiber.__vdom__}`,
        fiber,
      });
      return false;
    }
  }
  if (fiber.__isPlainNode__) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      warning({
        message: `hydrate warning, dom type not match from server, server: ${dom.nodeName
          .toString()
          .toLowerCase()}, client: ${fiber.__vdom__.type}`,
        fiber,
      });
      return false;
    }
    if (fiber.__vdom__.type.toLowerCase() !== dom.nodeName.toLowerCase()) {
      warning({
        message: `hydrate warning, dom name not match from server, server: ${dom.nodeName
          .toString()
          .toLowerCase()}, client: ${fiber.__vdom__.type}`,
        fiber,
      });
      return false;
    }
  }
  return true;
};

/**
 *
 * @param {HTMLElement} parentDom
 */
const getHydrateDom = (parentDom) => {
  const children = Array.from(parentDom.childNodes);

  return children.find(
    (dom) => dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__
  );
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
const commitHydrate = (fiber, parentDom) => {
  if (
    fiber.__isPlainNode__ ||
    (fiber.__isTextNode__ && fiber.__vdom__ !== "")
  ) {
    const dom = getHydrateDom(parentDom);
    const isHydrateMatch = checkHydrateDom(fiber, dom);
    if (isHydrateMatch) {
      hydrateDom(fiber, dom);
    } else {
      const newDom = createBrowserDom(fiber);
      if (dom) {
        parentDom.replaceChild(newDom, dom);
      } else {
        parentDom.append(newDom);
      }
    }
    fiber.applyRef();
    fiber.dom.__hydrate__ = true;
  }
};

export { commitHydrate };
