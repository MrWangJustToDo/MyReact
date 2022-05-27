import { MyReactComponent } from "./component.js";
import { logFiber } from "./debug.js";
import {
  empty,
  isMounted,
  rootContainer,
  rootFiber,
  enableHighLight,
  isServerRender,
  isHydrate,
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
  findLatestDomFromComponentFiber,
} from "./tools.js";
import { MyReactVDom } from "./vdom.js";

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
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: absolute;
      z-index: 999999;
      width: 100%;
      left: 0;
      top: 0;
      pointer-events: none;
      `;
    document.body.append(this.container);
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

class Element {
  style = {};
  attrs = {};
  children = [];
  constructor(type) {
    this.type = type;
  }

  addEventListener() {}

  removeEventListener() {}

  removeAttribute(key) {
    delete this.attrs[key];
  }
  setAttribute(key, value) {
    this.attrs[key] = value;
  }

  /**
   *
   * @param {Element} dom
   */
  append(...dom) {
    this.children.push(...dom);
  }

  appendChild(dom) {
    if (dom instanceof Element || dom instanceof TextElement) {
      this.children.push(dom);
      return dom;
    } else {
      throw new Error("element instance error");
    }
  }

  serializeStyle() {
    const styleKeys = Object.keys(this.style);
    if (styleKeys.length) {
      return `style="${styleKeys
        .map((key) => `${key}: ${this.style[key]};`)
        .reduce((p, c) => p + c, "")}"`;
    }
    return "";
  }

  serializeAttrs() {
    const attrsKeys = Object.keys(this.attrs);
    if (attrsKeys.length) {
      return attrsKeys
        .map((key) => `${key}=${this.attrs[key]}`)
        .reduce((p, c) => `${p} ${c}`, "");
    } else {
      return "";
    }
  }

  serializeProps() {
    if (this.className) {
      return `class=${this.className}`;
    } else {
      return "";
    }
  }

  toString() {
    if (singleElement[this.type]) {
      if (this.children.length)
        throw new Error(`can not add child to ${this.type} element`);
      return `<${this.type} />`;
    } else {
      if (this.type) {
        return `<${
          this.type
        } ${this.serializeProps()} ${this.serializeStyle()} ${this.serializeAttrs()} >${this.children
          .reduce((p, c) => {
            if (
              p.length &&
              c instanceof TextElement &&
              p[p.length - 1] instanceof TextElement
            ) {
              p.push("<!-- -->");
            }
            p.push(c);
            return p;
          }, [])
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, "")}</${this.type}>`;
      } else {
        return this.children
          .map((dom) => dom.toString())
          .reduce((p, c) => p + c, "");
      }
    }
  }
}

class TextElement {
  constructor(content) {
    this.content = content;
  }

  toString() {
    return this.content.toString();
  }
}

// source from react code
const isUnitlessNumber = {
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

const singleElement = {
  br: true,
  hr: true,
  img: true,
  input: true,
  param: true,
  meta: true,
  link: true,
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
  if (
    isMounted.current &&
    !isHydrate.current &&
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
 * @param {HTMLElement} dom
 * @param {{[k: string]: any}} props
 * @returns
 */
function domPropsHydrate(fiber, dom, props) {
  Object.keys(props)
    .filter(isProperty)
    .forEach((key) => {
      if (key === "className" && dom[key] !== props[key]) {
        console.warn(
          "hydrate error, dom class not match form the template",
          logFiber(fiber)
        );
        dom[key] = props[key];
      }
      if (key === "value") {
        dom[key] !== props[key];
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
      Object.keys(props[styleKey]).forEach((styleName) => {
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
 * @returns
 */
function createBrowserDom(fiber) {
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

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function createServerDom(fiber) {
  const dom = fiber.__isTextNode__
    ? new TextElement(fiber.__vdom__)
    : new Element(fiber.__vdom__.type);

  fiber.dom = dom;

  updateDom(
    dom,
    empty,
    fiber.__isTextNode__ ? empty : fiber.__vdom__.props,
    fiber
  );

  return dom;
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns
 */
function createDom(fiber) {
  if (isServerRender.current) {
    return createServerDom(fiber);
  } else if (isHydrate.current) {
    return null;
  } else {
    return createBrowserDom(fiber);
  }
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
 * @param {MyReactVDom} element
 * @returns
 */
function renderToString(element) {
  isServerRender.current = true;

  const container = new Element("");

  const rootElement = element;

  rootContainer.current = container;

  const _rootFiber = createFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  _rootFiber.__root__ = true;

  rootFiber.current = _rootFiber;

  startRender(_rootFiber);

  isServerRender.current = false;

  return _rootFiber.dom.toString();
}

/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */
function hydrate(element, container) {
  isHydrate.current = true;

  rootContainer.current = container;

  const rootElement = element;

  const _rootFiber = createFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  _rootFiber.__root__ = true;

  rootFiber.current = _rootFiber;

  container.setAttribute("hydrate", "MyReact");

  container.__vdom__ = rootElement;

  container.__fiber__ = _rootFiber;

  startRender(_rootFiber);

  isHydrate.current = false;
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

export {
  updateDom,
  createDom,
  createBrowserDom,
  hydrateDom,
  render,
  renderToString,
  hydrate,
  findDOMNode,
};
