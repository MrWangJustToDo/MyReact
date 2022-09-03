import { isHydrateRender } from "@ReactDOM_shared";

import type { HydrateDOM } from "../create/getHydrateDom";
import type { MyReactFiberNode } from "@my-react/react";

export const fallback = (fiber: MyReactFiberNode) => {
  if (isHydrateRender.current && fiber.__isPlainNode__) {
    const dom = fiber.dom as Element;
    const children = Array.from(dom.childNodes);
    children.forEach((node) => {
      const typedNode = node as Partial<HydrateDOM>;
      if (typedNode.nodeType !== document.COMMENT_NODE && !typedNode.__hydrate__) {
        node.remove();
      }
      delete typedNode["__hydrate__"];
    });
  }
};
