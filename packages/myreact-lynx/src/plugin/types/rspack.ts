/**
 * Minimal Rspack type definitions for MyReact Lynx plugins.
 *
 * These are intentionally minimal to avoid importing full `@rspack/core` types
 * in every plugin while staying aligned with Rspack 2 (`compiler.rspack`).
 */

/** Minimal typing for a Rspack Module. */
export interface RspackModule {
  layer?: string;
}

/** Minimal typing for a Rspack ChunkGroup origin. */
export interface RspackChunkGroupOrigin {
  module?: RspackModule;
}

/** Minimal typing for a Rspack Chunk. */
export interface RspackChunk {
  name?: string;
  files: Set<string>;
  getEntryOptions(): { layer?: string } | undefined;
}

/** Minimal typing for a Rspack ChunkGroup. */
export interface RspackChunkGroup {
  name?: string;
  chunks: RspackChunk[];
  origins: RspackChunkGroupOrigin[];
  isInitial(): boolean;
  getFiles(): string[];
}

/** Minimal typing for the Rspack Compilation object. */
export interface RspackCompilation {
  hooks: {
    processAssets: {
      tap(options: { name: string; stage: number }, callback: () => void): void;
    };
    additionalTreeRuntimeRequirements: {
      tap(name: string, callback: (chunk: RspackChunk, set: Set<string>) => void): void;
    };
  };
  chunkGroups: RspackChunkGroup[];
  getAsset(filename: string): { source: unknown; info: Record<string, unknown> } | undefined;
  updateAsset(filename: string, source: unknown, info?: Record<string, unknown>): void;
}

/** Minimal typing for the Rspack Compiler object. */
export interface RspackCompiler {
  /** Rspack 2 preferred namespace (webpack is a deprecated alias). */
  rspack: {
    Compilation: {
      PROCESS_ASSETS_STAGE_ADDITIONAL: number;
      PROCESS_ASSETS_STAGE_PRE_PROCESS: number;
      PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE: number;
    };
    RuntimeGlobals: { startup: string; require: string };
    ProvidePlugin: new (definitions: Record<string, string>) => { apply(compiler: RspackCompiler): void };
    sources: {
      RawSource: new (source: string) => unknown;
      ConcatSource: new (...sources: unknown[]) => unknown;
    };
  };
  hooks: {
    thisCompilation: {
      tap(name: string, callback: (compilation: RspackCompilation) => void): void;
    };
  };
}

/** @deprecated Use {@link RspackCompiler} */
export type WebpackCompiler = RspackCompiler;
/** @deprecated Use {@link RspackCompilation} */
export type WebpackCompilation = RspackCompilation;
/** @deprecated Use {@link RspackChunk} */
export type WebpackChunk = RspackChunk;
