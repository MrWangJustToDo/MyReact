import { My_React_Reactive } from "../element";

import type { createContext} from "../element";

export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any>(
  setup: (p: P) => S
): {
  ["$$typeof"]: symbol;
  contextType: null;
  setup: (props: P) => S;
};
export function createReactive<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
>(props: {
  contextType: null | ReturnType<typeof createContext>;
  setup: (p: P, c?: C) => S;
}): {
  ["$$typeof"]: symbol;
  contextType: null | ReturnType<typeof createContext>;
  setup: (props: P, context?: C) => S;
};
export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  props:
    | ((p: P) => S)
    | {
        contextType: null | ReturnType<typeof createContext>;
        setup: (p: P, c?: C) => S;
      }
) {
  return {
    ["$$typeof"]: My_React_Reactive,
    setup: typeof props === "function" ? props : props.setup,
    contextType: typeof props === "function" ? null : props.contextType,
  };
}
