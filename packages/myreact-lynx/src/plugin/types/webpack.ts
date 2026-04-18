/**
 * Minimal webpack type definitions for MyReact Lynx plugins.
 *
 * These are intentionally minimal to avoid importing full webpack types
 * and to maintain compatibility with both Rspack and Webpack.
 */

/** Minimal typing for a webpack Module. */
export interface WebpackModule {
  layer?: string;
}

/** Minimal typing for a webpack ChunkGroup origin. */
export interface WebpackChunkGroupOrigin {
  module?: WebpackModule;
}

/** Minimal typing for a webpack Chunk. */
export interface WebpackChunk {
  name?: string;
  files: Set<string>;
  getEntryOptions(): { layer?: string } | undefined;
}

/** Minimal typing for a webpack ChunkGroup. */
export interface WebpackChunkGroup {
  name?: string;
  chunks: WebpackChunk[];
  origins: WebpackChunkGroupOrigin[];
  isInitial(): boolean;
  getFiles(): string[];
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
  chunkGroups: WebpackChunkGroup[];
  getAsset(filename: string): { source: unknown; info: Record<string, unknown> } | undefined;
  updateAsset(filename: string, source: unknown, info?: Record<string, unknown>): void;
}

/** Minimal typing for the webpack Compiler object. */
export interface WebpackCompiler {
  webpack: {
    Compilation: {
      PROCESS_ASSETS_STAGE_ADDITIONAL: number;
      PROCESS_ASSETS_STAGE_PRE_PROCESS: number;
      PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE: number;
    };
    RuntimeGlobals: { startup: string; require: string };
    sources: {
      RawSource: new (source: string) => unknown;
      ConcatSource: new (...sources: unknown[]) => unknown;
    };
  };
  hooks: {
    thisCompilation: {
      tap(name: string, callback: (compilation: WebpackCompilation) => void): void;
    };
  };
}
