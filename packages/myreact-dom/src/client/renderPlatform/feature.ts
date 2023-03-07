import { createElement, __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import { append, create, position, unmount, update } from "@my-react-dom-client";
import { log, setRef, unsetRef } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactHookNode, MyReactElementNode, lazy, MyReactClassComponent, MyReactFunctionComponent } from "@my-react/react";
import type { RenderDispatch, RenderPlatform } from "@my-react/react-reconciler";
import type { HOOK_TYPE } from "@my-react/react-shared";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

const { getFiberTree, getHookTree } = __my_react_shared__;

export class ClientDomPlatform implements RenderPlatform {
  name: "@my-react/react-dom";

  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  refType = NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__;

  createType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  updateType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  appendType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  hasNodeType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  setRef(_fiber: MyReactFiberNode): void {
    setRef(_fiber);
  }

  unsetRef(_fiber: MyReactFiberNode): void {
    unsetRef(_fiber);
  }

  log(props: LogProps): void {
    log(props);
  }

  microTask(_task: () => void): void {
    Promise.resolve().then(_task);
  }

  macroTask(_task: () => void): void {
    requestAnimationFrame(_task);
  }

  getFiberTree(fiber: MyReactFiberNode): string {
    return getFiberTree(fiber);
  }

  getHookTree(hook: MyReactHookNode[], currentIndex: number, newHookType: HOOK_TYPE): string {
    return getHookTree(hook, currentIndex, newHookType);
  }

  resolveLazy(fiber: MyReactFiberNode): MyReactElementNode {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    if (typedElementType._loaded === true) {
      const render = typedElementType.render as MyReactClassComponent | MyReactFunctionComponent;

      return createElement(render, fiber.pendingProps);
    } else if (typedElementType._loading === false) {
      typedElementType._loading = true;

      Promise.resolve()
        .then(() => typedElementType.loader())
        .then((re) => {
          const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;
          typedElementType._loaded = true;

          typedElementType._loading = false;

          typedElementType.render = render as MyReactClassComponent | MyReactFunctionComponent;

          fiber._update();
        });
    }

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
    const { isSVG, parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    return create(_fiber, !!_hydrate, parentFiberWithNode, isSVG);
  }

  update(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const { isSVG } = this.elementMap.get(_fiber) || {};
    update(_fiber, !!_hydrate, isSVG);
  }

  append(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};
    append(_fiber, parentFiberWithNode);
  }

  unmount(_fiber: MyReactFiberNode): void {
    unmount(_fiber);
  }

  position(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};
    position(_fiber, parentFiberWithNode);
  }
}
