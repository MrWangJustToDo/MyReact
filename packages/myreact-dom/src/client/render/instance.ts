import { createRender } from "@my-react/react-reconciler";

import { fallback } from "@my-react-dom-client";
import { asyncUpdateTimeStep, shouldPauseAsyncUpdate } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { ClientDomPlatform } from "@my-react-dom-client";

const { CustomRenderController, CustomRenderDispatch } = createRender({
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

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const result = super.reconcileCommit(_fiber, _hydrate);

    // always check if there are any hydrate error, maybe could improve hydrate flow to avoid this
    if (_hydrate) {
      fallback(_fiber);
    }

    return result;
  }
}

export { CustomRenderController };
