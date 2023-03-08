import { Reactive, TYPEKEY } from "@my-react/react-shared";

import type { createContext, MyReactElementNode } from "../element";
import type { UnwrapRef } from "@my-react/react-reactive";

export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any>(
  props?: (p: P) => S
): {
  [TYPEKEY]: symbol;
  contextType: null;
  name: string;
  render: null;
  setup: (props: P) => S;
};
export function createReactive<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
>(props?: {
  contextType?: null | ReturnType<typeof createContext>;
  setup: (p: P, c?: C) => S;
  name?: string;
  render?: (s: UnwrapRef<S>, p: UnwrapRef<P>, c?: C) => MyReactElementNode;
}): {
  [TYPEKEY]: symbol;
  contextType: null | ReturnType<typeof createContext>;
  name: string;
  render: (s: UnwrapRef<S>, p: UnwrapRef<P>, c?: C) => MyReactElementNode;
  setup: (props: P, context?: C) => S;
};
export function createReactive<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  props?:
    | ((p: P) => S)
    | {
        contextType?: null | ReturnType<typeof createContext>;
        setup: (p: P, c?: C) => S;
        name?: string;
        render?: (s: UnwrapRef<S>, p: UnwrapRef<P>, c?: C) => MyReactElementNode;
      }
) {
  return {
    [TYPEKEY]: Reactive,
    name: typeof props === "function" ? props.name : props?.name,
    setup: typeof props === "function" ? props : props?.setup,
    render: typeof props === "function" ? null : props?.render,
    contextType: typeof props === "function" ? null : props?.contextType,
  };
}
