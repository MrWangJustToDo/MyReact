import { Element } from "./server.js";
import { MyReactVDom } from "../vdom/index.js";
import { startRender } from "../render/index.js";
import {
  isHydrateRender,
  isServerRender,
  rootContainer,
  rootFiber,
} from "../env.js";
import { createNewFiberNode } from "../fiber/index.js";
import { MyReactComponent } from "../component/index.js";
import { findLatestDomFromComponentFiber } from "./tool.js";

/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */
const render = (element, container) => {
  Array.from(container.children).forEach((n) => n.remove());

  const rootElement = element;

  const fiber = createNewFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute("render", "MyReact");

  startRender(fiber);
};

const hydrate = (element, container) => {
  isHydrateRender.current = true;

  const rootElement = element;

  const fiber = createNewFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute("hydrate", "MyReact");

  startRender(fiber);

  isHydrateRender.current = false;
};

/**
 *
 * @param {MyReactVDom} element
 * @returns
 */
const renderToString = (element) => {
  isServerRender.current = true;

  const rootElement = element;

  const container = new Element("");

  const fiber = createNewFiberNode(
    { deepIndex: 0, dom: container },
    rootElement
  );

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  startRender(fiber);

  isServerRender.current = false;

  container.children[0]?.setAttribute?.("root", "MyReact");

  return container.toString();
};

/**
 *
 * @param {MyReactComponent} instance
 */
const findDOMNode = (instance) => {
  if (instance instanceof MyReactComponent) {
    return findLatestDomFromComponentFiber(instance.__fiber__);
  } else {
    return null;
  }
};

export { findDOMNode, render, hydrate, renderToString };
