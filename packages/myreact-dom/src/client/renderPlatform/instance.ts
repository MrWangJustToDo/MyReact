/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-reconciler";

import { append, create, position, unmount, update } from "@my-react-dom-client";
import { asyncUpdateTimeLimit, getFiberTree, getHookTree, log, setRef, unsetRef } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactHookNode, MyReactElementNode, lazy } from "@my-react/react";
import type { RenderDispatch, RenderPlatform } from "@my-react/react-reconciler";
import type { ListTreeNode } from "@my-react/react-shared";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

const microTask = typeof queueMicrotask === "undefined" ? (task: () => void) => Promise.resolve().then(task) : queueMicrotask;

const yieldTask = typeof requestIdleCallback === "function" ? requestIdleCallback : (task: () => void) => setTimeout(task);

const set = new Set<() => void>();

let pending = false;

const macroTask = (task: () => void) => {
  set.add(task);

  flashTask();
};

const flashTask = () => {
  if (pending) return;

  pending = true;

  microTask(() => {
    const allTask = new Set(set);

    set.clear();

    allTask.forEach((f) => f());

    pending = false;
  });
};

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
    // reset yield time limit
    asyncUpdateTimeLimit.current = 8;
    microTask(_task);
  }

  macroTask(_task: () => void): void {
    macroTask(_task);
  }

  yieldTask(_task: () => void): void {
    // increase current yield time limit
    asyncUpdateTimeLimit.current += 6;
    yieldTask(_task);
  }

  getFiberTree(fiber: MyReactFiberNode): string {
    return getFiberTree(fiber);
  }

  getHookTree(treeHookNode: ListTreeNode<MyReactHookNode>, errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }): string {
    return getHookTree(treeHookNode, errorType);
  }

  resolveLazy(fiber: MyReactFiberNode): MyReactElementNode {
    const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

    const typedElementType = fiber.elementType as ReturnType<typeof lazy>;
    if (typedElementType._loaded === true) {
      const render = typedElementType.render as ReturnType<typeof lazy>["render"];

      return createElement(render, fiber.pendingProps);
    } else if (typedElementType._loading === false) {
      typedElementType._loading = true;

      Promise.resolve()
        .then(() => typedElementType.loader())
        .then((re) => {
          const render = typeof re === "object" && typeof re?.default === "function" ? re.default : re;

          typedElementType._loaded = true;

          typedElementType._loading = false;

          typedElementType.render = render as ReturnType<typeof lazy>["render"];

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

      typedElementType.render = render as ReturnType<typeof lazy>["render"];

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

  clearNode(_fiber: MyReactFiberNode): void {
    unmount(_fiber);
  }

  position(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};
    position(_fiber, parentFiberWithNode);
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

  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    this.elementMap.delete(_fiber);
  }
}
