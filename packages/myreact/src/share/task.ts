export const yieldTask =
  typeof scheduler !== "undefined" && typeof scheduler.postTask === "function" && typeof AbortController === "function"
    ? function schedulerYieldTask(task: () => void) {
        const { signal, abort } = new AbortController();
        scheduler.postTask(task, { priority: "background", signal });
        return function cancelYieldTask() {
          try {
            abort("");
          } catch {
            void 0;
          }
        };
      }
    : typeof requestIdleCallback === "function"
      ? function schedulerYieldTask(task: () => void) {
          const id = requestIdleCallback(task);
          return function cancelYieldTask() {
            cancelIdleCallback(id);
          };
        }
      : function schedulerYieldTask(task: () => void) {
          const id = setTimeout(task);
          return function cancelYieldTask() {
            clearTimeout(id);
          };
        };

export const microTask =
  typeof queueMicrotask === "undefined"
    ? function schedulerMicroTask(task: () => void) {
        return Promise.resolve().then(task);
      }
    : queueMicrotask;

const set = new Set<() => void>();

let pending = false;

function flushMacroTask() {
  if (pending) return;

  pending = true;

  function invokeMacroTask() {
    const allTask = new Set(set);

    set.clear();

    allTask.forEach((f) => f());

    pending = false;

    if (set.size) {
      flushMacroTask();
    }
  }

  if (typeof setImmediate === "function") {
    setImmediate(invokeMacroTask);
  } else if (typeof MessageChannel === "function") {
    const { port1, port2 } = new MessageChannel();

    port1.onmessage = invokeMacroTask;

    port2.postMessage("");
    return;
  } else {
    setTimeout(invokeMacroTask);
  }
}

export const macroTask = (task: () => void) => {
  set.add(task);

  flushMacroTask();
};
