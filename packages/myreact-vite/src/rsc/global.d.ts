/**
 * Global type declarations for RSC Vite plugin
 */

declare global {
  const __DEV__: boolean;
  const __VERSION__: string;

  /** Dev middleware: load transformed index.html for RSC HTML responses */
  var __MY_REACT_RSC_GET_HTML_TEMPLATE__: ((url: string) => Promise<string>) | undefined;
  /** Dev middleware: SSR-load a module id (CJS-safe path) */
  var __MY_REACT_RSC_SSR_LOAD_MODULE__: ((id: string) => Promise<unknown>) | undefined;
  /** Cross-env: ModuleRunner.import for a named Vite environment */
  function __MY_REACT_ENVIRONMENT_RUNNER_IMPORT__(environmentName: string, id: string): Promise<unknown>;
  /** Cross-env: ssrLoadModule helper */
  function __MY_REACT_ENVIRONMENT_SSR_LOAD_MODULE__(id: string): Promise<unknown>;

  interface Window {
    __MY_REACT_RSC_STREAM__?: ReadableStream<Uint8Array>;
    __MY_REACT_RSC_CONFIG__?: {
      rscEndpoint: string;
      actionEndpoint: string;
    };
    __FLIGHT_DATA?: Array<string | Uint8Array> & {
      push: (chunk: string | Uint8Array) => number;
    };
  }
}

declare module "es-module-lexer" {
  export interface ExportSpecifier {
    /** Exported name */
    n: string;
    /** Local name (for re-exports) */
    ln?: string;
    /** Start position */
    s: number;
    /** End position */
    e: number;
    /** Local start (for re-exports) */
    ls?: number;
    /** Local end (for re-exports) */
    le?: number;
  }

  export interface ImportSpecifier {
    /** Module specifier */
    n?: string;
    /** Start of module specifier */
    s: number;
    /** End of module specifier */
    e: number;
    /** Start of import statement */
    ss: number;
    /** End of import statement */
    se: number;
    /** Dynamic import expression start (-1 if not dynamic) */
    d: number;
    /** Assert clause (import attributes) */
    a: number;
  }

  /**
   * Initialize the WebAssembly module
   */
  export const init: Promise<void>;

  /**
   * Parse ES module imports and exports
   * @param source - The source code to parse
   * @param name - Optional source name for error messages
   * @returns Tuple of [imports, exports]
   */
  export function parse(source: string, name?: string): [ImportSpecifier[], ExportSpecifier[]];
}

export {};
