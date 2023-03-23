import { cloneElement, isValidElement } from "../element";

import { mapByJudge } from "./tool";

import type { MyReactElement, MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

// TODO there are still some error for `map`/`toArray` key props
export const map = (
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElementNode, index: number, children: ArrayMyReactElementNode) => MyReactElementNode
) => {
  return mapByJudge(
    arrayLike,
    (v) => v !== undefined && v !== null,
    (child, index, children) => {
      const element = action(child, index, children);
      return cloneElement(element, { key: typeof element === "object" ? (typeof element.key === "string" ? `${element.key}` : `.$${index}`) : null });
    }
  );
};

export const toArray = (arrayLike: MaybeArrayMyReactElementNode) => {
  return mapByJudge(
    arrayLike,
    (v) => v !== undefined && v !== null,
    (child, index) => cloneElement(child, { key: typeof child === "object" ? (typeof child?.key === "string" ? `${child.key}` : `.$${index}`) : null })
  );
};

export const forEach = (
  arrayLike: MaybeArrayMyReactElementNode,
  action: (child: MyReactElement, index: number, children: ArrayMyReactElementNode) => MyReactElement
) => {
  mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);
};

export const count = (arrayLike: MaybeArrayMyReactElementNode): number => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce<number>((p, c) => p + count(c), 0);
  }
  return 1;
};

export const only = (child: MyReactElementNode) => {
  if (isValidElement(child)) return child;

  if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") return true;

  throw new Error("Children.only() expected to receive a single MyReact element child.");
};
