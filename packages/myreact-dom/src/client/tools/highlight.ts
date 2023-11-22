import { STATE_TYPE, include } from "@my-react/react-shared";

import { enableHighlight } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = <T extends Function>(callback: T): T => {
  let id = null;
  return ((...args) => {
    clearTimeout(id);
    id = setTimeout(() => {
      callback.call(null, ...args);
    }, 40);
  }) as unknown as T;
};

/**
 * @internal
 */
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

  mask: HTMLCanvasElement | null = null;

  range = document.createRange();

  running = false;

  __pendingUpdate__: Set<MyReactFiberNode> = new Set();

  __pendingAppend__: Set<MyReactFiberNode> = new Set();

  __pendingSetRef__: Set<MyReactFiberNode> = new Set();

  width = 0;

  height = 0;

  constructor() {
    this.mask = document.createElement("canvas");
    this.mask.setAttribute("data-highlight", "@my-react");
    this.mask.style.cssText = `
      position: fixed;
      z-index: 99999999;
      left: 0;
      top: 0;
      pointer-events: none;
      `;
    document.documentElement.prepend(this.mask);
    this.setSize();
    window.addEventListener("resize", this.setSize);
  }

  setSize = debounce(() => {
    this.width = window.innerWidth || document.documentElement.clientWidth;

    this.height = window.innerHeight || document.documentElement.clientHeight;

    this.mask.width = this.width;

    this.mask.height = this.height;
  });

  highLight = (fiber: MyReactFiberNode, type: "update" | "append" | "setRef") => {
    if (fiber.nativeNode) {
      switch (type) {
        case "update":
          this.__pendingUpdate__.add(fiber);
          break;
        case "append":
          this.__pendingAppend__.add(fiber);
          break;
        case "setRef":
          this.__pendingSetRef__.add(fiber);
          break;
      }
    }

    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.flashPending);
    }
  };

  flashPending = () => {
    const context = this.mask.getContext("2d");

    const allPendingUpdate = new Set(this.__pendingUpdate__);

    this.__pendingUpdate__.clear();

    context.strokeStyle = "rgb(200,0,0)";

    allPendingUpdate.forEach((fiber) => {
      if (include(fiber.state, STATE_TYPE.__unmount__)) return;
      const node = fiber.nativeNode as HTMLElement;
      if (node.nodeType === Node.TEXT_NODE) {
        this.range.selectNodeContents(node);
      } else {
        this.range.selectNode(node);
      }
      const rect = this.range.getBoundingClientRect();
      if (
        (rect.width || rect.height) &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        // do the highlight paint
        const left = rect.left - 0.5;
        const top = rect.top - 0.5;
        const width = rect.width + 1;
        const height = rect.height + 1;
        context.strokeRect(
          left < 0 ? 0 : left,
          top < 0 ? 0 : top,
          width > window.innerWidth ? window.innerWidth : width,
          height > window.innerHeight ? window.innerHeight : height
        );
      }
    });

    const allPendingAppend = new Set(this.__pendingAppend__);

    this.__pendingAppend__.clear();

    allPendingAppend.forEach((fiber) => {
      if (include(fiber.state, STATE_TYPE.__unmount__)) return;
      const node = fiber.nativeNode as HTMLElement;
      if (node.nodeType === Node.TEXT_NODE) {
        this.range.selectNodeContents(node);
      } else {
        this.range.selectNode(node);
      }
      const rect = this.range.getBoundingClientRect();
      if (
        (rect.width || rect.height) &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        // do the highlight paint
        const left = rect.left - 0.5;
        const top = rect.top - 0.5;
        const width = rect.width + 1;
        const height = rect.height + 1;
        context.strokeRect(
          left < 0 ? 0 : left,
          top < 0 ? 0 : top,
          width > window.innerWidth ? window.innerWidth : width,
          height > window.innerHeight ? window.innerHeight : height
        );
      }
    });

    const allPendingSetRef = new Set(this.__pendingSetRef__);

    this.__pendingSetRef__.clear();

    allPendingSetRef.forEach((fiber) => {
      if (include(fiber.state, STATE_TYPE.__unmount__)) return;
      const node = fiber.nativeNode as HTMLElement;
      if (node.nodeType === Node.TEXT_NODE) {
        this.range.selectNodeContents(node);
      } else {
        this.range.selectNode(node);
      }
      const rect = this.range.getBoundingClientRect();
      if (
        (rect.width || rect.height) &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        // do the highlight paint
        const left = rect.left - 0.5;
        const top = rect.top - 0.5;
        const width = rect.width + 1;
        const height = rect.height + 1;
        context.strokeRect(
          left < 0 ? 0 : left,
          top < 0 ? 0 : top,
          width > window.innerWidth ? window.innerWidth : width,
          height > window.innerHeight ? window.innerHeight : height
        );
      }
    });

    setTimeout(() => {
      context.clearRect(0, 0, this.width, this.height);
      this.running = false;
      if (this.__pendingUpdate__.size || this.__pendingAppend__.size || this.__pendingSetRef__.size) {
        this.running = true;
        this.flashPending();
      }
    }, 100);
  };
}

export const highlightUpdateFiber = function (this: ClientDomDispatch, fiber: MyReactFiberNode) {
  if (this.isAppMounted && !this.isHydrateRender && !this.isServerRender && (enableHighlight.current || window.__highlight__)) {
    HighLight.getHighLightInstance().highLight(fiber, "update");
  }
};
