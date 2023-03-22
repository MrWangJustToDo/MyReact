import { createElement } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-reconciler";

import { createCloseTagWithStream, createStartTagWithStream } from "@my-react-dom-server";
import { getFiberTree, getHookTree, log } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactHookNode, MyReactElementNode, lazy } from "@my-react/react";
import type { RenderDispatch, RenderPlatform } from "@my-react/react-reconciler";
import type { HOOK_TYPE } from "@my-react/react-shared";
import type { LogProps } from "@my-react-dom-server";

export type SimpleReadable = {
  push(chunk: string | null): void;
  destroy(err: any): void;
};

export class ServerStreamPlatform implements RenderPlatform {
  name: "@my-react/react-dom";

  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  stream: SimpleReadable;

  lastIsStringNode: boolean;

  refType = NODE_TYPE.__initial__;

  createType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  updateType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  appendType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__;

  hasNodeType = NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__;

  constructor(stream: SimpleReadable) {
    this.stream = stream;
    this.lastIsStringNode = false;
  }

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

      typedElementType.render = render as ReturnType<typeof lazy>["render"];

      typedElementType._loaded = true;

      return createElement(typedElementType.render, fiber.pendingProps);
    });
  }

  create(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return true;
  }

  update(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    void 0;
  }

  append(_fiber: MyReactFiberNode): void {
    void 0;
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

  // stream api
  createStartTagWithStream(_fiber: MyReactFiberNode) {
    const { isSVG } = this.elementMap.get(_fiber) || {};

    createStartTagWithStream(_fiber, isSVG);
  }

  createCloseTagWithStream(_fiber: MyReactFiberNode) {
    createCloseTagWithStream(_fiber);
  }
}
