import { MyReactFiberNode } from "./fiber/index.js";
import { pendingPositionFiberArray, rootFiber } from "./env.js";
import { debugWithDom, getFiberTree, safeCallWithFiber } from "./debug.js";
import { createBrowserDom } from "./dom/client.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const prepareFiberDom = (fiber) => {
  fiber.dom = fiber.dom || createBrowserDom(fiber);
  fiber.applyRef();
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} beforeDom
 * @param {HTMLElement} parentDom
 */
const insertBefore = (fiber, beforeDom, parentDom) => {
  if (!fiber) throw new Error("not a valid position action");
  fiber.effect = null;
  fiber.fiberAlternate = null;
  fiber.__pendingMount__ = false;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    prepareFiberDom(fiber);
    debugWithDom(fiber);
    return parentDom.insertBefore(fiber.dom, beforeDom);
  }
  fiber.children.forEach((f) => insertBefore(f, beforeDom, parentDom));
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {HTMLElement} parentDom
 */
const append = (fiber, parentDom) => {
  if (!fiber) throw new Error("not a valid position action");
  fiber.effect = null;
  fiber.fiberAlternate = null;
  fiber.__pendingMount__ = false;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    prepareFiberDom(fiber);
    debugWithDom(fiber);
    return parentDom.append(fiber.dom);
  }
  fiber.children.forEach((f) => append(f, parentDom));
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const getPlainNodeDom = (fiber) => {
  if (fiber) {
    if (fiber.__isPortal__) return null;
    if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
      prepareFiberDom(fiber);
      return fiber.dom;
    }
    return getPlainNodeDom(fiber.child);
  } else {
    return null;
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const getInsertBeforeDomFromSibling = (fiber) => {
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
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiberWithDom
 */
const getInsertBeforeDomFromSiblingAndParent = (fiber, parentFiberWithDom) => {
  if (!fiber) return null;
  if (fiber === parentFiberWithDom) return null;
  const beforeDom = getInsertBeforeDomFromSibling(fiber);
  if (beforeDom) return beforeDom;
  return getInsertBeforeDomFromSiblingAndParent(
    fiber.fiberParent,
    parentFiberWithDom
  );
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @returns {MyReactFiberNode}
 */
const getParentFiberWithDom = (fiber) => {
  if (!fiber) return rootFiber.current;
  if (fiber.__isPortal__) return fiber;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    prepareFiberDom(fiber);
    return fiber;
  }
  return getParentFiberWithDom(fiber.fiberParent);
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const commitPosition = (fiber) => {
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
};

const runPosition = () => {
  const allPositionArray = pendingPositionFiberArray.current.slice(0);
  allPositionArray.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingPosition__) {
      fiber.__pendingPosition__ = false;
      safeCallWithFiber({ action: () => commitPosition(fiber), fiber });
    } else {
      console.error("position error");
    }
  });
  pendingPositionFiberArray.current = [];
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} previousRenderChild
 */
const pushPosition = (fiber, previousRenderChild) => {
  if (!fiber.__diffMount__) {
    fiber.__diffMount__ = true;
    fiber.__diffPrevRender__ = previousRenderChild;
    const parentFiber = fiber.fiberParent;
    if (!parentFiber.__pendingPosition__) {
      parentFiber.__pendingPosition__ = true;
      pendingPositionFiberArray.current.push(parentFiber);
    }
  }
};

export { pushPosition, runPosition };
