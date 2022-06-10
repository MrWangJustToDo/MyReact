import { pushPosition } from "../position.js";
import { MyReactVDom } from "../vdom/index.js";
import { MyReactFiberNode } from "./instance.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} fiberParent
 * @param {MyReactVDom} vdom
 */
const updateFiberNode = (fiber, fiberParent, vdom) => {
  fiber.fiberAlternate = fiber;

  fiber.installParent(fiberParent);

  fiber.updateFromAlternate();

  fiber.installVDom(vdom);

  fiber.checkVDom(vdom);

  return fiber;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {MyReactFiberNode} fiberParent
 * @param {MyReactVDom} vdom
 * @param {MyReactFiberNode} previousRenderFiber
 */
const updateFiberNodeWithPosition = (
  fiber,
  fiberParent,
  vdom,
  previousRenderFiber
) => {
  const newFiber = updateFiberNode(fiber, fiberParent, vdom);

  if (newFiber !== previousRenderFiber) {
    pushPosition(newFiber, previousRenderFiber);
  }

  return newFiber;
};

export { updateFiberNodeWithPosition };
