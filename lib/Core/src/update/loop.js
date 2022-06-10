import { EMPTY_OBJECT } from "../share.js";
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
        ? EMPTY_OBJECT
        : currentFiber.__preRenderVdom__?.props || EMPTY_OBJECT,
      currentFiber.__isTextNode__ ? EMPTY_OBJECT : currentFiber.__vdom__.props,
      currentFiber
    );
    debugWithDom(currentFiber);
    currentFiber.applyVDom();
  }
  currentFiber.effect = null;
  currentFiber.__pendingUpdate__ = false;
};

export { commitUpdate };
