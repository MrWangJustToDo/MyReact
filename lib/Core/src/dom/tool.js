import {
  enableHighLight,
  isHydrateRender,
  isMounted,
  isServerRender,
} from "../env.js";
import { HighLight } from "./highlight.js";
import { IS_UNIT_LESS_NUMBER } from "../share.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { isEvent, isGone, isNew, isStyle, isProperty } from "./prop.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const findLatestDomFromFiber = (fiber) => {
  const currentLoopFiberArray = [fiber];
  while (currentLoopFiberArray.length) {
    const _fiber = currentLoopFiberArray.shift();
    if (_fiber.dom) return _fiber.dom;
    currentLoopFiberArray.push(..._fiber.children);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const findLatestDomFromComponentFiber = (fiber) => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    for (let i = 0; i < fiber.children.length; i++) {
      const dom = findLatestDomFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }
};

/**
 *
 * @param {string} eventName
 * @returns
 */
const getNativeEventName = (eventName) => {
  let isCapture = false;
  if (eventName.endsWith("Capture")) {
    isCapture = true;
    eventName = eventName.split("Capture")[0];
  }
  if (eventName === "DoubleClick") {
    eventName = "dblclick";
  } else {
    eventName = eventName.toLowerCase();
  }
  return {
    isCapture,
    eventName,
  };
};

/**
 *
 * @param {HTMLElement} element
 * @param {{[k: string]: any}} oldProps
 * @param {{[k: string]: any}} newProps
 * @param {MyReactFiberNode} fiber
 * @returns
 */
const updateDom = (element, oldProps, newProps, fiber) => {
  if (fiber.__isTextNode__) {
    element.textContent = fiber.__vdom__;
  } else if (fiber.__isPlainNode__) {
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        const { isCapture, eventName } = getNativeEventName(key.slice(2));

        fiber.removeEventListener(eventName, oldProps[key], isCapture);
      });

    Object.keys(oldProps)
      .filter(isProperty)
      .filter(isGone(newProps))
      .forEach((key) => {
        if (key === "className" || key === "value") {
          element[key] = "";
        } else {
          element.removeAttribute(key);
        }
      });

    Object.keys(oldProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys(oldProps[styleKey] || {})
          .filter(isGone(newProps[styleKey] || {}))
          .forEach((styleName) => {
            element.style[styleName] = "";
          });
      });

    Object.keys(newProps)
      .filter(isEvent)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        const { eventName, isCapture } = getNativeEventName(key.slice(2));

        fiber.addEventListener(eventName, newProps[key], isCapture);
      });

    Object.keys(newProps)
      .filter(isProperty)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        if (key === "className" || key === "value") {
          element[key] = newProps[key];
        } else {
          element.setAttribute(key, newProps[key]);
        }
      });

    Object.keys(newProps)
      .filter(isStyle)
      .forEach((styleKey) => {
        Object.keys(newProps[styleKey] || {})
          .filter(isNew(oldProps[styleKey] || {}, newProps[styleKey]))
          .forEach((styleName) => {
            if (!IS_UNIT_LESS_NUMBER[styleName]) {
              if (typeof newProps[styleKey][styleName] === "number") {
                element.style[styleName] = `${newProps[styleKey][styleName]}px`;
                return;
              } else {
                element.style[styleName] = newProps[styleKey][styleName];
                return;
              }
            }
            if (
              newProps[styleKey][styleName] !== null &&
              newProps[styleKey][styleName] !== undefined
            ) {
              element.style[styleName] = newProps[styleKey][styleName];
            } else {
              element.style[styleName] = null;
            }
          });
      });
  }

  if (
    isMounted.current &&
    !isHydrateRender.current &&
    !isServerRender.current &&
    (enableHighLight.current || window.__highlight__)
  ) {
    HighLight.getHighLightInstance().highLight(fiber);
  }

  return element;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {(f: MyReactFiberNode) => MyReactFiberNode} transform
 */
const getDom = (fiber, transform) => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    return getDom(transform(fiber), transform);
  }
};

export {
  getDom,
  updateDom,
  getNativeEventName,
  findLatestDomFromComponentFiber,
};
