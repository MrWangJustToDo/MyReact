import { getDom } from "./domTool.js";
import { isHydrateRender, rootContainer, rootFiber } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { commitUpdate, hydrateUpdate } from "./update.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function mountLoop(currentFiber, parentDom) {
  if (currentFiber && currentFiber.mount) {
    if (isHydrateRender.current) {
      hydrateUpdate(currentFiber, parentDom);
    } else {
      commitUpdate(currentFiber, parentDom);
    }
    currentFiber.children.forEach((f) => {
      mountLoop(f, currentFiber.dom || parentDom);
    });
    // no need use this logic
    // mountLoop(currentFiber.fiberChildHead, currentFiber.dom || parentDom);
    // mountLoop(currentFiber.fiberSibling, parentDom);
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
