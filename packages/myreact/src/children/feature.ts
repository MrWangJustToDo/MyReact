import { cloneElement, isValidElement } from "../element";

import { mapByJudge } from "./tool";

import type { MyReactElement, MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

// TODO there are still some error for `map`/`toArray` key props
export const map = (
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElementNode, index: number, children: ArrayMyReactElementNode) => MyReactElementNode,
  context?: any
) => {
  if (arrayLike === null || arrayLike === undefined) return arrayLike;

  const res = [];

  mapByJudge(
    arrayLike,
    () => true,
    (child, index) => {
      let r = child;
      if (child === undefined || child === null || typeof child === "boolean") {
        r = null;
      }
      const element = action(r, index, context);
      if (isValidElement(element)) {
        res.push(cloneElement(element, { key: typeof element === "object" ? (typeof element?.key === "string" ? `${element.key}` : `.${index}`) : null }));
      } else {
        if (element !== undefined && element !== null) {
          res.push(element);
        }
      }
      return element;
    }
  );

  return res;
};

export const toArray = (arrayLike: MaybeArrayMyReactElementNode): ArrayMyReactElementNode => {
  const res = [];

  mapByJudge(
    arrayLike,
    (v) => v !== undefined && v !== null && typeof v !== "boolean",
    (child, index) => {
      if (isValidElement(child)) {
        res.push(cloneElement(child, { key: typeof child === "object" ? (typeof child?.key === "string" ? `${child.key}` : `.${index}`) : null }));
      } else {
        res.push(child);
      }
      return child;
    }
  );

  return res;
};

export const forEach = (
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElementNode, index: number, children: ArrayMyReactElementNode) => MyReactElement,
  context?: any
) => {
  if (arrayLike === null || arrayLike === undefined) return;

  mapByJudge(
    arrayLike,
    () => true,
    (child, index) => {
      let r = child;
      if (child === undefined || (child === null && typeof child === "boolean")) {
        r = null;
      }
      return action(isValidElement(r) ? cloneElement(r) : r, index, context);
    }
  );
};

export const count = (arrayLike: MaybeArrayMyReactElementNode): number => {
  if (Array.isArray(arrayLike)) return arrayLike.reduce<number>((p, c) => p + count(c), 0);

  return 1;
};

export const only = (child: MyReactElementNode) => {
  if (isValidElement(child)) return child;

  if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") return true;

  throw new Error("[@my-react/react] Children.only() expected to receive a single MyReact element child.");
};
