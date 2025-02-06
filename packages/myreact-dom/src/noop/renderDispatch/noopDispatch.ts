import { CustomRenderDispatch, getElementName, NODE_TYPE } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server/api";
import { initialElementMap } from "@my-react-dom-shared";

import { noopDispatchFiber } from "./dispatch";
import { noopProcessFiber } from "./process";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

export class NoopLegacyRenderDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  runtimeRef = runtimeRef;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableAsyncHydrate = false;

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

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    void 0;
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
    noopDispatchFiber(_fiber, this);
  }

  processFiber(_fiber: MyReactFiberNode): Promise<void> {
    return noopProcessFiber(_fiber);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);
  }
}

export class NoopLatestRenderDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  runtimeRef = runtimeRef;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableAsyncHydrate = true;

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

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    void 0;
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
    noopDispatchFiber(_fiber, this);
  }

  processFiber(_fiber: MyReactFiberNode): Promise<void> {
    return noopProcessFiber(_fiber);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);
  }
}
