import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { hydrateCreate } from "./hydrateCreate";
import { nativeCreate } from "./nativeCreate";
import { validDomNesting } from "./validDomNesting";
import { validDomTag } from "./validDomTag";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomContainer } from "@my-react-dom-client/renderContainer";
import type { DomComment, DomElement, DomNode } from "@my-react-dom-shared";

export const create = (
  fiber: MyReactFiberNode,
  hydrate: boolean,
  parentFiberWithDom: MyReactFiberNode,
  previousDom: ChildNode | null,
  isSVG: boolean
): boolean => {
  if (fiber.patch & PATCH_TYPE.__create__) {
    let re = false;

    if (__DEV__) validDomTag(fiber);

    if (__DEV__) validDomNesting(fiber);

    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithDom, previousDom);

      if (!result) nativeCreate(fiber, isSVG);

      re = result;
    } else {
      nativeCreate(fiber, isSVG);
    }

    const renderContainer = fiber.renderContainer as ClientDomContainer;

    if (renderContainer.isHydrateRender) {
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
