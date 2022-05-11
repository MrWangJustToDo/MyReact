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

  range = document.createRange();

  /**
   * @type MyReactFiberNode[]
   */
  pendingUpdate = [];

  container = null;

  constructor() {
    // if (enableHighLight.current) {
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: absolute;
      z-index: 999999;
      width: 100%;
      left: 0;
      top: 0;
      `;
    document.body.append(this.container);
    // }
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
   */
  highLight = (fiber) => {
    if ((enableHighLight.current || window.__highlight__) && fiber.dom) {
      if (!fiber.dom.__pendingHighLight__) {
        fiber.dom.__pendingHighLight__ = true;
        this.startHighLight(fiber);
      }
    }
  };

  startHighLight = (fiber) => {
    this.pendingUpdate.push(fiber);
    this.flashPending();
  };

  flashPending = (cb) => {
    Promise.resolve().then(() => {
      const allFiber = this.pendingUpdate.slice(0);
      this.pendingUpdate = [];
      const allWrapper = [];
      allFiber.forEach((f) => {
        const wrapperDom = this.getHighLight();
        allWrapper.push(wrapperDom);
        f.__isTextNode__
          ? this.range.selectNodeContents(f.dom)
          : this.range.selectNode(f.dom);
        const rect = this.range.getBoundingClientRect();
        const left =
          parseInt(rect.left) + parseInt(document.scrollingElement.scrollLeft);
        const top =
          parseInt(rect.top) + parseInt(document.scrollingElement.scrollTop);
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
      });
      setTimeout(() => {
        allWrapper.forEach((wrapperDom) => {
          wrapperDom.style.boxShadow = "none";
          this.map.push(wrapperDom);
        });
        allFiber.forEach((f) => (f.dom.__pendingHighLight__ = false));
      }, 100);
    });
  };
}

// source from react code
var isUnitlessNumber = {
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
        Object.keys(newProps[styleKey] || {})
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
  if (isMounted.current && (enableHighLight.current || window.__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber);
  }
  return element;
}

function createDom(fiber) {
  const dom = fiber.__isTextNode__
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.type);

  fiber.dom = dom;

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

export { updateDom, createDom, render };
