import { nextWork } from "./core.js";
import {
  isMounted,
  needLoop,
  currentTransformFiberArray,
  nextTransformFiberArray,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { mountStart } from "./mount.js";
import {
  safeCall,
  shouldYieldAsyncUpdateOrNot,
  updateAsyncTimeStep,
} from "./tools.js";
import {
  getAsyncPendingModifyNextFiber,
  runEffect,
  runLayoutEffect,
} from "./update.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function transformStart(fiber) {
  if (fiber.mount) {
    currentTransformFiberArray.current.push(...nextWork(fiber));
  } else {
    console.log("update unmount");
  }
}

function transformCurrent() {
  while (currentTransformFiberArray.current.length) {
    const fiber = currentTransformFiberArray.current.shift();
    if (fiber.mount) nextTransformFiberArray.current.push(...nextWork(fiber));
  }
}

function transformNext() {
  while (nextTransformFiberArray.current.length) {
    const fiber = nextTransformFiberArray.current.shift();
    if (fiber.mount)
      currentTransformFiberArray.current.push(...nextWork(fiber));
  }
}

function transformAll() {
  transformCurrent();
  transformNext();
  if (currentTransformFiberArray.current.length) {
    transformAll();
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function renderLoopSync(fiber) {
  transformStart(fiber);
  transformAll();
}

function renderLoopAsync(cb) {
  updateAsyncTimeStep();
  loopAll(cb);
}

function loopAll(cb) {
  let shouldYield = false;
  while (!shouldYield) {
    if (currentTransformFiberArray.length || nextTransformFiberArray.current) {
      safeCall(transformAll);
    }
    shouldYield = shouldYieldAsyncUpdateOrNot();
    if (!shouldYield) {
      const nextStartUpdateFiber = getAsyncPendingModifyNextFiber();
      if (nextStartUpdateFiber) {
        safeCall(() => transformStart(nextStartUpdateFiber));
      } else {
        shouldYield = true;
      }
    }
    const hasNext =
      currentTransformFiberArray.current.length ||
      nextTransformFiberArray.current.length;

    shouldYield = shouldYield || !hasNext;
  }
  if (shouldYield) {
    cb();
    updateAsyncTimeStep();
  } else {
    loopAll(cb);
  }
}

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function startRender(fiber) {
  needLoop.current = true;

  safeCall(() => renderLoopSync(fiber));

  safeCall(() => mountStart());

  runLayoutEffect();

  runEffect();

  isMounted.current = true;

  needLoop.current = false;
}

export { startRender, renderLoopSync, renderLoopAsync };
