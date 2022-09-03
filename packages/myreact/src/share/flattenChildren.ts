import type { MaybeArrayElementNode, ArrayElementNode } from "../element";

export const flattenChildren = (children: MaybeArrayElementNode): ArrayElementNode => {
  if (Array.isArray(children)) {
    return children.reduce<ArrayElementNode>((p, c) => p.concat(flattenChildren(c)), []);
  }
  return [children];
};
