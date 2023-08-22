import { STATE_TYPE, include } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

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
    document.body.append(this.mask);
    this.setSize();
    window.addEventListener("resize", this.setSize);
  }

  setSize = debounce(() => {
    this.width = window.innerWidth || document.documentElement.clientWidth;

    this.height = window.innerHeight || document.documentElement.clientHeight;

    this.mask.width = this.width;

    this.mask.height = this.height;
  });

  highLight = (fiber: MyReactFiberNode) => {
    if (fiber.nativeNode) {
      this.__pendingUpdate__.add(fiber);
    }

    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.flashPending);
    }
  };

  flashPending = () => {
    const context = this.mask.getContext("2d");

    const allPending = new Set(this.__pendingUpdate__);

    this.__pendingUpdate__.clear();

    context.strokeStyle = "rgb(200,0,0)";

    allPending.forEach((fiber) => {
      if (include(fiber.state, STATE_TYPE.__unmount__)) return;
      const node = fiber.nativeNode as HTMLElement;
      if (node.nodeType === Node.TEXT_NODE) {
        this.range.selectNodeContents(node);
      } else {
        this.range.selectNode(node);
      }
      const rect = this.range.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        // do the highlight paint
        const left = rect.left - 2;
        const top = rect.top - 2;
        const width = rect.width + 4;
        const height = rect.height + 4;
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
      if (this.__pendingUpdate__.size) {
        this.running = true;
        this.flashPending();
      }
    }, 100);
  };
}
