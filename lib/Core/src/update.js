import { debuggerFiber, safeCall } from "./debug.js";
import { updateDom } from "./dom.js";
import { createBrowserDom } from "./domClient.js";
import { checkDomHydrate, getHydrateDom, hydrateDom } from "./domHydrate.js";
import { getDom } from "./domTool.js";
import { runEffect, runLayoutEffect } from "./effect.js";
import {
  empty,
  needLoop,
  rootContainer,
  enableAsyncUpdate,
  pendingUpdateFiberArray,
  pendingSyncModifyFiberArray,
  pendingAsyncModifyFiberArray,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { runPosition } from "./position.js";
import { renderLoopAsync, renderLoopSync } from "./render.js";
import { runUnmount } from "./unmount.js";

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function hydrateUpdate(currentFiber, parentDom) {
  if (currentFiber.__isPlainNode__ || currentFiber.__isTextNode__) {
    const dom = getHydrateDom(parentDom);
    const isHydrateMatch = checkDomHydrate(currentFiber, dom);
    if (isHydrateMatch) {
      currentFiber.dom = hydrateDom(currentFiber, dom);
    } else {
      currentFiber.dom = createBrowserDom(currentFiber);
      if (dom) {
        parentDom.replaceChild(currentFiber.dom, dom);
      } else {
        parentDom.append(currentFiber.dom);
      }
    }
    currentFiber._processRef();
    currentFiber.dom.__hydrate__ = true;
    debuggerFiber(currentFiber);
  }
  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}

/**
 *
 * @param {MyReactFiberNode} currentFiber
 * @param {HTMLElement} parentDom
 */
function commitUpdate(currentFiber, parentDom) {
  if (currentFiber.dom) {
    // 新增
    if (currentFiber.effect === "PLACEMENT") {
      parentDom.appendChild(currentFiber.dom);
      // 更新
    } else if (currentFiber.effect === "UPDATE") {
      updateDom(
        currentFiber.dom,
        currentFiber.__isTextNode__
          ? empty
          : currentFiber.fiberAlternate.__vdom__.props,
        currentFiber.__isTextNode__ ? empty : currentFiber.__vdom__.props,
        currentFiber
      );
    }
    debuggerFiber(currentFiber);
  }
  currentFiber.fiberAlternate = null;
  currentFiber.effect = null;
}

function updateEntry() {
  enableAsyncUpdate.current ? updateAllAsync() : updateAllSync();
}

function getSyncPendingModifyFiberArray() {
  const pendingUpdate = pendingSyncModifyFiberArray.current
    .slice(0)
    .filter((f) => f.__needUpdate__ && f.mount);

  pendingUpdate.sort((f1, f2) => (f1.deepIndex - f2.deepIndex > 0 ? 1 : -1));

  pendingSyncModifyFiberArray.current = [];

  return pendingUpdate;
}

function updateAllSync() {
  needLoop.current = true;

  const pendingUpdate = getSyncPendingModifyFiberArray();

  safeCall(() => pendingUpdate.forEach(renderLoopSync));

  runPosition();

  runUpdate();

  runUnmount();

  runLayoutEffect();

  runEffect();

  needLoop.current = false;
}

function getAsyncPendingModifyNextFiber() {
  while (pendingAsyncModifyFiberArray.current.length) {
    const nextFiber = pendingAsyncModifyFiberArray.current.popTop();
    if (nextFiber.mount && nextFiber.__needUpdate__) {
      return nextFiber;
    }
  }
  return null;
}

function updateAllAsync() {
  needLoop.current = true;
  renderLoopAsync(getAsyncPendingModifyNextFiber, () => {
    runPosition();

    runUpdate();

    runUnmount();

    runLayoutEffect();

    runEffect();

    needLoop.current = false;
  });
}

function updateStart() {
  if (!needLoop.current) {
    updateEntry();
  }
}

const asyncUpdate = () => Promise.resolve().then(updateStart);

/**
 *
 * @param {MyReactFiberNode} fiber
 */
function pushUpdate(fiber) {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    pendingUpdateFiberArray.current.push(fiber);
  }
}

function runUpdate() {
  const allUpdateArray = pendingUpdateFiberArray.current.slice(0);
  allUpdateArray.forEach((fiber) => {
    fiber.__pendingUpdate__ = false;
    if (fiber.mount) {
      commitUpdate(
        fiber,
        getDom(fiber.fiberParent, (fiber) => fiber.fiberParent) ||
          rootContainer.current
      );
    }
  });
  pendingUpdateFiberArray.current = [];
}

export { commitUpdate, hydrateUpdate, asyncUpdate, pushUpdate, runUpdate };
