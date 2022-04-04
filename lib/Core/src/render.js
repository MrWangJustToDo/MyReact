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
import { runEffect, runLayoutEffect } from "./update.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function transformStart(fiber) {
  if (fiber.mount) {
    currentTransformFiberArray.current.push(...nextWork(fiber));
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

export { startRender, renderLoopSync };
