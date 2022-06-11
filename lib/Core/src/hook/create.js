import { getHookTree } from "../debug.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { pushHookEffect } from "./feature.js";
import { MyReactHookNode } from "./instance.js";

// from react source code
const defaultReducer = (state, action) => {
  return typeof action === "function" ? action(state) : action;
};

/**
 *
 * @param {{hookIndex: number, value: any, reducer: Function, depArray: any[], hookType: string}} param
 * @param {MyReactFiberNode} fiber
 */
const createHookNode = (
  { hookIndex, value, reducer, depArray, hookType },
  fiber
) => {
  const newHookNode = new MyReactHookNode(
    hookIndex,
    value,
    reducer || defaultReducer,
    depArray,
    hookType
  );

  newHookNode.setFiber(fiber);

  fiber.addHook(newHookNode);

  fiber.checkHook(newHookNode);

  newHookNode.initialResult();

  return newHookNode;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 * @param {number} hookIndex
 * @param {any} value
 * @param {any[]} depArray
 * @param {string} hookType
 */
const getHookNode = (fiber, hookIndex, value, reducer, depArray, hookType) => {
  if (!fiber) throw new Error("can not use hook out of component");

  let currentHook = null;

  if (fiber.hookList.length > hookIndex) {
    currentHook = fiber.hookList[hookIndex];

    if (currentHook.hookType !== hookType) {
      throw new Error(getHookTree(currentHook, hookType));
    }

    currentHook.setFiber(fiber);
    currentHook.updateResult(value, reducer, depArray);
  } else if (!fiber.fiberAlternate) {
    // still have fiberAlternate props during function run
    currentHook = createHookNode(
      {
        hookIndex,
        hookType,
        depArray,
        reducer,
        value,
      },
      fiber
    );
  } else {
    const temp = { hookType: "undefined", hookIndex };
    temp.__fiber__ = fiber;
    fiber.hookFoot.hookNext = temp;
    throw new Error(getHookTree(temp, hookType));
  }

  if (currentHook.effect) {
    pushHookEffect(currentHook);
  }

  return currentHook;
};

export { getHookNode };
