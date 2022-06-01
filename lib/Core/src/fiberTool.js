import {
  pendingSyncModifyFiberArray,
  pendingAsyncModifyFiberArray,
  enableAsyncUpdate,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";
import { Context } from "./symbol.js";
import { canNotUpdate } from "./tools.js";
import { asyncUpdate } from "./update.js";

/**
 *
 * @param {MyReactFiberNode} fiber
 */
export function pushFiber(fiber) {
  canNotUpdate();
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
}

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} providerObject
 * @returns {MyReactFiberNode | null}
 */
const getProviderFiber = (fiber, providerObject) => {
  if (fiber) {
    if (
      fiber.__isObjectNode__ &&
      fiber.__isContextProvider__ &&
      fiber.__vdom__.type === providerObject
    ) {
      return fiber;
    } else {
      return getProviderFiber(fiber.fiberParent, providerObject);
    }
  }
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {any} contextObject
 * @returns {MyReactFiberNode | null}
 */
export const getContextFiber = (fiber, contextObject) => {
  if (!contextObject) return null;
  if (contextObject.type !== Context) throw new Error("wrong context usage");
  return getProviderFiber(fiber, contextObject.Provider);
};
