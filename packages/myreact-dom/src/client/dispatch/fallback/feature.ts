import { __my_react_internal__ } from "@my-react/react";

import { isHydrateRender } from "@ReactDOM_shared";

import type { HydrateDOM } from "../create/getHydrateDom";
import type { MyReactFiberNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const fallback = (fiber: MyReactFiberNode) => {
  if (isHydrateRender.current && fiber.type & NODE_TYPE.__isPlainNode__) {
    const dom = fiber.node as Element;

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
