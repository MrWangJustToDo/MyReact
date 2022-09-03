import { flattenChildren } from "../share";

import type { ArrayElementNode, Element, ElementNode, MaybeArrayElementNode } from "../element";

export const mapByJudge = <T extends MaybeArrayElementNode>(
  arrayLike: T,
  judge: (t: ElementNode) => boolean,
  action: (v: Element, index: number, array: ArrayElementNode) => Element
) => {
  const arrayChildren = flattenChildren(arrayLike);

  return arrayChildren.map((v, index) => {
    if (judge(v)) {
      return action.call(null, v as Element, index, arrayChildren);
    } else {
      return v;
    }
  });
};
