import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import { enableAllCheck } from "@my-react-dom-shared";

import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";
import { validDomNesting } from "./validDomNesting";

import type { HydrateDOM } from "./getHydrateDom";
import type { MyReactFiberNode } from "@my-react/react";
import type { DomComment, DomElement, DomNode } from "@my-react-dom-shared";

export const create = (fiber: MyReactFiberNode, hydrate: boolean, parentFiberWithDom: MyReactFiberNode, isSVG: boolean): boolean => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    let re = false;

    validDomNesting(fiber);

    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithDom);

      if (!result) nativeCreate(fiber, isSVG);

      re = result;
    } else {
      nativeCreate(fiber, isSVG);
    }

    const renderScope = fiber.root.renderScope;

    if (renderScope.isHydrateRender) {
      const element = fiber.node as DomElement | DomNode | DomComment;

      const typedDom = element as HydrateDOM;

      typedDom.__hydrate__ = true;

      if (enableAllCheck.current && fiber.type & NODE_TYPE.__isPlainNode__) {
        if (!re) {
          typedDom.setAttribute("debug_hydrate", "fail");
        } else {
          typedDom.setAttribute("debug_hydrate", "success");
        }
      }
    }

    if (fiber.patch & PATCH_TYPE.__pendingCreate__) fiber.patch ^= PATCH_TYPE.__pendingCreate__;

    return re;
  }
  return hydrate;
};
