import type { MyReactFiberNode } from "@my-react/react";

type HighlightDOM = HTMLElement & {
  __pendingHighLight__: boolean;
};

export class HighLight {
  /**
   * @type HighLight
   */
  static instance: HighLight | undefined = undefined;

  /**
   *
   * @returns HighLight
   */
  static getHighLightInstance = () => {
    HighLight.instance = HighLight.instance || new HighLight();
    return HighLight.instance;
  };

  map: HTMLElement[] = [];

  container: HTMLElement | null = null;

  range = document.createRange();

  __pendingUpdate__: MyReactFiberNode[] = [];

  constructor() {
    this.container = document.createElement("div");
    this.container.setAttribute("debug_highlight", "MyReact");
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
    this.container?.append(element);
    return element;
  };

  getHighLight = () => {
    if (this.map.length > 0) {
      return this.map.shift() as HTMLElement;
    }
    return this.createHighLight();
  };

  highLight = (fiber: MyReactFiberNode) => {
    if (fiber.dom) {
      const typedDom = fiber.dom as HighlightDOM;
      if (!typedDom.__pendingHighLight__) {
        typedDom.__pendingHighLight__ = true;
        this.startHighLight(fiber);
      }
    }
  };

  startHighLight = (fiber: MyReactFiberNode) => {
    this.__pendingUpdate__.push(fiber);
    this.flashPending();
  };

  flashPending = () => {
    Promise.resolve().then(() => {
      const allFiber = this.__pendingUpdate__.slice(0);
      this.__pendingUpdate__ = [];
      const allWrapper: HTMLElement[] = [];
      allFiber.forEach((f) => {
        const wrapperDom = this.getHighLight();
        allWrapper.push(wrapperDom);
        f.__isTextNode__ ? this.range.selectNodeContents(f.dom as Text) : this.range.selectNode(f.dom as HTMLElement);
        const rect = this.range.getBoundingClientRect();
        const left = rect.left + (document.scrollingElement?.scrollLeft || 0);
        const top = rect.top + (document.scrollingElement?.scrollTop || 0);
        const width = rect.width + 4;
        const height = rect.height + 4;
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
        allFiber.forEach((f) => ((f.dom as HighlightDOM).__pendingHighLight__ = false));
      }, 100);
    });
  };
}
