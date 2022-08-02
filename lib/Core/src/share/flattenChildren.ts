import type { MaybeArrayChildrenNode, ArrayChildrenNode } from '../element';

export const flattenChildren = (
  children: MaybeArrayChildrenNode
): ArrayChildrenNode => {
  if (Array.isArray(children)) {
    return children.reduce<ArrayChildrenNode>(
      (p, c) => p.concat(flattenChildren(c)),
      []
    );
  }
  return [children];
};
