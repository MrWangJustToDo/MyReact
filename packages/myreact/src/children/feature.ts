import { cloneElement, isValidElement } from "../element";

import { mapByJudge } from "./tool";

import type { MaybeArrayElementNode, Element } from "../element";

export const map = (arrayLike: MaybeArrayElementNode, action: (child: Element, index: number) => Element) =>
  mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);

export const toArray = (arrayLike: MaybeArrayElementNode) =>
  map(arrayLike, (element, index) =>
    cloneElement(element, {
      key: element?.key !== undefined ? `.$${element.key}` : `.${index}`,
    })
  );

export const forEach = (
  arrayLike: MaybeArrayElementNode,
  action: (child: Element, index: number, children: MaybeArrayElementNode) => Element
) => {
  mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);
};

export const count = (arrayLike: MaybeArrayElementNode): number => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce<number>((p, c) => p + count(c), 0);
  }
  return 1;
};

export const only = (child: MaybeArrayElementNode) => {
  if (isValidElement(child)) return child;
  if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") return true;

  throw new Error("Children.only() expected to receive a single MyReact element child.");
};
