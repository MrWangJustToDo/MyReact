import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import {
  validDomTag,
  type DomComment,
  type DomElement,
  type DomNode,
  getValidParentFiberWithNode,
  getValidParentFiberWithSVG,
  updatedAncestorInfoDev,
  validateTextNesting,
  validateDOMNesting,
} from "@my-react-dom-shared";

import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch, MyReactFiberNodeClientDev } from "@my-react-dom-client/renderDispatch";

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

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeClientDev;

      const typedParentFiber = parentFiberWithNode as MyReactFiberNodeClientDev;

      typedFiber._debugTreeScope = updatedAncestorInfoDev(
        fiber.type & NODE_TYPE.__text__ ? "#text" : fiber.elementType.toString(),
        typedFiber,
        typedParentFiber?._debugTreeScope
      );

      if (include(fiber.type, NODE_TYPE.__text__) && typedParentFiber) {
        validateTextNesting(typedFiber, fiber.elementType.toString(), typedParentFiber.elementType.toString());
      }
      if (include(fiber.type, NODE_TYPE.__plain__) && typedParentFiber) {
        validateDOMNesting(typedFiber, fiber.elementType.toString(), typedParentFiber._debugTreeScope);
      }
    }

    try {
      if (hydrate) {
        const previousDom = renderDispatch._previousNativeNode;
  
        const result = hydrateCreate(fiber, parentFiberWithNode || renderDispatch, previousDom);
  
        re = result;
      } else {
        nativeCreate(fiber, isSVG, parentFiberWithNode || renderDispatch);
      }
    } catch {
      nativeCreate(fiber, isSVG, parentFiberWithNode || renderDispatch);
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
