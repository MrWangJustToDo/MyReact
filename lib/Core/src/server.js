import { Element } from "./domServer.js";
import { isServerRender, rootFiber, rootContainer } from "./env.js";
import { createFiberNode } from "./fiber.js";
import { startRender } from "./render.js";
import { MyReactVDom } from "./vdom.js";

/**
 *
 * @param {MyReactVDom} element
 * @returns
 */
export function renderToString(element) {
  isServerRender.current = true;

  const rootElement = element;

  const container = new Element("");

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
