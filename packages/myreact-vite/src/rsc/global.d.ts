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

export {};
