import { NODE_TYPE } from "@my-react/react-shared";

import type { HydrateDOM } from "../create/getHydrateDom";
import type { MyReactFiberNode } from "@my-react/react";
import type { DomElement, DomNode, DomScope } from "@my-react-dom-shared";

// TODO use <Scope /> to avoid unnecessary fallback !
export const fallback = (fiber: MyReactFiberNode) => {
  const renderScope = fiber.root.globalScope as DomScope;

  if (renderScope.isHydrateRender && fiber.type & NODE_TYPE.__isPlainNode__) {
    const pendingDeleteArray: Element[] = [];

    const dom = fiber.node as DomElement | DomNode;

    const children = Array.from(dom.childNodes);

    children.forEach((node) => {
      const typedNode = node as HydrateDOM;

      if (!typedNode.__hydrate__) {
        pendingDeleteArray.push(typedNode);
      } else {
        delete typedNode["__hydrate__"];
      }
    });

    pendingDeleteArray.forEach((n) => n.remove());
  }
};
