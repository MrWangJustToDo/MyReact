import { isHydrateRender } from '../../../../share';

import type { MyReactFiberNode } from '../../../../fiber';
import type { HydrateDOM } from '../create/getHydrateDom';

export const fallback = (fiber: MyReactFiberNode) => {
  if (isHydrateRender.current && fiber.__isPlainNode__) {
    const dom = fiber.dom as Element;
    const children = Array.from(dom.childNodes);
    children.forEach((node) => {
      const typedNode = node as Partial<HydrateDOM>;
      if (
        typedNode.nodeType !== document.COMMENT_NODE &&
        !typedNode.__hydrate__
      ) {
        node.remove();
      }
      delete typedNode['__hydrate__'];
    });
  }
};
