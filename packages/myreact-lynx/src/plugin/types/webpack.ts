/**
 * Minimal webpack type definitions for MyReact Lynx plugins.
 *
 * These are intentionally minimal to avoid importing full webpack types
 * and to maintain compatibility with both Rspack and Webpack.
 */

/** Minimal typing for a webpack Chunk. */
export interface WebpackChunk {
  name?: string;
  getEntryOptions(): { layer?: string } | undefined;
}

/** Minimal typing for the webpack Compilation object. */
export interface WebpackCompilation {
  hooks: {
    processAssets: {
      tap(options: { name: string; stage: number }, callback: () => void): void;
    };
    additionalTreeRuntimeRequirements: {
      tap(name: string, callback: (chunk: WebpackChunk, set: Set<string>) => void): void;
    };
  };
  getAsset(filename: string): { source: unknown; info: Record<string, unknown> } | undefined;
  updateAsset(filename: string, source: unknown, info: Record<string, unknown>): void;
}

/** Minimal typing for the webpack Compiler object. */
export interface WebpackCompiler {
  webpack: {
    Compilation: {
      PROCESS_ASSETS_STAGE_ADDITIONAL: number;
      PROCESS_ASSETS_STAGE_PRE_PROCESS: number;
    };
    RuntimeGlobals: { startup: string; require: string };
    sources: { RawSource: new (source: string) => unknown };
  };
  hooks: {
    thisCompilation: {
      tap(name: string, callback: (compilation: WebpackCompilation) => void): void;
    };
  };
}
