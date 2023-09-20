import type { MyReactInternalInstance } from "../internal";
import type { HOOK_TYPE } from "@my-react/react-shared";

/**
 * @public
 */
export type Action = (s: any) => any | { type: string; payload: any };

/**
 * @public
 */
export type Reducer = (state?: any, action?: Action) => any;

/**
 * @public
 */
export interface DefaultRenderHook extends MyReactInternalInstance {
  type: HOOK_TYPE;

  value: any;

  reducer: Reducer;

  deps: any[];
}

/**
 * @public
 */
export type RenderHookParams = Pick<DefaultRenderHook, "type" | "deps" | "value" | "reducer">;

/**
 * @public
 */
export type RenderHook<T = Record<string, any>> = DefaultRenderHook & T;
