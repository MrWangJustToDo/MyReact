import { createRender } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react";
import type { ServerDomPlatform } from "@my-react-dom-server/renderPlatform";

const { CustomRenderDispatch, CustomRenderController } = createRender({
  patchToFiberInitial(_fiber) {
    let isSVG = _fiber.elementType === "svg";

    let parentFiberWithNode = null;

    const renderPlatform = _fiber.root.renderPlatform as ServerDomPlatform;
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
    const renderPlatform = _fiber.root.renderPlatform as ServerDomPlatform;

    renderPlatform.elementMap.delete(_fiber);
  },
});

export class ServerDomDispatch extends CustomRenderDispatch {
  triggerUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }

  triggerError(_fiber: MyReactFiberNode, _error: Error): void {
    throw _error;
  }

  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    void 0;
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }
}

export { CustomRenderController };
