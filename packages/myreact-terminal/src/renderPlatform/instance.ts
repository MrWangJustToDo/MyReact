import { CustomRenderPlatform, getFiberTree, getHookTree } from "@my-react/react-reconciler";

import type { MyReactFiberNode, MyReactHookNode} from "@my-react/react-reconciler";
import type { ListTreeNode } from "@my-react/react-shared";


const microTask = typeof queueMicrotask === "undefined" ? (task: () => void) => Promise.resolve().then(task) : queueMicrotask;

// TODO
const yieldTask =
  typeof scheduler !== "undefined"
    ? (task: () => void) => scheduler.postTask(task, { priority: "background" })
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

export class TerminalPlatform extends CustomRenderPlatform {
  microTask(_task: () => void): void {
    microTask(_task);
  }
  macroTask(_task: () => void): void {
    macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    return yieldTask(_task);
  }
  getFiberTree(fiber: MyReactFiberNode): string {
    return getFiberTree(fiber);
  }
  getHookTree(treeHookNode: ListTreeNode<MyReactHookNode>, errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }): string {
    return getHookTree(treeHookNode, errorType);
  }
}

export const MyReactTerminalPlatform = new TerminalPlatform();
