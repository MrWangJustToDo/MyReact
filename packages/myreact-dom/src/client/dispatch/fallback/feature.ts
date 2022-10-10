import { NODE_TYPE } from "@my-react/react-shared";

import type { HydrateDOM } from "../create/getHydrateDom";
import type { DomFiberNode, DomScope } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const fallback = (fiber: MyReactFiberNode) => {
  const renderScope = fiber.root.root_scope as DomScope;

  if (renderScope.isHydrateRender && fiber.type & NODE_TYPE.__isPlainNode__) {
    const { element: dom } = fiber.node as DomFiberNode;

    const children = Array.from(dom.childNodes);

    children.forEach((node) => {
      const typedNode = node as Partial<HydrateDOM>;

      if (typedNode.nodeType !== document.COMMENT_NODE && !typedNode.__hydrate__) node.remove();

      delete typedNode["__hydrate__"];
    });
  }
};
