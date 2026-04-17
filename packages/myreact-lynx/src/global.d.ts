import type { ElementRef } from "@lynx-js/type-element-api";
import { Lynx } from "@lynx-js/types";

declare global {
  /** Build-time macros */
  const __DEV__: boolean;

  interface GlobalThis {
    __MY_REACT_LYNX_PATCH_METHOD__?: string;
  }

  /** Alias for ElementRef — keeps ops-apply.ts changes minimal. */
  type LynxElement = ElementRef;

  /**
   * Override @lynx-js/type-element-api's __SetCSSId to accept an array.
   *
   * The native PAPI accepts a single element, but the web PAPI
   * (`@lynx-js/web-mainthread-apis`) iterates with `for..of`, requiring
   * an array. Passing `[el]` works on both platforms.
   *
   * TODO(huxpro): Fix upstream — @lynx-js/type-element-api should declare
   * `__SetCSSId(node: ElementRef | ElementRef[], ...)` to match the web
   * PAPI and React's types (`FiberElement | FiberElement[]`).
   */
  function __SetCSSId(nodes: ElementRef[], cssId: number, entryName?: string): void;

}

declare module "@lynx-js/types" {
  export interface Lynx {
    SystemInfo?: Record<string, unknown>;
    getNativeApp():
      | {
          createJSObjectDestructionObserver?(callback: () => void): unknown;
          callLepusMethod(method: string, params: unknown, callback?: () => void): void;
        }
      | null
      | undefined;
  }
}
