import { flattenChildren } from "./tool.js";
import { cloneElement, MyReactVDom } from "./vdom/index.js";

export const mapByJudgeFunction = (arrayLike, judge, action) => {
  const arrayChildren = flattenChildren(arrayLike);

  return arrayChildren.map((v, index, thisArgs) => {
    if (judge(v)) {
      return action.call(thisArgs, v, index, arrayChildren);
    } else {
      return v;
    }
  });
};

// MyReact Children api, just like React

export const map = (arrayLike, action) => {
  return mapByJudgeFunction(arrayLike, (v) => v !== undefined, action);
};

export const toArray = (arrayLike) => {
  return map(arrayLike, (vdom, index) =>
    cloneElement(vdom, {
      key: vdom.key !== undefined ? `.$${vdom.key}` : `.${index}`,
    })
  );
};

export const forEach = (arrayLike, action) => {
  mapByJudgeFunction(arrayLike, (v) => v !== undefined, action);
};

export const count = (arrayLike) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce((p, c) => p + count(c), 0);
  }
  return 1;
};

export const only = (child) => {
  if (child instanceof MyReactVDom) {
    return child;
  }

  throw new Error(
    "Children.only expected to receive a single MyReact element child."
  );
};
