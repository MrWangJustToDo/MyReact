import { pendingPositionFiberArray, rootContainer } from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { getDom } from "./tools.js";

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
    if (!fiber.__isPortal__) parentDom.insertBefore(fiber.dom, beforeDom);
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
    if (!fiber.__isPortal__) parentDom.append(fiber.dom);
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
 * @param {MyReactFiberNode} sibling
 */
function insertBeforeSibling(fiber, sibling) {
  let siblingChild = sibling;
  while (siblingChild && !siblingChild.dom) {
    siblingChild = siblingChild.child;
  }
  if (siblingChild && siblingChild.dom) {
    if (siblingChild.__isPortal__) {
      if (sibling.fiberSibling) {
        insertBeforeSibling(fiber, sibling.fiberSibling);
      } else {
        // last one
        appendToParent(fiber, fiber.fiberParent);
      }
    } else {
      insertBefore(
        fiber,
        siblingChild.dom,
        getDom(fiber.fiberParent, (f) => f.fiberParent) || rootContainer.current
      );
    }
  } else {
    throw new Error("意料之外的错误");
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parentFiber
 */
function appendToFragment(fiber, parentFiber) {
  let nextFiber = parentFiber.fiberSibling;
  if (nextFiber) {
    insertBeforeSibling(fiber, nextFiber);
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
    append(fiber, rootContainer.current);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} parent
 */
function appendToParent(fiber, parent) {
  if (parent) {
    if (parent.__isFragmentNode__) {
      appendToFragment(fiber, parent);
    } else {
      append(
        fiber,
        getDom(parent, (fiber) => fiber.fiberParent) || rootContainer.current
      );
    }
  } else {
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
      if (fiber.fiberSibling) {
        insertBeforeSibling(fiber, fiber.fiberSibling);
      } else {
        appendToParent(fiber, fiber.fiberParent);
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
  fiber.__diffPrevRender__ = previousRenderChild;
  pushPosition(fiber.fiberParent);
}

export { processUpdatePosition, runPosition };
