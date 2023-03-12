import { CustomRenderDispatch } from "@my-react/react-reconciler";

import { fallback } from "@my-react-dom-client";
import { asyncUpdateTimeStep } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";

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
