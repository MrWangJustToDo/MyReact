import { flattenChildren } from '../share';

import type {
  ChildrenNode,
  ArrayChildrenNode,
  MaybeArrayChildrenNode,
} from '../vdom';

export const mapByJudgeFunction = <T extends MaybeArrayChildrenNode>(
  arrayLike: T,
  judge: (t: ChildrenNode) => boolean,
  action: (
    v: ChildrenNode,
    index: number,
    array: ArrayChildrenNode
  ) => ChildNode
) => {
  const arrayChildren = flattenChildren(arrayLike);

  return arrayChildren.map((v, index) => {
    if (judge(v)) {
      return action.call(null, v, index, arrayChildren);
    } else {
      return v;
    }
  });
};
