import { debuggerFiber } from "./debug.js";
import { getDom } from "./domTool.js";
import { pendingPositionFiberArray, rootContainer } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} beforeDom
 * @param {HTMLElement} parentDom
 */
function insertBefore(fiber, beforeDom, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    debuggerFiber(fiber);
    return parentDom.insertBefore(fiber.dom, beforeDom);
  }
  fiber.children.forEach((f) => insertBefore(f, beforeDom, parentDom));
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
function append(fiber, parentDom) {
  if (!fiber) throw new Error("意料之外的错误");
  fiber.effect = null;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    debuggerFiber(fiber);
    return parentDom.append(fiber.dom);
  }
  fiber.children.forEach((f) => append(f, parentDom));
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
 */
function getPlainNodeDom(fiber) {
  if (fiber.__isPortal__) return null;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) return fiber.dom;
  return getPlainNodeDom(fiber.child);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function getInsertBeforeDomFromSibling(fiber) {
  if (!fiber) return null;
  const sibling = fiber.fiberSibling;
  if (sibling) {
    return (
      getPlainNodeDom(sibling) ||
      getInsertBeforeDomFromSibling(sibling.fiberSibling)
    );
  } else {
    return null;
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 *
 * 换一种角度思考
 */
function getInsertBeforeDomFromSiblingAndParent(fiber) {
  if (!fiber) return null;
  const beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  return getInsertBeforeDomFromSiblingAndParent(fiber.fiberParent);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function commitPosition(fiber) {
  const children = fiber.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const childFiber = children[i];
    if (childFiber.__diffMount__) {
      if (fiber.__isPlainNode__ || fiber.__isPortal__) {
        const beforeDom = getInsertBeforeDomFromSibling(childFiber);
        if (beforeDom) {
          insertBefore(childFiber, beforeDom, fiber.dom);
        } else {
          append(childFiber, fiber.dom);
        }
      } else {
        const beforeDom = getInsertBeforeDomFromSiblingAndParent(childFiber);
        if (beforeDom) {
          insertBefore(
            childFiber,
            beforeDom,
            getDom(fiber, (f) => f.fiberParent) || rootContainer.current
          );
        } else {
          append(
            childFiber,
            getDom(fiber, (f) => f.fiberParent) || rootContainer.current
          );
        }
      }
      childFiber.__diffMount__ = false;
      childFiber.__diffPrevRender__ = null;
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
  if (!fiber.__diffMount__) {
    fiber.__diffMount__ = true;
    fiber.__diffPrevRender__ = previousRenderChild;
    pushPosition(fiber.fiberParent);
  }
}

export { processUpdatePosition, runPosition };
