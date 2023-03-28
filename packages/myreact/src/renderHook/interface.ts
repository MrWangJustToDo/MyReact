import type { HOOK_TYPE } from "@my-react/react-shared";

export type Action = (s: any) => any | { type: string; payload: any };

export type Reducer = (state?: any, action?: Action) => any;

export interface DefaultRenderHook {
  type: HOOK_TYPE;

  value: any;

  reducer: Reducer;

  deps: any[];
}

export type RenderHook<T = Record<string, any>> = DefaultRenderHook & T;
