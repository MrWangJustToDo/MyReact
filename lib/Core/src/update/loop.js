import { debugWithDom } from "../debug.js";
import { updateDom } from "../dom/index.js";
import { MyReactFiberNode } from "../fiber/index.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 */
const commitUpdate = (currentFiber) => {
  if (currentFiber.dom && currentFiber.__pendingUpdate__) {
    updateDom(
      currentFiber.dom,
      currentFiber.__isTextNode__
        ? {}
        : currentFiber.fiberAlternate.__vdom__.props,
      currentFiber.__isTextNode__ ? {} : currentFiber.__vdom__.props,
      currentFiber
    );
    debugWithDom(currentFiber);
  }
  currentFiber.effect = null;
  currentFiber.fiberAlternate = null;
  currentFiber.__pendingUpdate__ = false;
};

export { commitUpdate };
