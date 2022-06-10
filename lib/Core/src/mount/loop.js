import { MyReactFiberNode } from "../fiber/index.js";
import { isHydrateRender, isServerRender } from "../env.js";
import { debugWithDom, safeCallWithFiber } from "../debug.js";
import { commitClient, commitHydrate, commitServer } from "../dom/index.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
const commitMount = (currentFiber, parentDom) => {
  if (currentFiber.__isTextNode__ || currentFiber.__isPlainNode__) {
    if (isServerRender.current) {
      commitServer(currentFiber, parentDom);
    } else if (isHydrateRender.current) {
      commitHydrate(currentFiber, parentDom);
    } else {
      commitClient(currentFiber, parentDom);
    }
    debugWithDom(currentFiber);
  }
  currentFiber.effect = null;
  currentFiber.__pendingMount__ = false;
};

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
const mountLoop = (currentFiber, parentDom) => {
  if (currentFiber && currentFiber.mount) {
    safeCallWithFiber({
      action: () => commitMount(currentFiber, parentDom),
      fiber: currentFiber,
    });
  }

  currentFiber.children.forEach((f) =>
    mountLoop(f, currentFiber.dom || parentDom)
  );
};

export { mountLoop };
