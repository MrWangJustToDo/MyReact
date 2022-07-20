import { cloneElement, isValidElement } from '../vdom';

import { mapByJudgeFunction } from './tool';

import type { MaybeArrayChildrenNode } from '../vdom';

export const map = (
  arrayLike: MaybeArrayChildrenNode,
  action: (...args: any[]) => any
) => mapByJudgeFunction(arrayLike, (v) => v !== undefined, action);

export const toArray = (arrayLike: MaybeArrayChildrenNode) =>
  map(arrayLike, (vdom, index) =>
    cloneElement(vdom, {
      key: vdom.key !== undefined ? `.$${vdom.key}` : `.${index}`,
    })
  );

export const forEach = (
  arrayLike: MaybeArrayChildrenNode,
  action: (...args: any[]) => any
) => {
  mapByJudgeFunction(arrayLike, (v) => v !== undefined, action);
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
