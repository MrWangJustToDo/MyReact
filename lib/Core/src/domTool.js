import { MyReactFiberNode } from "./fiber.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {(f: MyReactFiberNode) => MyReactFiberNode} transfer
 * @returns
 */
const getDom = (fiber, transfer = (fiber) => fiber.parent) => {
  if (fiber) {
    if (fiber.dom) {
      return fiber.dom;
    } else {
      return getDom(transfer(fiber), transfer);
    }
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const findLatestDomFromFiber = (fiber) => {
  let currentLoopFiberArray = [fiber];
  while (currentLoopFiberArray.length) {
    const _fiber = currentLoopFiberArray.shift();
    if (_fiber.dom) return _fiber.dom;
    currentLoopFiberArray.push(..._fiber.children);
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const findLatestDomFromComponentFiber = (fiber) => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    for (let i = 0; i < fiber.children.length; i++) {
      const dom = findLatestDomFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }
};

// in progress
const getNativeEventName = (eventName) => {
  let isCapture = false;
  if (eventName.endsWith("Capture")) {
    isCapture = true;
    eventName = eventName.split("Capture")[0];
  }
  if (eventName === "DoubleClick") {
    eventName = "dblclick";
  } else {
    eventName = eventName.toLowerCase();
  }
  return {
    isCapture,
    eventName,
  };
};

export { getDom, findLatestDomFromComponentFiber, getNativeEventName };
