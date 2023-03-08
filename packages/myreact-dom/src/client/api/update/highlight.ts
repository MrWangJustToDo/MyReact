import { NODE_TYPE } from "@my-react/react-shared";

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
      position: fixed;
      z-index: 99999999;
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
    if (fiber.node) {
      const typedDom = fiber.node as HighlightDOM;
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
        if (f.isMounted) {
          f.type & NODE_TYPE.__isTextNode__ ? this.range.selectNodeContents(f.node as HighlightDOM) : this.range.selectNode(f.node as HighlightDOM);
          const rect = this.range.getBoundingClientRect();
          if (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          ) {
            // in the viewport
            const wrapperDom = this.getHighLight();
            allWrapper.push(wrapperDom);
            const width = rect.width + 4;
            const height = rect.height + 4;
            const positionLeft = rect.left - 2;
            const positionTop = rect.top - 2;
            wrapperDom.style.cssText = `
            position: absolute;
            width: ${width}px;
            height: ${height}px;
            left: ${positionLeft}px;
            top: ${positionTop}px;
            pointer-events: none;
            box-shadow: 1px 1px 1px red, -1px -1px 1px red;
            `;
          }
        }
      });
      setTimeout(() => {
        allWrapper.forEach((wrapperDom) => {
          wrapperDom.style.boxShadow = "none";
          this.map.push(wrapperDom);
        });
        allFiber.forEach((f) => ((f.node as HighlightDOM).__pendingHighLight__ = false));
      }, 100);
    });
  };
}
