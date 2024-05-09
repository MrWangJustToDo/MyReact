import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import {
  validDomTag,
  type DomComment,
  type DomElement,
  type DomNode,
  validDomNesting,
  getValidParentFiberWithNode,
  getValidParentFiberWithSVG,
} from "@my-react-dom-shared";

import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

/**
 * @internal
 */
export const create = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, hydrate: boolean): boolean => {
  if (include(fiber.patch, PATCH_TYPE.__create__)) {
    const parentFiberWithNode = getValidParentFiberWithNode(fiber, renderDispatch);

    const parentFiberWithSVG = getValidParentFiberWithSVG(fiber, renderDispatch);

    const isSVG = !!parentFiberWithSVG;

    let re = false;

    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber, parentFiberWithNode);

    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithNode, renderDispatch._previousNativeNode);

      if (!result) nativeCreate(fiber, isSVG, parentFiberWithNode);

      re = result;
    } else {
      nativeCreate(fiber, isSVG, parentFiberWithNode);
    }

    if (renderDispatch.isHydrateRender) {
      const element = fiber.nativeNode as DomElement | DomNode | DomComment;

      if (__DEV__ && include(fiber.type, NODE_TYPE.__plain__)) {
        const typedDom = element as Element;

        if (!re) {
          typedDom.setAttribute("data-hydrate", "false");
        } else {
          typedDom.setAttribute("data-hydrate", "true");
        }
      }
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__create__);

    return re;
  }
  return hydrate;
};
