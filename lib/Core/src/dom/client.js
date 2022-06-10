import { updateDom } from "./tool.js";
import { EMPTY_OBJECT } from "../share.js";
import { MyReactFiberNode } from "../fiber/index.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const createBrowserDom = (fiber) => {
  const dom = fiber.__isTextNode__
    ? document.createTextNode(fiber.__vdom__)
    : document.createElement(fiber.__vdom__.type);

  fiber.dom = dom;

  updateDom(
    dom,
    EMPTY_OBJECT,
    fiber.__isTextNode__ ? EMPTY_OBJECT : fiber.__vdom__.props,
    fiber
  );

  return dom;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
const commitClient = (fiber, parentDom) => {
  createBrowserDom(fiber);
  if (fiber.__pendingMount__) {
    parentDom.appendChild(fiber.dom);
  }
  fiber.applyRef();
};

export { commitClient, createBrowserDom };
