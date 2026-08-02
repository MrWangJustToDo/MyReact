import type { ElementRef } from "@lynx-js/type-element-api";
import type { SystemInfo as LynxSystemInfo } from "@lynx-js/types";
import { Lynx } from "@lynx-js/types";

declare global {
  /** Build-time macros (compile-time constants) */
  const __DEV__: boolean;

  const __HMR__: boolean;

  const __LEPUS__: boolean;

  /**
   * True when code is running on the background thread (JS side).
   * Opposite of __LEPUS__.
   * This is a compile-time constant set by the build plugin.
   * Default is `true` for the background bundle.
   */
  const __JS__: boolean;

  /**
   * True when code is running on the background thread.
   * This is a compile-time constant set by the build plugin.
   * Default is `true` for the background bundle.
   */
  const __BACKGROUND__: boolean;

  /**
   * True when code is running on the main thread.
   * This is a compile-time constant set by the build plugin.
   * Default is `false` for the background bundle.
   */
  const __MAIN_THREAD__: boolean;

  /**
   * Compile-time: `pluginMyReactLynx({ enableIFR: true })`.
   * Instant First-Frame Rendering (MT sync mount). Not first-screen patch meta.
   */
  const __MY_REACT_LYNX_IFR__: boolean;

  const __DEVTOOL__:
    | boolean
    | {
        wsUrl?: string;
      };

  /** Alias for ElementRef — keeps ops-apply.ts changes minimal. */
  type LynxElement = ElementRef;

  interface MyReactLynxEventRegistryState {
    signCounter: number;
    handlers: Map<string, (data: unknown) => void>;
  }

  /**
   * Runtime globals we assign (use `var` so they exist on `typeof globalThis`,
   * matching Lynx’s `declare var SystemInfo` / `lynxWorkletImpl` style).
   * Do not redeclare host globals (`lynxWorkletImpl`, `SystemInfo`).
   */
  var __BACKGROUND_RUNTIME__: boolean;
  var __MAIN_THREAD_RUNTIME__: boolean;
  var __MY_REACT_LYNX_PATCH_METHOD__: string | undefined;
  var __MY_REACT_LYNX_IFR_DROP_MT_OPS__: boolean | undefined;
  var __MY_REACT_LYNX_RUN_IFR_RENDER__: (() => boolean) | undefined;
  var __MY_REACT_LYNX_AUTO_PIXEL_UNIT__: boolean | undefined;
  var __MY_REACT_LYNX_DEVTOOLS_CONFIG__:
    | {
        wsUrl: string;
        rendererPackageName: string;
      }
    | undefined;
  var __MY_REACT_LYNX_INJECT_DEVTOOLS__: (() => boolean) | undefined;
  var __MY_REACT_DEVTOOL_NODE__: unknown;
  var __MY_REACT_DEVTOOL_BUNDLE__: unknown;
  var __MY_REACT_DEVTOOL_BUNDLE_WS__: unknown;
  var __REACT_LYNX_EVENT_REGISTRY__: MyReactLynxEventRegistryState | undefined;
  var __MYREACT_LYNX_SCOPE_REGISTRY__: Record<string, string> | undefined;

  var processData: ((data: unknown, processorName?: string) => unknown) | undefined;
  var renderPage: ((data: unknown) => void) | undefined;
  var updatePage: ((data: unknown) => void) | undefined;
  var updateGlobalProps: ((data: unknown) => void) | undefined;
  var reactPatchUpdate: ((payload: { data: string }) => void) | undefined;
  var updateMTRefInitValue: ((payload: { data: string }) => void) | undefined;
  var processEvalResult: (<T>(result: T | undefined, schema: string) => T | undefined) | undefined;
  var publishEvent: ((sign: string, data: unknown) => void) | undefined;
  var runOnBackground: ((...args: unknown[]) => unknown) | undefined;

  var $RefreshReg$: ((type: unknown, id: string) => void) | undefined;
  var $RefreshSig$: (() => (type: unknown) => unknown) | undefined;
  var $RefreshRuntime$:
    | {
        register: (type: unknown, id: string) => void;
        createSignatureFunctionForTransform: () => (type: unknown) => unknown;
      }
    | undefined;
  var $RefreshHelpers$: unknown;

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

  /** Bind a React Lynx gesture detector to an element. */
  function __SetGestureDetector(
    dom: LynxElement,
    id: number,
    type: number,
    config: {
      callbacks: { name: string; callback: unknown }[];
      config?: Record<string, unknown>;
    },
    relationMap: {
      waitFor: number[];
      simultaneous: number[];
      continueWith: number[];
    }
  ): void;

  /** Remove a gesture detector from an element. */
  function __RemoveGestureDetector(dom: LynxElement, id: number): void;
}

declare module "@lynx-js/types" {
  export interface Lynx {
    SystemInfo?: LynxSystemInfo;

    /** InitData passed from native side, used by useInitData */
    __initData: Record<string, unknown>;

    /** Global props, used by useGlobalProps */
    __globalProps: Record<string, unknown>;

    getNativeApp():
      | {
          createJSObjectDestructionObserver?(callback: () => void): unknown;
          callLepusMethod(method: string, params: unknown, callback?: () => void): void;
        }
      | null
      | undefined;

    /** Get a JS module by name (e.g., 'GlobalEventEmitter') */
    getJSModule(name: "GlobalEventEmitter"): {
      addListener(eventName: string, listener: (...args: unknown[]) => void): void;
      removeListener(eventName: string, listener: (...args: unknown[]) => void): void;
      trigger(eventName: string, params: unknown): void;
    };
    getJSModule(name: string): Record<string, (...args: unknown[]) => unknown>;

    /**
     * Register data processors. Must be called before root.render().
     * @see DataProcessorDefinition
     */
    registerDataProcessors(definition?: {
      defaultDataProcessor?: (rawInitData: Record<string, unknown>) => Record<string, unknown>;
      dataProcessors?: Record<string, (...args: unknown[]) => unknown>;
    }): void;

    /** Query a single element by selector */
    querySelector?(selector: string): unknown | null;

    /** Query all elements matching a selector */
    querySelectorAll?(selector: string): unknown[];

    /** Query a dynamic component bundle (async callback API) */
    QueryComponent?(source: string, callback: (result: { code: number; detail: { schema: string } }) => void): void;

    /** Get the native Lynx object */
    getNativeLynx?(): {
      QueryComponent?(source: string, callback: (result: { code: number; detail: { schema: string } }) => void): void;
    } | null;

    /** Load a lazy bundle (set by our loadLazyBundle implementation) */
    loadLazyBundle?<T extends { default: React.ComponentType<unknown> }>(source: string): Promise<T>;

    /** Asynchronously require a module (Lynx native API) */
    requireModuleAsync?<T>(url: string, callback: (err: Error | null, data: T | null) => void): void;
  }
}
