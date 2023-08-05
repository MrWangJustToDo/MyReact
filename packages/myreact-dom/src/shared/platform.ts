import { CustomRenderPlatform, getFiberTree, getHookTree, triggerError } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

import type { LogProps, RenderFiber } from "@my-react/react";
import type { MyReactFiberNode, MyReactHookNode } from "@my-react/react-reconciler";
import type { ListTreeNode } from "@my-react/react-shared";

const microTask = typeof queueMicrotask === "undefined" ? (task: () => void) => Promise.resolve().then(task) : queueMicrotask;

// TODO
const yieldTask =
  typeof scheduler !== "undefined" && typeof AbortController !== "undefined"
    ? (task: () => void) => {
        const { signal, abort } = new AbortController();
        scheduler.postTask(task, { priority: "background", signal });
        return () => {
          try {
            abort("");
          } catch {
            void 0;
          }
        };
      }
    : typeof requestIdleCallback === "function"
    ? (task: () => void) => {
        const id = requestIdleCallback(task);
        return () => cancelIdleCallback(id);
      }
    : (task: () => void) => {
        const id = setTimeout(task);
        return () => clearTimeout(id);
      };

const set = new Set<() => void>();

let pending = false;

const macroTask = (task: () => void) => {
  set.add(task);

  flashTask();
};

const flashTask = () => {
  if (pending) return;

  pending = true;

  setTimeout(() => {
    const allTask = new Set(set);

    set.clear();

    allTask.forEach((f) => f());

    pending = false;
  });
};

const isServer = typeof window === "undefined";

// TODO server/client side platform
class DomPlatform extends CustomRenderPlatform {
  log(props: LogProps): void {
    log(props);
  }
  microTask(_task: () => void): void {
    !isServer && microTask(_task);
  }
  macroTask(_task: () => void): void {
    !isServer && macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    if (!isServer) {
      return yieldTask(_task);
    } else {
      return void 0;
    }
  }
  getFiberTree(fiber: MyReactFiberNode): string {
    return getFiberTree(fiber);
  }
  getHookTree(treeHookNode: ListTreeNode<MyReactHookNode>, errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }): string {
    return getHookTree(treeHookNode, errorType);
  }
  dispatchError(_params: { fiber?: RenderFiber; error?: Error }): void {
    if (isServer) {
      throw _params.error;
    } else {
      triggerError(_params.fiber as MyReactFiberNode, _params.error, () => {
        // 更新结束后触发error事件
        this.yieldTask(() => {
          window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
        });
      });
    }
  }
}

/**
 * @internal
 */
export const MyReactDomPlatform = new DomPlatform();
