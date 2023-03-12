import { createElement } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server";
import { getFiberTree, getHookTree, log } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactHookNode, MyReactElementNode, lazy, MyReactClassComponent, MyReactFunctionComponent } from "@my-react/react";
import type { RenderDispatch, RenderPlatform } from "@my-react/react-reconciler";
import type { HOOK_TYPE } from "@my-react/react-shared";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

export class ServerDomPlatform implements RenderPlatform {
  name: "@my-react/react-dom";

  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  refType = NODE_TYPE.__initial__;

  createType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  updateType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  appendType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  hasNodeType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  setRef(_fiber: MyReactFiberNode): void {
    void 0;
  }

  unsetRef(_fiber: MyReactFiberNode): void {
    void 0;
  }

  log(props: LogProps): void {
    log(props);
  }

  microTask(_task: () => void): void {
    void 0;
  }

  macroTask(_task: () => void): void {
    void 0;
  }

  yieldTask(_task: () => void): void {
    void 0;
  }

  getFiberTree(fiber: MyReactFiberNode): string {
    return getFiberTree(fiber);
  }

  getHookTree(hook: MyReactHookNode[], currentIndex: number, newHookType: HOOK_TYPE): string {
    return getHookTree(hook, currentIndex, newHookType);
  }

  resolveLazy(fiber: MyReactFiberNode): MyReactElementNode {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    return renderDispatch.resolveSuspense(fiber);
  }

  resolveLazyAsync(fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;

    if (typedElementType._loaded) return Promise.resolve(createElement(typedElementType.render, fiber.pendingProps));

    return typedElementType.loader().then((loaded) => {
      const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

      typedElementType.render = render as MyReactClassComponent | MyReactFunctionComponent;

      typedElementType._loaded = true;

      return createElement(typedElementType.render, fiber.pendingProps);
    });
  }

  create(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(_fiber);

    return true;
  }

  update(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const { isSVG } = this.elementMap.get(_fiber) || {};

    update(_fiber, isSVG);
  }

  append(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    append(_fiber, parentFiberWithNode);
  }

  clearNode(_fiber: MyReactFiberNode): void {
    void 0;
  }

  position(_fiber: MyReactFiberNode): void {
    void 0;
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    let isSVG = _fiber.elementType === "svg";

    let parentFiberWithNode = null;

    if (!isSVG) {
      isSVG = this.elementMap.get(_fiber.parent)?.isSVG || false;
    }

    if (_fiber.parent) {
      if (_fiber.parent === _fiber.root) {
        parentFiberWithNode = _fiber.parent;
      } else if (_fiber.parent.type & this.hasNodeType) {
        parentFiberWithNode = _fiber.parent;
      } else {
        parentFiberWithNode = this.elementMap.get(_fiber.parent).parentFiberWithNode;
      }
    }

    this.elementMap.set(_fiber, { isSVG, parentFiberWithNode });
  }
}
