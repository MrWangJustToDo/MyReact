import type { MyReactElementNode, ArrayMyReactElementNode, MaybeArrayMyReactElementNode } from "../element";

function flatten(children: MaybeArrayMyReactElementNode): ArrayMyReactElementNode {
  if (Array.isArray(children)) return children.reduce<ArrayMyReactElementNode>((p, c) => p.concat(flatten(c)), []);

  return [children];
}

/**
 * @internal
 */
export function mapByJudge<T extends MaybeArrayMyReactElementNode>(
  arrayLike: T,
  judge: (t: MyReactElementNode) => boolean,
  action: (v: MyReactElementNode, index: number, array: ArrayMyReactElementNode) => MyReactElementNode
): ArrayMyReactElementNode {
  const arrayChildren = flatten(arrayLike);

  return arrayChildren.map(function mapByJudgeItem(v, index) {
    if (judge(v)) {
      return action.call(null, v, index, arrayChildren);
    } else {
      return v;
    }
  });
}
