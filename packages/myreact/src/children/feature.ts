import { cloneElement, isValidElement } from "../element";

import { mapByJudge } from "./tool";

import type { MyReactElement, MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

export const map = (arrayLike: MaybeArrayMyReactElementNode, action: (child: MyReactElement, index: number) => MyReactElement) =>
  mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);

export const toArray = (arrayLike: MaybeArrayMyReactElementNode) => {
  return map(arrayLike, (element, index) =>
    cloneElement(element, {
      key: typeof element?.key === "string" ? `.$${element.key}` : `.${index}`,
    })
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
