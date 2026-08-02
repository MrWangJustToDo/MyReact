import { cloneElement, isValidElement } from "../element";

import { mapByJudge } from "./tool";

import type { MyReactElement, MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

// TODO there are still some error for `map`/`toArray` key props
export function map(
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElementNode, index: number, children: ArrayMyReactElementNode) => MyReactElementNode,
  context?: any
) {
  if (arrayLike === null || arrayLike === undefined) return arrayLike;

  const res: ArrayMyReactElementNode = [];

  mapByJudge(
    arrayLike,
    function mapJudge() {
      return true;
    },
    function mapChild(child, index) {
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
}

export function toArray(arrayLike: MaybeArrayMyReactElementNode): ArrayMyReactElementNode {
  const res: ArrayMyReactElementNode = [];

  mapByJudge(
    arrayLike,
    function toArrayJudge(v) {
      return v !== undefined && v !== null && typeof v !== "boolean";
    },
    function toArrayChild(child, index) {
      if (isValidElement(child)) {
        res.push(cloneElement(child, { key: typeof child === "object" ? (typeof child?.key === "string" ? `${child.key}` : `.${index}`) : null }));
      } else {
        res.push(child);
      }
      return child;
    }
  );

  return res;
}

export function forEach(
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElementNode, index: number, children: ArrayMyReactElementNode) => MyReactElement,
  context?: any
) {
  if (arrayLike === null || arrayLike === undefined) return;

  mapByJudge(
    arrayLike,
    function forEachJudge() {
      return true;
    },
    function forEachChild(child, index) {
      let r = child;
      if (child === undefined || (child === null && typeof child === "boolean")) {
        r = null;
      }
      return action(isValidElement(r) ? cloneElement(r) : r, index, context);
    }
  );
}

export function count(arrayLike: MaybeArrayMyReactElementNode): number {
  if (Array.isArray(arrayLike)) return arrayLike.reduce<number>((p, c) => p + count(c), 0);

  return 1;
}

export function only(child: MyReactElementNode) {
  if (isValidElement(child)) return child;

  if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") return true;

  throw new Error("[@my-react/react] Children.only() expected to receive a single MyReact element child.");
}
