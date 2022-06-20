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
import { pendingUpdate } from "../update/index.js";
import { unmountFiberNode } from "../unmount.js";

/**
 *
 * @param {MyReactVDom} element
 * @param {HTMLElement} container
 */
const render = (element, container) => {
  const containerFiber = container.__fiber__;

  if (containerFiber) {
    // need update, just like React
    if (containerFiber.__vdom__.type === element.type) {
      containerFiber.__vdom__ = element;
      pendingUpdate(containerFiber);
    }
  } else {
    Array.from(container.children).forEach((n) => n.remove?.());

    const rootElement = element;

    const fiber = createNewFiberNode(
      { deepIndex: 0, dom: container },
      rootElement
    );

    fiber.__root__ = true;

    rootFiber.current = fiber;

    rootContainer.current = container;

    container.setAttribute?.("render", "MyReact");

    container.__fiber__ = fiber;

    startRender(fiber);
  }
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

  container.setAttribute?.("hydrate", "MyReact");

  container.__fiber__ = fiber;

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

const unmountComponentAtNode = (container) => {
  const containerFiber = container.__fiber__;
  if (containerFiber?.mount) {
    unmountFiberNode(containerFiber);
  }
};

export { findDOMNode, render, hydrate, renderToString, unmountComponentAtNode };
