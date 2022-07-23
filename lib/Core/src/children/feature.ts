import { cloneElement, isValidElement } from '../vdom';

import { mapByJudge } from './tool';

import type { MaybeArrayChildrenNode, Children } from '../vdom';

export const map = (
  arrayLike: MaybeArrayChildrenNode,
  action: (child: Children, index: number) => Children
) => mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);

export const toArray = (arrayLike: MaybeArrayChildrenNode) =>
  map(arrayLike, (element, index) =>
    cloneElement(element, {
      key: element?.key !== undefined ? `.$${element.key}` : `.${index}`,
    })
  );

export const forEach = (
  arrayLike: MaybeArrayChildrenNode,
  action: (
    child: Children,
    index: number,
    children: MaybeArrayChildrenNode
  ) => Children
) => {
  mapByJudge(arrayLike, (v) => v !== undefined && v !== null, action);
};

export const count = (arrayLike: MaybeArrayChildrenNode): number => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.reduce<number>((p, c) => p + count(c), 0);
  }
  return 1;
};

export const only = (child: MaybeArrayChildrenNode) => {
  if (isValidElement(child)) return child;
  if (
    typeof child === 'string' ||
    typeof child === 'number' ||
    typeof child === 'boolean'
  )
    return true;

  throw new Error(
    'Children.only expected to receive a single MyReact element child.'
  );
};
