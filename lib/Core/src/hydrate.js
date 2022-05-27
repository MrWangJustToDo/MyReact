import { debuggerFiber, logFiber } from "./debug.js";
import { createBrowserDom, hydrateDom } from "./dom.js";
import { MyReactFiberNode } from "./fiber.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} dom
 */
function checkDomHydrate(fiber, dom) {
  if (!dom) {
    console.error(
      "hydrate error, current dom not render by SSR",
      logFiber(fiber)
    );
    return false;
  }
  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      console.error(
        "hydrate error, current dom type not match vdom type",
        logFiber(fiber)
      );
      return false;
    }
    if (fiber.__vdom__.toString() !== dom.textContent) {
      console.warn(
        "hydrate waring, current hydrate text not match template text",
        logFiber(fiber)
      );
      return false;
    }
  }
  if (fiber.__isPlainNode__) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      console.error(
        "hydrate error, current dom type not a element type",
        logFiber(fiber)
      );
      return false;
    }
    if (fiber.__vdom__.type.toLowerCase() !== dom.nodeName.toLowerCase()) {
      console.error(
        "hydrate error, current dom type not match vdom type",
        logFiber(fiber)
      );
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {HTMLElement} parentDom
 */
function getHydrateDom(parentDom) {
  const children = Array.from(parentDom.childNodes);

  return children.find(
    (dom) => dom.nodeType !== document.COMMENT_NODE && !dom.__hydrate__
  );
}

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
export function hydrateUpdate(currentFiber, parentDom) {
  if (currentFiber.__isPlainNode__ || currentFiber.__isTextNode__) {
    const dom = getHydrateDom(parentDom);
    const isHydrateMatch = checkDomHydrate(currentFiber, dom);
    if (isHydrateMatch) {
      currentFiber.dom = hydrateDom(currentFiber, dom);
    } else {
      currentFiber.dom = createBrowserDom(currentFiber);
      if (dom) {
        parentDom.replaceChild(currentFiber.dom, dom);
      } else {
        parentDom.append(currentFiber.dom);
      }
    }
    currentFiber._processRef();
    currentFiber.dom.__hydrate__ = true;
    debuggerFiber(currentFiber);
  }
}
