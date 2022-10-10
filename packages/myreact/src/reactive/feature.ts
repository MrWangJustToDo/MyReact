import { My_React_Reactive } from "../element";
import { currentReactiveInstance } from "../share";

import type { createContext, MyReactElementNode } from "../element";

export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any>(
  setup: (p: P) => S,
  name?: string,
  render?: (s: S, p: P) => MyReactElementNode
): {
  ["$$typeof"]: symbol;
  contextType: null;
  name;
  render;
  setup: (props: P) => S;
};
export function createReactive<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
>(props: {
  contextType: null | ReturnType<typeof createContext>;
  setup: (p: P, c?: C) => S;
  name?: string;
  render?: (s: S, p: P, c?: C) => MyReactElementNode;
}): {
  ["$$typeof"]: symbol;
  contextType: null | ReturnType<typeof createContext>;
  name;
  render;
  setup: (props: P, context?: C) => S;
};
export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  props:
    | ((p: P) => S)
    | {
        contextType: null | ReturnType<typeof createContext>;
        setup: (p: P, c?: C) => S;
        name?: string;
        render?: (s: S, p: P, c?: C) => MyReactElementNode;
      }
) {
  return {
    ["$$typeof"]: My_React_Reactive,
    name: typeof props === "function" ? props.name : props.name,
    setup: typeof props === "function" ? props : props.setup,
    render: typeof props === "function" ? null : props.render,
    contextType: typeof props === "function" ? null : props.contextType,
  };
}

// hook api like `Vue`

export const onBeforeMount = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeMountHooks.push(cb);
  }
};

export const onMounted = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.mountedHooks.push(cb);
  }
};

export const onBeforeUpdate = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeUpdateHooks.push(cb);
  }
};

export const onUpdated = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.updatedHooks.push(cb);
  }
};

export const onBeforeUnmount = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeUnmountHooks.push(cb);
  }
};

export const onUnmounted = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.unmountedHooks.push(cb);
  }
};
