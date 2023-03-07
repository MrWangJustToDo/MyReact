import { createRender } from "@my-react/react-reconciler";

import { asyncUpdateTimeStep, shouldPauseAsyncUpdate } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { ClientDomPlatform } from "@my-react-dom-client/renderPlatform";

export const { CustomRenderController, CustomRenderDispatch } = createRender({
  patchToFiberInitial(_fiber) {
    let isSVG = _fiber.elementType === "svg";

    let parentFiberWithNode = null;

    const renderPlatform = _fiber.root.renderPlatform as ClientDomPlatform;
    if (!isSVG) {
      isSVG = renderPlatform.elementMap.get(_fiber.parent)?.isSVG || false;
    }

    if (_fiber.parent) {
      if (_fiber.parent === _fiber.root) {
        parentFiberWithNode = _fiber.parent;
      } else if (_fiber.parent.type & renderPlatform.hasNodeType) {
        parentFiberWithNode = _fiber.parent;
      } else {
        parentFiberWithNode = renderPlatform.elementMap.get(_fiber.parent).parentFiberWithNode;
      }
    }

    renderPlatform.elementMap.set(_fiber, { isSVG, parentFiberWithNode });
  },
  patchToFiberUnmount(_fiber) {
    const renderPlatform = _fiber.root.renderPlatform as ClientDomPlatform;

    renderPlatform.elementMap.delete(_fiber);
  },
  shouldYield() {
    return shouldPauseAsyncUpdate();
  },
});

export class ClientDomDispatch extends CustomRenderDispatch {
  triggerUpdate(_fiber: MyReactFiberNode): void {
    asyncUpdateTimeStep.current = Date.now();

    super.triggerUpdate(_fiber);
  }
}
