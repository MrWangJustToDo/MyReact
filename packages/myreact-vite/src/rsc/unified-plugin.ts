/**
 * @file Unified RSC Plugin
 * Single RSC plugin that handles both development and production builds
 */

import { createRscPluginManager } from "./manager";
import {
  createTransformPlugin,
  createDevServerPlugin,
  createConditionsPlugin,
  createBootstrapPlugin,
  createBuildPlugin,
  createScanPlugin,
  createVirtualModulesPlugin,
  createCrossEnvPlugin,
} from "./plugins";
import { ClientModuleRegistry, ServerActionRegistry } from "./transforms";

import type { RscPluginManager } from "./manager";
import type { Plugin } from "vite";

/**
 * Unified RSC plugin options
 */
export interface UnifiedRscPluginOptions {
  /**
   * Entry points for each environment
   * Required for build mode, optional for dev mode
   */
  entries?: {
    /** RSC entry - exports handler for server components */
    rsc?: string;
    /** SSR entry - exports renderHTML for SSR */
    ssr?: string;
    /** Client entry - hydration entry point */
    client?: string;
  };

  /**
   * Output directories for each environment (build only)
   * @default { rsc: 'dist/rsc', ssr: 'dist/ssr', client: 'dist/client' }
   */
  outDirs?: {
    rsc?: string;
    ssr?: string;
    client?: string;
  };

  /**
   * RSC endpoint for Flight stream requests
   * @default '/__rsc'
   */
  rscEndpoint?: string;

  /**
   * Server action endpoint
   * @default '/__rsc_action'
   */
  actionEndpoint?: string;

  /**
   * Whether to enable SSR environment
   * @default true
   */
  enableSsr?: boolean;

  /**
   * File patterns to include for directive detection
   */
  include?: string | RegExp | (string | RegExp)[];

  /**
   * File patterns to exclude from directive detection
   */
  exclude?: string | RegExp | (string | RegExp)[];

  /**
   * Plugin manager instance (for advanced usage)
   */
  manager?: RscPluginManager;
}

/**
 * Create unified RSC Vite plugins
 *
 * This single plugin function handles both development and production:
 * - Dev: Hot reloading, RSC streaming, server actions
 * - Build: Multi-environment builds (rsc, ssr, client)
 *
 * @param options - RSC plugin options
 * @returns Array of Vite plugins for RSC support
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import react from '@my-react/react-vite'
 * import { rsc } from '@my-react/react-vite/rsc'
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     rsc({
 *       entries: {
 *         rsc: './src/entry-rsc.tsx',
 *         ssr: './src/entry-ssr.tsx',
 *         client: './src/entry-client.tsx',
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export function rsc(options: UnifiedRscPluginOptions = {}): Plugin[] {
  const rscEndpoint = options.rscEndpoint ?? "/__rsc";
  const actionEndpoint = options.actionEndpoint ?? "/__rsc_action";

  // Create plugin manager for build orchestration
  const manager = options.manager ?? createRscPluginManager();

  // Store endpoints in manager for use by all plugins
  manager.rscEndpoint = rscEndpoint;
  manager.actionEndpoint = actionEndpoint;

  // Registries for tracking client/server modules
  const clientRegistry = new ClientModuleRegistry();
  const serverRegistry = new ServerActionRegistry();

  // Track which modules are client/server
  const clientModules = new Set<string>();
  const serverModules = new Set<string>();

  // Shared context for all plugins
  const context = {
    clientRegistry,
    serverRegistry,
    clientModules,
    serverModules,
    manager,
  };

  const plugins: Plugin[] = [];

  // Build configuration and orchestration (handles both dev and build)
  plugins.push(
    ...createBuildPlugin(manager, {
      entries: options.entries,
      outDirs: options.outDirs,
      enableSsr: options.enableSsr,
    })
  );

  // Scan build strip plugin
  plugins.push(createScanPlugin(manager));

  // Virtual modules for references and manifests
  plugins.push(createVirtualModulesPlugin(manager));

  // Cross-environment module loading
  plugins.push(...createCrossEnvPlugin(manager));

  // Main transform plugin
  plugins.push(
    createTransformPlugin(
      {
        rsc: true,
        include: options.include,
        exclude: options.exclude,
        rscEndpoint,
        actionEndpoint,
      },
      context
    )
  );

  // Dev server plugin - handles RSC streaming in development
  // Convert entries format to ssr format expected by dev server
  const ssrConfig = options.entries
    ? {
        entryRsc: options.entries.rsc?.replace(/^\.\//, "/").replace(/^(?!\/)/, "/"),
        entrySsr: options.entries.ssr?.replace(/^\.\//, "/").replace(/^(?!\/)/, "/"),
      }
    : undefined;

  plugins.push(
    createDevServerPlugin({
      rscEndpoint,
      actionEndpoint,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ssr: ssrConfig,
    })
  );

  // Conditions plugin for react-server
  plugins.push(createConditionsPlugin());

  // Bootstrap plugin for client hydration
  plugins.push(
    createBootstrapPlugin({
      rscEndpoint,
      actionEndpoint,
    })
  );

  return plugins;
}

/**
 * Get the plugin API for accessing the manager
 */
export function getRscApi(config: { plugins: Plugin[] }): { manager: RscPluginManager } | undefined {
  const plugin = config.plugins.find((p) => p.name === "vite:my-react-rsc-build-config");
  return plugin?.api as { manager: RscPluginManager } | undefined;
}
