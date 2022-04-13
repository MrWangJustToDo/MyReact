import { nextWork } from "./core.js";
import {
  isMounted,
  needLoop,
  currentTransformFiberArray,
  nextTransformFiberArray,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { mountStart } from "./mount.js";
import { safeCall } from "./tools.js";
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

let lastAsyncUpdateTime = new Date().getTime();

function renderLoopAsync(cb) {
  requestIdleCallback(loopAll(cb));
}

function loopAll(cb) {
  return (deadLine) => {
    let shouldYield = false;
    let hasNext = true;
    while (!shouldYield && hasNext) {
      if (
        (currentTransformFiberArray.length ||
          nextTransformFiberArray.current) &&
        !shouldYield
      ) {
        transformAll();
      }
      shouldYield = deadLine && deadLine.timeRemaining() < 1;
      const needContinueLoop =
        new Date().getTime() - lastAsyncUpdateTime <= 20;
      if (!shouldYield) {
        const nextStartUpdateFiber = getAsyncPendingModifyNextFiber();
        if (nextStartUpdateFiber) {
          transformStart(nextStartUpdateFiber);
        } else {
          hasNext = false;
        }
      }
      shouldYield = deadLine && deadLine.timeRemaining() < 1;
      hasNext =
        hasNext &&
        (currentTransformFiberArray.current.length ||
          nextTransformFiberArray.current.length ||
          needContinueLoop);
    }
    if (hasNext) {
      requestIdleCallback(loopAll(cb));
    } else {
      console.log("update");
      cb();
      lastAsyncUpdateTime = new Date().getTime();
    }
  };
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
