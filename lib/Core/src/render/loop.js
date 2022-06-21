import { MyReactFiberNode } from "../fiber/index.js";
import { nextWork, nextWorkAsync } from "../core/index.js";
import { currentTransformFiberArray, nextTransformFiberArray } from "../env.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const transformStart = (fiber) => {
  currentTransformFiberArray.current.push(...nextWork(fiber));
};

const transformCurrent = () => {
  while (currentTransformFiberArray.current.length) {
    const fiber = currentTransformFiberArray.current.shift();
    nextTransformFiberArray.current.push(...nextWork(fiber));
  }
};

const transformNext = () => {
  while (nextTransformFiberArray.current.length) {
    const fiber = nextTransformFiberArray.current.shift();
    currentTransformFiberArray.current.push(...nextWork(fiber));
  }
};

const transformAll = () => {
  transformCurrent();
  transformNext();
  if (currentTransformFiberArray.current.length) {
    transformAll();
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const renderLoopSync = (fiber) => {
  transformStart(fiber);
  transformAll();
};

/**
 *
 * @param {{get: () => MyReactFiberNode, set: (nextFiber) => void}} pendingNext
 * @param {() => boolean} shouldYield
 * @param {(fiber: MyReactFiberNode) => void} pendingNext
 * @param {() => void} cb
 * @param {() => void} final
 */
const renderLoopAsync = (pendingNext, shouldYield, cb, final) => {
  let count = 0;
  let fiber = pendingNext.get();
  while (fiber && !shouldYield()) {
    count++;
    fiber = nextWorkAsync(fiber);
    pendingNext.set(fiber);
  }
  if (count) {
    cb();
  }
  final();
};

export { renderLoopSync, renderLoopAsync };
