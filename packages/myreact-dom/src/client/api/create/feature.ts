import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { validDomTag, type DomComment, type DomElement, type DomNode, validDomNesting } from "@my-react-dom-shared";

import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";

export const create = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, hydrate: boolean): boolean => {
  if (fiber.patch & PATCH_TYPE.__create__) {
    const { isSVG, parentFiberWithNode } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    let re = false;

    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber, parentFiberWithNode);

    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithNode, renderDispatch.previousNativeNode);

      if (!result) nativeCreate(fiber, isSVG);

      re = result;
    } else {
      nativeCreate(fiber, isSVG);
    }

    if (renderDispatch.isHydrateRender) {
      const element = fiber.nativeNode as DomElement | DomNode | DomComment;

      if (__DEV__ && fiber.type & NODE_TYPE.__plain__) {
        const typedDom = element as Element;

        if (!re) {
          typedDom.setAttribute("debug_hydrate", "fail");
        } else {
          typedDom.setAttribute("debug_hydrate", "success");
        }
      }
    }

    if (fiber.patch & PATCH_TYPE.__create__) fiber.patch ^= PATCH_TYPE.__create__;

    return re;
  }
  return hydrate;
};
