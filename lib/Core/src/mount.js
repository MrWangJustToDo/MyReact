import { rootContainer, rootFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { getDom } from "./tools.js";
import { commitUpdate } from "./update.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function mountLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    commitUpdate(currentFiber, parentDom);
    mountLoop(currentFiber.fiberChildHead, currentFiber.dom || parentDom);
    mountLoop(currentFiber.fiberSibling, parentDom);
  }
}

function mountStart() {
  try {
    mountLoop(
      rootFiber.current,
      getDom(rootFiber.current.fiberParent, (fiber) => fiber.fiberParent) ||
        rootContainer.current
    );
  } catch (e) {
    console.log(e);
  }
}

export { mountStart };
