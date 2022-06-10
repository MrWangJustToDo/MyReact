import {
  asyncUpdateTimeLimit,
  asyncUpdateTimeStep,
  isHydrateRender,
  isServerRender,
} from "./env.js";
import { mapByJudgeFunction } from "./children.js";
import { MyReactFiberNode } from "./fiber/index.js";

/**
 *
 * @param {Function} action
 * @returns
 */
const once = (action) => {
  let run = false;
  return (...args) => {
    if (run) return;
    run = true;
    action.call(null, ...args);
  };
};

const flattenChildren = (arrayLike) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p.concat(flattenChildren(c)), []);
  }
  return [arrayLike];
};

const mapFiber = (arrayLike, action) => {
  return mapByJudgeFunction(
    arrayLike,
    (f) => f instanceof MyReactFiberNode,
    action
  );
};

const isEqual = (src, target) => {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;
    for (const key in src) {
      if (key !== "children" && !key.startsWith("__")) {
        flag = flag && isEqual(src[key], target[key]);
      }
    }
    return flag;
  }
  return Object.is(src, target);
};

const isNormalEqual = (src, target) => {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;
    for (const key in src) {
      if (!key.startsWith("__")) {
        flag = flag && Object.is(src[key], target[key]);
        if (!flag) {
          return flag;
        }
      }
    }
    return flag;
  }
  return Object.is(src, target);
};

const updateAsyncTimeStep = () => {
  asyncUpdateTimeStep.current = new Date().getTime();
};

const shouldYieldAsyncUpdate = () => {
  if (!asyncUpdateTimeStep.current) {
    updateAsyncTimeStep();
    return false;
  } else {
    const result =
      new Date().getTime() - asyncUpdateTimeStep.current >
      asyncUpdateTimeLimit.current;
    if (result) asyncUpdateTimeStep.current = null;
    return result;
  }
};

const cannotUpdate = () => {
  if (isServerRender.current)
    throw new Error("can not update component during SSR");
  if (isHydrateRender.current)
    throw new Error("can not update component during hydrate");
};

export {
  once,
  isEqual,
  mapFiber,
  cannotUpdate,
  isNormalEqual,
  flattenChildren,
  updateAsyncTimeStep,
  shouldYieldAsyncUpdate,
};
