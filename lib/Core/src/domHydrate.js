import { logFiber } from "./debug.js";
import { isEvent, isProperty, isStyle } from "./domProps.js";
import { getNativeEventName } from "./domTool.js";
import { empty } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { isUnitlessNumber } from "./share.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
function domPropsHydrate(fiber, dom, props) {
  Object.keys(props)
    .filter(isProperty)
    .forEach((key) => {
      if (key === "className") {
        if (dom[key] !== props[key]) {
          console.warn(
            "hydrate error, dom class not match form the template",
            logFiber(fiber)
          );
          dom[key] = props[key];
        }
        return;
      }
      if (key === "value") {
        dom[key] !== props[key];
        return;
      }
      if (dom.getAttribute(key) !== props[key]) {
        console.warn(
          "hydrate warning, dom attrs not match from template",
          logFiber(fiber)
        );
        dom.setAttribute(key, props[key]);
      }
    });
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
function domEventHydrate(fiber, dom, props) {
  Object.keys(props)
    .filter(isEvent)
    .forEach((key) => {
      const { eventName, isCapture } = getNativeEventName(key.slice(2));

      fiber.__INTERNAL_EVENT_SYSTEM__.addEventListener(
        eventName,
        props[key],
        isCapture
      );
    });
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
function domStyleHydrate(fiber, dom, props) {
  Object.keys(props)
    .filter(isStyle)
    .forEach((styleKey) => {
      Object.keys(props[styleKey] || empty).forEach((styleName) => {
        if (!isUnitlessNumber[styleName]) {
          if (typeof props[styleKey][styleName] === "number") {
            dom.style[styleName] = `${newProps[styleKey][styleName]}px`;
            return;
          }
        }
        dom.style[styleName] = props[styleKey][styleName];
      });
    });
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */
function hydrateDom(fiber, dom) {
  fiber.dom = dom;

  domPropsHydrate(fiber, dom, fiber.__vdom__?.props || empty);
  domEventHydrate(fiber, dom, fiber.__vdom__?.props || empty);
  domStyleHydrate(fiber, dom, fiber.__vdom__?.props || empty);

  return dom;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */
function checkDomHydrate(fiber, dom) {
  if (!dom) {
    console.error(
      "hydrate error, current dom not render by SSR",
      logFiber(fiber)
    );
    return false;
  }
  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      console.error(
        "hydrate error, current dom type not match vdom type",
        logFiber(fiber)
      );
      return false;
    }
    if (fiber.__vdom__.toString() !== dom.textContent) {
      console.warn(
        "hydrate waring, current hydrate text not match template text",
        logFiber(fiber)
      );
      return false;
    }
  }
  if (fiber.__isPlainNode__) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      console.error(
        "hydrate error, current dom type not a element type",
        logFiber(fiber)
      );
      return false;
    }
    if (fiber.__vdom__.type.toLowerCase() !== dom.nodeName.toLowerCase()) {
      console.error(
        "hydrate error, current dom type not match vdom type",
        logFiber(fiber)
      );
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {HTMLElement} parentDom
 */
function getHydrateDom(parentDom) {
  const children = Array.from(parentDom.childNodes);

  return children.find(
    (dom) => dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__
  );
}

export { hydrateDom, checkDomHydrate, getHydrateDom };
