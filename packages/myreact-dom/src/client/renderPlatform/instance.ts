import { CustomRenderPlatform } from "@my-react/react-reconciler";

const microTask = typeof queueMicrotask === "undefined" ? (task: () => void) => Promise.resolve().then(task) : queueMicrotask;

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

export class ClientDomPlatform extends CustomRenderPlatform {
  isServer: boolean;

  constructor(isServer: boolean) {
    super();
    this.isServer = isServer;
  }

  microTask(_task: () => void): void {
    !this.isServer && microTask(_task);
  }
  macroTask(_task: () => void): void {
    !this.isServer && macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    if (!this.isServer) {
      return yieldTask(_task);
    } else {
      return () => void 0;
    }
  }
}
