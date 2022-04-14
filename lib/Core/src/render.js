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

let lastAsyncUpdateTime = null;

function renderLoopAsync(cb) {
  lastAsyncUpdateTime = new Date().getTime();
  loopAll(cb);
}

function loopAll(cb) {
  let hasNext = true;
  while (hasNext) {
    if (currentTransformFiberArray.length || nextTransformFiberArray.current) {
      transformAll();
    }
    hasNext = new Date().getTime() - lastAsyncUpdateTime <= 20;
    if (hasNext) {
      const nextStartUpdateFiber = getAsyncPendingModifyNextFiber();
      if (nextStartUpdateFiber) {
        transformStart(nextStartUpdateFiber);
      } else {
        hasNext = false;
      }
    }
    hasNext =
      hasNext &&
      (currentTransformFiberArray.current.length ||
        nextTransformFiberArray.current.length);
  }
  if (hasNext) {
    loopAll(cb);
  } else {
    cb();
    lastAsyncUpdateTime = new Date().getTime();
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
