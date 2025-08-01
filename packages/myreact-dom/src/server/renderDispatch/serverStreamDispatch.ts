import { CustomRenderDispatch, getFiberTree, listenerMap, processHook, processPromise, safeCallWithCurrentFiber } from "@my-react/react-reconciler";

import { createCloseTagWithStream, createStartTagWithStream } from "@my-react-dom-server/api";
import { initialElementMap } from "@my-react-dom-shared";

import { generateBootstrap, generateModuleBootstrap } from "./generateBootstrap";
import { unmount } from "./unmount";

import type { MyReactElementNode, RenderHookParams, UpdateQueue } from "@my-react/react";
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

/**
 * @internal
 */
export class LegacyServerStreamDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode | null>(),
  };

  enableUpdate = false;

  stream: SimpleReadable;

  _lastIsStringNode: boolean;

  _hasSetDoctype: boolean;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableNewEntry = false;

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
    unmount(this, _pendingUnmount);
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  reconcileCommit(_fiber: MyReactFiberNode): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;

    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateStartTagWithStream() {
          createStartTagWithStream(instance, _fiber);
        },
      });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateCloseTagWithStream() {
          createCloseTagWithStream(instance, _fiber);
        },
      });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommitListener() {
        listenerMap.get(instance)?.beforeCommitMount?.forEach((l) => l());
      },
    });

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => this.stream.push(null))
      .then(() => {
        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallAfterCommitListener() {
            listenerMap.get(instance)?.afterCommitMount?.forEach((l) => l());
          },
        });

        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallAfterCommit() {
            instance.afterCommit?.();
          },
        });
      });
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(this, _fiber);
  }

  dispatchState(_params: UpdateQueue): void {
    return void 0;
  }

  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(this, _params);
  }

  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    // throw promise;
    throw new Error("Server side does not support render promise");
  }

  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    throw _params.error;
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

  stream: SimpleReadable;

  _lastIsStringNode: boolean;

  _hasSetDoctype: boolean;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  enableNewEntry = true;

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

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    unmount(this, _pendingUnmount);
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  reconcileCommit(_fiber: MyReactFiberNode): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;

    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateStartTagWithStream() {
          createStartTagWithStream(instance, _fiber);
        },
      });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithCurrentFiber({
        fiber: _fiber,
        action: function safeCallCreateCloseTagWithStream() {
          createCloseTagWithStream(instance, _fiber);
        },
      });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommitListener() {
        listenerMap.get(instance)?.beforeCommitMount?.forEach((l) => l());
      },
    });

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
        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallAfterCommitListener() {
            listenerMap.get(instance)?.afterCommitMount?.forEach((l) => l());
          },
        });

        safeCallWithCurrentFiber({
          fiber: _fiber,
          action: function safeCallAfterCommit() {
            instance.afterCommit?.();
          },
        });
      });
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(this, _fiber);
  }

  dispatchState(_params: UpdateQueue): void {
    return void 0;
  }

  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(this, _params);
  }

  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    return processPromise(this, _params.fiber, _params.promise);
  }

  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    if (this.onError) {
      this.onShellError?.(_params.error);

      const tree = getFiberTree(_params.fiber);

      this.onError(_params.error, { componentStack: tree, digest: _params.error?.message });

      return null;
    } else {
      throw _params.error;
    }
  }
}
