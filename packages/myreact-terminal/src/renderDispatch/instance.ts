import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, clear, create, position, update } from "../api";
import { patchToFiberInitial, patchToFiberUnmount } from "../shared";

import type { ContainerElement } from "../api/native";
import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

// TODO
export class TerminalDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = true;

  runtimeRef = runtimeRef;

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(_fiber, this);
    return true;
  }
  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    update(_fiber);
  }
  commitAppend(_fiber: MyReactFiberNode): void {
    append(_fiber, this);
  }
  commitPosition(_fiber: MyReactFiberNode): void {
    position(_fiber, this);
  }
  commitSetRef(_fiber: MyReactFiberNode): void {
    // throw new Error("terminal platform not support ref");
  }
  commitClearNode(_fiber: MyReactFiberNode): void {
    clear(_fiber, this);
  }
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    // throw new Error("terminal platform not support lazy component");
    return null;
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber, this);
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    patchToFiberUnmount(_fiber, this);
  }

  afterCommit = () => {
    const rootNode = this.rootNode as ContainerElement;

    if (typeof rootNode.onComputeLayout === "function") {
      rootNode.onComputeLayout();
    }

    // Since renders are throttled at the instance level and <Static> component children
    // are rendered only once and then get deleted, we need an escape hatch to
    // trigger an immediate render to ensure <Static> children are written to output before they get erased
    if (rootNode.isStaticDirty) {
      rootNode.isStaticDirty = false;
      if (typeof rootNode.onImmediateRender === "function") {
        rootNode.onImmediateRender();
      }

      return;
    }

    if (typeof rootNode.onRender === "function") {
      rootNode.onRender();
    }
  };

  afterUpdate = this.afterCommit;
}
