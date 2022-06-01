import { mapByJudgeFunction } from "./children.js";
import {
  asyncUpdateTimeLimit,
  asyncUpdateTimeStep,
  isHydrateRender,
  isServerRender,
} from "./env.js";
import { MyReactFiberNode } from "./fiber.js";

export function isNormalEqual(src, target) {
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
}

export function isEqual(src, target) {
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
}

export const flattenChildren = (arrayLike) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p.concat(flattenChildren(c)), []);
  }
  return [arrayLike];
};

export const mapFiber = (arrayLike, action) => {
  return mapByJudgeFunction(
    arrayLike,
    (f) => f instanceof MyReactFiberNode,
    action
  );
};

export const updateAsyncTimeStep = () => {
  asyncUpdateTimeStep.current = new Date().getTime();
};

export const shouldYieldAsyncUpdateOrNot = () => {
  return (
    new Date().getTime() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit
  );
};

export const canNotUpdate = () => {
  if (isServerRender.current)
    throw new Error("can not update component during SSR");
  if (isHydrateRender.current)
    throw new Error("can not update component during hydrate");
};
