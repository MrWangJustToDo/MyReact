import { debuggerFiber, logFiber } from "./debug.js";
import { getDom } from "./domTool.js";
import { pendingPositionFiberArray, rootContainer, rootFiber } from "./env.js";
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
    try {
      debuggerFiber(fiber);
      return parentDom.insertBefore(fiber.dom, beforeDom);
    } catch (e) {
      console.error(
        "position error",
        logFiber(fiber),
        parentDom,
        fiber.dom,
        beforeDom
      );
      throw e;
    }
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
  if (fiber) {
    if (fiber.__isPortal__) return null;
    if (fiber.__isPlainNode__ || fiber.__isTextNode__) return fiber.dom;
    return getPlainNodeDom(fiber.child);
  } else {
    return null;
  }
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
 * @param {MyReactFiberNode} parentFiberWithDom
 *
 * 换一种角度思考
 */
function getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom) {
  if (!fiber) return null;
  if (fiber === parentFiberWithDom) return null;
  const beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  return getInsertBeforeDomFromSiblingAndParent(
    fiber.fiberParent,
    parentFiberWithDom
  );
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns {MyReactFiberNode}
 */
function getParentFiberWithDom(fiber) {
  if (!fiber) return rootFiber.current;
  if (fiber.dom) return fiber;
  return getParentFiberWithDom(fiber.fiberParent);
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function commitPosition(fiber) {
  const children = fiber.children;
  if (children.some((child) => child.__diffMount__)) {
    const parentFiberWithDom = getParentFiberWithDom(fiber);
    for (let i = children.length - 1; i >= 0; i--) {
      const childFiber = children[i];
      if (childFiber.__diffMount__) {
        const beforeDom = getInsertBeforeDomFromSiblingAndParent(
          childFiber,
          parentFiberWithDom
        );
        if (beforeDom) {
          insertBefore(childFiber, beforeDom, parentFiberWithDom.dom);
        } else {
          append(childFiber, parentFiberWithDom.dom);
        }
        childFiber.__diffMount__ = false;
        childFiber.__diffPrevRender__ = null;
      }
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
