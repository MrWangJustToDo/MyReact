import { nextWork } from "../core/index.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { currentTransformFiberArray, nextTransformFiberArray } from "../env.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const transformStart = fiber => {
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
const renderLoopSync = fiber => {
  transformStart(fiber);
  transformAll();
};

/**
 *
 * @param {() => MyReactFiberNode} getNextFiber
 * @param {() => void} cb
 * @param {() => void} final
 */
const renderLoopAsync = (getNextFiber, cb, final) => {
  let count = 0;
  let fiber = null;
  while ((fiber = getNextFiber())) {
    count++;
    renderLoopSync(fiber);
  }
  if (count) {
    cb();
  }
  final();
};

export { renderLoopSync, renderLoopAsync };
