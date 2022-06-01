import { MyReactComponent } from "./component.js";
import { createBrowserDom, HighLight } from "./domClient.js";
import { isEvent, isGone, isNew, isStyle, isProperty } from "./domProps.js";
import { createServerDom } from "./domServer.js";
import {
  findLatestDomFromComponentFiber,
  getNativeEventName,
} from "./domTool.js";
import {
  isMounted,
  isServerRender,
  isHydrateRender,
  enableHighLight,
  rootContainer,
  rootFiber,
  empty,
} from "./env.js";
import { createFiberNode, MyReactFiberNode } from "./fiber.js";
import { startRender } from "./render.js";
import { isUnitlessNumber } from "./share.js";
import { MyReactVDom } from "./vdom.js";

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
        const { isCapture, eventName } = getNativeEventName(key.slice(2));

        fiber.__INTERNAL_EVENT_SYSTEM__.removeEventListener(
          eventName,
          oldProps[key],
          isCapture
        );
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
        Object.keys(oldProps[styleKey] || empty)
          .filter(isGone(newProps[styleKey] || empty))
          .forEach((styleName) => {
            element.style[styleName] = "";
          });
      });

    Object.keys(newProps)
      .filter(isEvent)
      .filter(isNew(oldProps, newProps))
      .forEach((key) => {
        const { eventName, isCapture } = getNativeEventName(key.slice(2));

        fiber.__INTERNAL_EVENT_SYSTEM__.addEventListener(
          eventName,
          newProps[key],
          isCapture
        );
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
        Object.keys(newProps[styleKey] || empty)
          .filter(isNew(oldProps[styleKey] || empty, newProps[styleKey]))
          .forEach((styleName) => {
            if (!isUnitlessNumber[styleName]) {
              if (typeof newProps[styleKey][styleName] === "number") {
                element.style[styleName] = `${newProps[styleKey][styleName]}px`;
                return;
              }
            }
            element.style[styleName] = newProps[styleKey][styleName];
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
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns
 */
function createDom(fiber) {
  if (isServerRender.current) {
    return createServerDom(fiber);
  } else if (isHydrateRender.current) {
    return null;
  } else {
    return createBrowserDom(fiber);
  }
}

/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */
function render(element, container) {
  rootContainer.current = container;

  Array.from(container.children).forEach((n) => n.remove());

  const rootElement = element;

  const _rootFiber = createFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  _rootFiber.__root__ = true;

  rootFiber.current = _rootFiber;

  container.setAttribute("render", "MyReact");

  container.__vdom__ = rootElement;

  container.__fiber__ = _rootFiber;

  startRender(_rootFiber);
}

/**
 *
 * @param {MyReactComponent} internalInstance
 * @returns
 */
function findDOMNode(internalInstance) {
  if (internalInstance instanceof MyReactComponent) {
    return findLatestDomFromComponentFiber(internalInstance.__fiber__);
  }
  return null;
}

export { updateDom, createDom, render, findDOMNode };
