/**
 * @file RSC Types Index
 * Shared type definitions for RSC plugin
 */

import type { RscPluginManager } from "../manager";
import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

export interface RscPluginOptions {
  /**
   * Enable RSC support
   * @default false
   */
  rsc?: boolean;

  /**
   * Include patterns for RSC file detection
   * @default /\.[tj]sx?$/
   */
  include?: string | RegExp | Array<string | RegExp>;

  /**
   * Exclude patterns from RSC processing
   * @default /node_modules/
   */
  exclude?: string | RegExp | Array<string | RegExp>;

  /**
   * Custom RSC endpoint path
   * @default "/__rsc"
   */
  rscEndpoint?: string;

  /**
   * Custom server action endpoint path
   * @default "/__rsc_action"
   */
  actionEndpoint?: string;

  /**
   * Optional SSR wiring for dev server
   */
  ssr?: {
    /** entry module that returns Flight stream */
    entryRsc: string;
    /** entry module that renders HTML from Flight stream */
    entrySsr: string;
    /** override HTML template path, defaults to /index.html */
    indexHtmlPath?: string;
  };
}

/**
 * Extended options for RSC build plugin with multi-environment support
 */
export interface RscBuildPluginOptions extends RscPluginOptions {
  /**
   * Entry points for each environment
   */
  entries?: {
    /** RSC environment entry (server components) */
    rsc?: string;
    /** SSR environment entry (HTML rendering) */
    ssr?: string;
    /** Client environment entry (browser) */
    client?: string;
  };

  /**
   * Custom output directories for each environment
   */
  outDirs?: {
    /** RSC build output directory */
    rsc?: string;
    /** SSR build output directory */
    ssr?: string;
    /** Client build output directory */
    client?: string;
  };

  /**
   * Whether to enable SSR environment
   * @default true
   */
  enableSsr?: boolean;

  /**
   * Custom plugin manager instance
   * If not provided, a new one will be created
   */
  manager?: RscPluginManager;

  /**
   * Enable build-time validation of 'server-only' and 'client-only' imports
   * @default true
   */
  validateImports?: boolean;

  /**
   * Custom chunking strategy for client reference modules
   */
  clientChunks?: (meta: { id: string; normalizedId: string; serverChunk: string }) => string | undefined;
}

export interface RscPluginContext {
  config: ResolvedConfig;
  projectRoot: string;
  isBuild: boolean;
  clientModules: Set<string>;
  serverModules: Set<string>;
  rscEndpoint: string;
  actionEndpoint: string;
}

/**
 * Runtime manifest types
 */
export interface ClientManifestEntry {
  id: string;
  name: string;
  chunks: string[];
  css?: string[];
  referenceKey?: string;
}

export interface ServerManifestEntry {
  id: string;
  name: string;
  moduleId: string;
  referenceKey?: string;
}

export type ClientManifest = Record<string, ClientManifestEntry>;
export type ServerManifest = Record<string, ServerManifestEntry>;

export type { Plugin, ResolvedConfig, ViteDevServer };
