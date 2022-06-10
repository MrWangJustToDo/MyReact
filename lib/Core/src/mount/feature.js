import { mountLoop } from "./loop.js";
import { getDom } from "../dom/tool.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { pendingMountFiberArray, rootContainer } from "../env.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const pushMount = (fiber) => {
  if (!fiber.__pendingMount__) {
    fiber.__pendingMount__ = true;
    pendingMountFiberArray.current.push(fiber);
  }
};

const runMount = () => {
  const allMountArray = pendingMountFiberArray.current.slice(0);
  allMountArray.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingMount__) {
      mountLoop(
        fiber,
        getDom(fiber.fiberParent, (f) => f.fiberParent) || rootContainer.current
      );
    }
  });
  pendingMountFiberArray.current = [];
};

export { pushMount, runMount };
