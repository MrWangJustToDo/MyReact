import { CustomRenderDispatch, NODE_TYPE, safeCall, safeCallWithFiber } from "@my-react/react-reconciler";

import { createCloseTagWithStream, createStartTagWithStream } from "@my-react-dom-server/api";
import { initialElementMap } from "@my-react-dom-shared";

import { generateBootstrap, generateModuleBootstrap } from "./generateBootstrap";
import { resolveLazyElementLatest, resolveLazyElementLegacy } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export type SimpleReadable = {
  push(chunk: string | null): void;
  destroy(err: any): void;
};

export type BootstrapScriptDescriptor = {
  src: string;
  integrity?: string;
  crossOrigin?: string;
};

export type ErrorInfo = {
  digest?: string;
  componentStack?: string;
};

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

/**
 * @internal
 */
export class LegacyServerStreamDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  runtimeRef = runtimeRef;

  stream: SimpleReadable;

  _lastIsStringNode: boolean;

  _hasSetDoctype: boolean;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableASyncHydrate = false;

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

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    void 0;
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementLegacy(_fiber, this);
  }

  reconcileCommit(_fiber: MyReactFiberNode): void {
    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => createStartTagWithStream(_fiber, this) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => createCloseTagWithStream(_fiber, this) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    safeCall(() => this.beforeCommit?.());

    safeCall(() => this._beforeCommitListener.forEach((l) => l()));

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => this.stream.push(null))
      .then(() => {
        safeCall(() => this._afterCommitListener.forEach((l) => l()));

        safeCall(() => this.afterCommit?.());
      });
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);
  }
}

/**
 * @internal
 */
export class LatestServerStreamDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  runtimeRef = runtimeRef;

  stream: SimpleReadable;

  _lastIsStringNode: boolean;

  _hasSetDoctype: boolean;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableASyncHydrate = true;

  renderTime: number | null;

  hydrateTime: number | null;

  // dynamic inject content
  bootstrapScriptContent?: string;

  bootstrapScripts?: Array<string | BootstrapScriptDescriptor>;

  bootstrapModules?: Array<string | BootstrapScriptDescriptor>;

  onShellError?: (error: unknown) => void;

  onShellReady?: () => void;

  onAllReady?: () => void;

  onError = (error: unknown, errorInfo: ErrorInfo) => {
    console.log(error, "\n", errorInfo.componentStack);
  };

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

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementLatest(_fiber, this);
  }

  reconcileCommit(_fiber: MyReactFiberNode): void {
    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => createStartTagWithStream(_fiber, this) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => createCloseTagWithStream(_fiber, this) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    safeCall(() => this.beforeCommit?.());

    safeCall(() => this._beforeCommitListener.forEach((l) => l()));

    let generatedScript = (this.bootstrapModules || []).map(generateModuleBootstrap).join("");

    generatedScript += (this.bootstrapScripts || []).map(generateBootstrap).join("");

    this.bootstrapScriptContent && (generatedScript += `<script>${this.bootstrapScriptContent}</script>`);

    Promise.resolve()
      .then(() => this.onShellReady?.())
      .then(() => mountLoop(_fiber))
      .then(() => this.stream.push(generatedScript))
      .then(() => this.stream.push(null))
      .then(() => this.onAllReady?.())
      .then(() => {
        safeCall(() => this._afterCommitListener.forEach((l) => l()));

        safeCall(() => this.afterCommit?.());
      });
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);
  }
}
