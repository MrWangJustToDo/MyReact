import {
  empty,
  isMounted,
  rootContainer,
  rootFiber,
  enableHighLight,
} from "./env.js";
import { createFiberNode, MyReactFiberNode } from "./fiber.js";
import { startRender } from "./render.js";
import {
  isGone,
  isEvent,
  isNew,
  isProperty,
  isStyle,
  getNativeEventName,
} from "./tools.js";
import { createElement } from "./vdom.js";

class HighLight {
  /**
   * @type HighLight
   */
  static instance = undefined;

  /**
   *
   * @returns HighLight
   */
  static getHighLightInstance = () => {
    HighLight.instance = HighLight.instance || new HighLight();
    return HighLight.instance;
  };

  map = [];

  pendingUpdate = [];

  container = null;

  constructor() {
    if (enableHighLight.current) {
      this.container = document.createElement("div");
      this.container.style.cssText = `
      position: absolute;
      z-index: 999999;
      width: 100%;
      left: 0;
      top: 0;
      `;
      document.body.append(this.container);
    }
  }

  createHighLight = () => {
    const element = document.createElement("div");
    this.container.append(element);
    return element;
  };

  getHighLight = () => {
    if (this.map.length) {
      const element = this.map.shift();
      return element;
    }
    return this.createHighLight();
  };

  /**
   *
   * @param {MyReactFiberNode} fiber
   * @returns MyReactFiberNode
   */
  getFiberWithDom = (fiber) => {
    if (fiber) {
      if (fiber.__isTextNode__) return this.getFiberWithDom(fiber.fiberParent);
      if (fiber.dom) return fiber;
      if (fiber.__isPortal__) return fiber;
      return this.getFiberWithDom(fiber.fiberParent);
    }
  };

  /**
   *
   * @param {MyReactFiberNode} fiber
   */
  highLight = (fiber) => {
    if (enableHighLight.current) {
      if (!fiber.__pendingHighLight__) {
        fiber.__pendingHighLight__ = true;
        const fiberWithDom = this.getFiberWithDom(fiber);
        const dom = fiberWithDom.__isPortal__
          ? fiberWithDom.__vdom__.props.container
          : fiberWithDom.dom;
        this.startHighLight(dom, () => {
          fiber.__pendingHighLight__ = false;
        });
      }
    }
  };

  startHighLight = (dom, cb) => {
    this.pendingUpdate.push(dom);
    this.flashPending(cb);
  };

  flashPending = (cb) => {
    Promise.resolve()
      .then(() => {
        const allDom = this.pendingUpdate.slice(0);
        this.pendingUpdate = [];
        return Promise.all(
          allDom.map((dom) => {
            const wrapperDom = this.getHighLight();
            const rect = dom.getBoundingClientRect();
            const left = parseInt(rect.left);
            const top = parseInt(rect.top);
            const width = parseInt(rect.width) + 4;
            const height = parseInt(rect.height) + 4;
            const positionLeft = left - 2;
            const positionTop = top - 2;
            wrapperDom.style.cssText = `
          position: absolute;
          width: ${width}px;
          height: ${height}px;
          left: ${positionLeft}px;
          top: ${positionTop}px;
          pointer-events: none;
          box-shadow: 0.0625rem 0.0625rem 0.0625rem red, -0.0625rem -0.0625rem 0.0625rem red;
          `;
            return new Promise((r) => {
              setTimeout(() => {
                wrapperDom.style.boxShadow = "none";
                this.map.push(wrapperDom);
                r();
              }, 100);
            });
          })
        );
      })
      .then(cb);
  };
}

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
  if (isMounted.current && enableHighLight.current) {
    HighLight.getHighLightInstance().highLight(fiber);
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

export { updateDom, createDom, render };
