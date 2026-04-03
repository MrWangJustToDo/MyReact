/**
 * @file RSC Types Index
 * Shared type definitions for RSC plugin
 */

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

export interface RscPluginContext {
  config: ResolvedConfig;
  projectRoot: string;
  isBuild: boolean;
  clientModules: Set<string>;
  serverModules: Set<string>;
  rscEndpoint: string;
  actionEndpoint: string;
}

export type { Plugin, ResolvedConfig, ViteDevServer };
