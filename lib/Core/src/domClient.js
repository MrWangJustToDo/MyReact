import { updateDom } from "./dom.js";
import { empty } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";

// ========= dev ============
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
    if (fiber.dom) {
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

export { HighLight, createBrowserDom };
