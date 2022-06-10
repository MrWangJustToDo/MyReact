import { safeCall } from "../debug.js";
import { cannotUpdate } from "../tool.js";
import { runUnmount } from "../unmount.js";
import { runPosition } from "../position.js";
import { runMount } from "../mount/index.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { renderLoopSync, renderLoopAsync } from "../render/index.js";
import {
  runUpdate,
  getPendingModifyFiberNext,
  getPendingModifyFiberArray
} from "./tool.js";
import {
  globalLoop,
  enableAsyncUpdate,
  pendingSyncModifyFiberArray,
  pendingAsyncModifyFiberArray
} from "../env.js";
import { runEffect, runLayoutEffect } from "../effect.js";

const updateAllAsync = () => {
  globalLoop.current = true;

  renderLoopAsync(
    getPendingModifyFiberNext,
    () => {
      runPosition();

      runMount();

      runUpdate();

      runUnmount();

      runLayoutEffect();

      runEffect();
    },
    () => {
      globalLoop.current = false;
    }
  );
};

const updateAllSync = () => {
  globalLoop.current = true;

  const allPendingUpdate = getPendingModifyFiberArray();

  if (allPendingUpdate.length) {
    safeCall(() => allPendingUpdate.forEach(renderLoopSync));

    runPosition();

    runMount();

    runUpdate();

    runUnmount();

    runLayoutEffect();

    runEffect();
  }

  globalLoop.current = false;
};

const updateEntry = () => {
  if (globalLoop.current) return;
  if (enableAsyncUpdate.current) {
    updateAllAsync();
  } else {
    updateAllSync();
  }
};

const asyncUpdate = () => Promise.resolve().then(updateEntry);

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const pendingUpdate = fiber => {
  cannotUpdate();
  if (!fiber.__needUpdate__) {
    fiber.__needUpdate__ = true;
    fiber.fiberAlternate = fiber;
    if (enableAsyncUpdate.current) {
      pendingAsyncModifyFiberArray.current.pushValue(fiber);
    } else {
      pendingSyncModifyFiberArray.current.push(fiber);
    }
  }
  asyncUpdate();
};

export { pendingUpdate };
