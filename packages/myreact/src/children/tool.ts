import type {
  MyReactElement,
  MyReactElementNode,
  ArrayMyReactElementNode,
  MaybeArrayMyReactElementNode,
} from "../element";

export const flatten = (children: MaybeArrayMyReactElementNode): ArrayMyReactElementNode => {
  if (Array.isArray(children)) {
    return children.reduce<ArrayMyReactElementNode>((p, c) => p.concat(flatten(c)), []);
  }
  return [children];
};

export const mapByJudge = <T extends MaybeArrayMyReactElementNode>(
  arrayLike: T,
  judge: (t: MyReactElementNode) => boolean,
  action: (v: MyReactElement, index: number, array: ArrayMyReactElementNode) => MyReactElement
) => {
  const arrayChildren = flatten(arrayLike);

  return arrayChildren.map((v, index) => {
    if (judge(v)) {
      return action.call(null, v as MyReactElement, index, arrayChildren);
    } else {
      return v;
    }
  });
};
