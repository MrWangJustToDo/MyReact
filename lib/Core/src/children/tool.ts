import { flattenChildren } from '../share';

import type {
  Children,
  ChildrenNode,
  ArrayChildrenNode,
  MaybeArrayChildrenNode,
} from '../element';

export const mapByJudge = <T extends MaybeArrayChildrenNode>(
  arrayLike: T,
  judge: (t: ChildrenNode) => boolean,
  action: (v: Children, index: number, array: ArrayChildrenNode) => Children
) => {
  const arrayChildren = flattenChildren(arrayLike);

  return arrayChildren.map((v, index) => {
    if (judge(v)) {
      return action.call(null, v as Children, index, arrayChildren);
    } else {
      return v;
    }
  });
};
