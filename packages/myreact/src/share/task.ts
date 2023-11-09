export const yieldTask =
  typeof scheduler !== "undefined" && typeof scheduler.postTask === "function" && typeof AbortController === "function"
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

export const microTask = typeof queueMicrotask === "undefined" ? (task: () => void) => Promise.resolve().then(task) : queueMicrotask;

const set = new Set<() => void>();

let pending = false;

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

export const macroTask = (task: () => void) => {
  set.add(task);

  flashTask();
};
