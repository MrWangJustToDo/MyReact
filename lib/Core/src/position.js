import { pendingPositionFiberArray, rootContainer } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { getDom, getIsPortalRender } from "./tools.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} beforeDom
 * @param {HTMLElement} parentDom
 */
function insertBefore(fiber, beforeDom, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      parentDom.insertBefore(fiber.dom, beforeDom);
    }
  } else {
    fiber.children.forEach((f) => insertBefore(f, beforeDom, parentDom));
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
function append(fiber, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      parentDom.append(fiber.dom);
    }
  } else {
    fiber.children.forEach((f) => append(f, parentDom));
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushPosition(fiber) {
  if (!fiber.__pendingPosition__) {
    fiber.__pendingPosition__ = true;
    pendingPositionFiberArray.current.push(fiber);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 */
function appendToFragment(fiber, parentFiber) {
  const nextFiber = parentFiber.fiberSibling;
  fiber.effect = null;
  if (nextFiber) {
    insertBefore(
      fiber,
      getDom(nextFiber, (fiber) => fiber.fiberChildHead),
      getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
        rootContainer.current
    );
  } else if (parentFiber.fiberParent) {
    if (parentFiber.fiberParent.__isFragmentNode__) {
      appendToFragment(fiber, parentFiber.fiberParent);
    } else {
      append(
        fiber,
        getDom(parentFiber.fiberParent, (fiber) => fiber.fiberParent) ||
          rootContainer.current
      );
    }
  } else {
    console.log("root append");
    append(fiber, rootContainer.current);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function commitPosition(fiber) {
  const children = fiber.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const fiber = children[i];
    if (fiber.__diffMount__) {
      if (fiber.__diffPrevRender__) {
        insertBefore(
          fiber,
          getDom(fiber.__diffPrevRender__, (fiber) => fiber.fiberChildHead),
          getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
            rootContainer.current
        );
      } else {
        // new create
        if (fiber.fiberSibling) {
          insertBefore(
            fiber,
            getDom(fiber.fiberSibling, (fiber) => fiber.fiberChildHead),
            getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
              rootContainer.current
          );
        } else {
          // last one
          if (fiber.fiberParent.__isFragmentNode__) {
            appendToFragment(fiber, fiber.fiberParent);
          } else {
            append(
              fiber,
              getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
                rootContainer.current
            );
          }
        }
      }
      fiber.__diffMount__ = false;
      fiber.__diffPrevRender__ = null;
    }
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function runPosition(fiber) {
  const allPositionArray = pendingPositionFiberArray.current.slice(0);
  allPositionArray.forEach((fiber) => {
    fiber.__pendingPosition__ = false;
    commitPosition(fiber);
  });
  pendingPositionFiberArray.current = [];
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} previousRenderChild
 */
function processUpdatePosition(fiber, previousRenderChild) {
  fiber.__diffMount__ = true;
  const isPortalRender = getIsPortalRender(previousRenderChild);
  fiber.__diffPrevRender__ = isPortalRender ? null : previousRenderChild;
  pushPosition(fiber.fiberParent);
}

export { processUpdatePosition, runPosition };
