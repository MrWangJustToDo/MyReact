import { CustomRenderDispatch, getElementName, processHook, processPromise, processState, processSuspensePromise } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server/api";
import { initialElementMap } from "@my-react-dom-shared";

import { unmount } from "./unmount";

import type { UpdateQueue, RenderHookParams } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export class NoopLegacyRenderDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  enableAsyncLoad = true;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableNewEntry = false;

  renderTime: number | null;

  hydrateTime: number | null;

  findFiberByName(name: string) {
    const res: MyReactFiberNode[] = [];

    const loop = (fiber: MyReactFiberNode) => {
      if (getElementName(fiber).includes(name)) {
        res.push(fiber);
      }
      fiber.child && loop(fiber.child);
      fiber.sibling && loop(fiber.sibling);
    };

    loop(this.rootFiber);

    return res;
  }

  pendingRef(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    unmount(this, _pendingUnmount);
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(this, _fiber);

    return true;
  }

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const parentFiberWithSVG = this.runtimeDom.svgMap.get(_fiber);

    const isSVG = !!parentFiberWithSVG;

    update(_fiber, isSVG);
  }

  commitAppend(_fiber: MyReactFiberNode): void {
    const parentFiberWithNode = this.runtimeDom.elementMap.get(_fiber);

    append(this, _fiber, parentFiberWithNode);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(this, _fiber);
  }
}

export class NoopLatestRenderDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  enableAsyncLoad = true;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableNewEntry = true;

  renderTime: number | null;

  hydrateTime: number | null;

  findFiberByName(name: string) {
    const res: MyReactFiberNode[] = [];

    const loop = (fiber: MyReactFiberNode) => {
      if (getElementName(fiber).includes(name)) {
        res.push(fiber);
      }
      fiber.child && loop(fiber.child);
      fiber.sibling && loop(fiber.sibling);
    };

    loop(this.rootFiber);

    return res;
  }

  pendingRef(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    unmount(this, _pendingUnmount);
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(this, _fiber);

    return true;
  }

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const parentFiberWithSVG = this.runtimeDom.svgMap.get(_fiber);

    const isSVG = !!parentFiberWithSVG;

    update(_fiber, isSVG);
  }

  commitAppend(_fiber: MyReactFiberNode): void {
    const parentFiberWithNode = this.runtimeDom.elementMap.get(_fiber);

    append(this, _fiber, parentFiberWithNode);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(this, _fiber);
  }

  dispatchState(_params: UpdateQueue): void {
    return processState(this, _params);
  }

  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(this, _params);
  }

  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }) {
    throw _params.error || new Error("An error occurred during rendering.");
    return null;
  }

  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }) {
    return processPromise(this, _params.fiber, _params.promise);
  }

  dispatchSuspensePromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }) {
    return processSuspensePromise(this, _params.fiber, _params.promise);
  }
}
