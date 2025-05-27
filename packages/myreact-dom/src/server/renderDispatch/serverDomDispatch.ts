import { CustomRenderDispatch, processHook } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server/api";
import { initialElementMap } from "@my-react-dom-shared";

import { serverDispatchFiber } from "./dispatch";
import { serverProcessFiber } from "./process";
import { unmount } from "./unmount";

import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react/dist/types";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export class ServerDomDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableAsyncHydrate = false;

  renderTime: number | null;

  hydrateTime: number | null;

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
    unmount(_pendingUnmount, this);
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(_fiber, this);

    return true;
  }

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const parentFiberWithSVG = this.runtimeDom.svgMap.get(_fiber);

    const isSVG = !!parentFiberWithSVG;

    update(_fiber, isSVG);
  }

  commitAppend(_fiber: MyReactFiberNode): void {
    const parentFiberWithNode = this.runtimeDom.elementMap.get(_fiber);

    append(_fiber, parentFiberWithNode, this);
  }

  dispatchFiber(_fiber: MyReactFiberNode): void {
    serverDispatchFiber(_fiber, this);
  }

  // will never be called
  processFiber(_fiber: MyReactFiberNode): Promise<void> {
    return serverProcessFiber(_fiber);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);
  }

  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(_params);
  }

  dispatchState(_params: UpdateQueue): void {
    return void 0;
  }

  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    throw _params.error;
  }

  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    throw new Error("Server side does not support render promise");
  }
}
