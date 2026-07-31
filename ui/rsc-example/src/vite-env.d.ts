/// <reference types="vite/client" />

/** From vite.config `define` — true unless `RSC_SSR=0`. */
declare const __RSC_ENABLE_SSR__: boolean;

// Virtual modules from RSC plugin
declare module "virtual:my-react-rsc/client-registry" {
  // This module has no exports - it just registers client components
}

declare module "virtual:my-react-rsc/server-actions-init" {
  // This module has no exports - it just imports server action modules to register them
}

declare module "virtual:my-react-rsc/client-references" {
  const references: Record<string, unknown>;
  export default references;
}

interface ImportMeta {
  readonly viteRsc: {
    loadModule: <T = unknown>(environment: string, entryName?: string) => Promise<T>;
    loadBootstrapScriptContent: (entryName?: string) => string;
  };
}

interface Window {
  __MY_REACT_RSC_CONFIG__?: {
    rscEndpoint?: string;
    actionEndpoint?: string;
  };
  __MY_REACT_RSC_STREAM__?: ReadableStream<Uint8Array>;
}
