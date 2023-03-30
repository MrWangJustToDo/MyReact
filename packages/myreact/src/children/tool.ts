import type { MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

export const flatten = (children: MaybeArrayMyReactElementNode): ArrayMyReactElementNode => {
  if (Array.isArray(children)) return children.reduce<ArrayMyReactElementNode>((p, c) => p.concat(flatten(c)), []);

  return [children];
};

export const mapByJudge = <T extends MaybeArrayMyReactElementNode>(
  arrayLike: T,
  judge: (t: MyReactElementNode) => boolean,
  action: (v: MyReactElementNode, index: number, array: ArrayMyReactElementNode) => MyReactElementNode
): ArrayMyReactElementNode => {
  const arrayChildren = flatten(arrayLike);

  return arrayChildren.map((v, index) => {
    if (judge(v)) {
      return action.call(null, v, index, arrayChildren);
    } else {
      return v;
    }
  });
};
