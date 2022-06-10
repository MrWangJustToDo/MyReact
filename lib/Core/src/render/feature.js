import { safeCall } from "../debug.js";
import { renderLoopSync } from "./loop.js";
import { runMount } from "../mount/feature.js";
import { globalLoop, isMounted } from "../env.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { runEffect, runLayoutEffect } from "../effect.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const startRender = (fiber) => {
  globalLoop.current = true;

  safeCall(() => renderLoopSync(fiber));

  runMount();

  runLayoutEffect();

  runEffect();

  isMounted.current = true;

  globalLoop.current = false;
};

export { startRender };
