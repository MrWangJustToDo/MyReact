/**
 * @file RSC Vite Plugin
 * Adds React Server Components support to MyReact Vite plugin
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
import type { RscPluginOptions, RscBuildPluginOptions } from "./types";
import type { Plugin } from "vite";

export type { RscPluginOptions, RscBuildPluginOptions } from "./types";
export { RscPluginManager, createRscPluginManager } from "./manager";
export type { ClientReferenceMeta, ServerReferenceMeta, AssetsManifest, AssetDeps } from "./manager";

// Export unified plugin as the recommended API
export { rsc, getRscApi } from "./unified-plugin";
export type { UnifiedRscPluginOptions } from "./unified-plugin";

/**
 * Create RSC Vite plugins
 *
 * @param options - RSC plugin options
 * @returns Array of Vite plugins for RSC support
 */
export function rscPlugin(options: RscPluginOptions = {}): Plugin[] {
  if (!options.rsc) {
    return [];
  }

  const rscEndpoint = options.rscEndpoint ?? "/__rsc";
  const actionEndpoint = options.actionEndpoint ?? "/__rsc_action";

  // Create plugin manager for build orchestration
  const manager = createRscPluginManager();

  // Registries for tracking client/server modules
  const clientRegistry = new ClientModuleRegistry();
  const serverRegistry = new ServerActionRegistry();

  // Track which modules are client/server
  const clientModules = new Set<string>();
  const serverModules = new Set<string>();

  // Create plugins with shared context
  const transformPlugin = createTransformPlugin(options, {
    clientRegistry,
    serverRegistry,
    clientModules,
    serverModules,
    manager,
  });

  const devServerPlugin = createDevServerPlugin({
    rscEndpoint,
    actionEndpoint,
    ssr: options.ssr,
  });

  const conditionsPlugin = createConditionsPlugin();

  const bootstrapPlugin = createBootstrapPlugin({
    rscEndpoint,
    actionEndpoint,
  });

  return [transformPlugin, devServerPlugin, conditionsPlugin, bootstrapPlugin];
}

/**
 * Create RSC Vite plugins with full build support
 *
 * This version includes all plugins needed for production builds:
 * - Multi-environment configuration (rsc, ssr, client)
 * - Build orchestration (5-step build pipeline)
 * - Scan builds for fast reference discovery
 * - Virtual modules for client/server references
 * - Cross-environment module loading
 *
 * @param options - RSC build plugin options
 * @returns Array of Vite plugins for RSC support with build
 */
export function rscBuildPlugin(options: RscBuildPluginOptions = {}): Plugin[] {
  const rscEndpoint = options.rscEndpoint ?? "/__rsc";
  const actionEndpoint = options.actionEndpoint ?? "/__rsc_action";

  // Create plugin manager for build orchestration
  const manager = options.manager ?? createRscPluginManager();

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

  // Build configuration and orchestration
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

  // Dev server plugin (only active in serve mode)
  plugins.push(
    createDevServerPlugin({
      rscEndpoint,
      actionEndpoint,
      ssr: options.ssr,
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
 *
 * @param config - Vite config with plugins
 * @returns Plugin API with manager, or undefined
 */
export function getRscPluginApi(config: { plugins: Plugin[] }): { manager: RscPluginManager } | undefined {
  const plugin = config.plugins.find((p) => p.name === "vite:my-react-rsc-build-config");
  return plugin?.api as { manager: RscPluginManager } | undefined;
}

// Re-export directives
export { detectUseClientDirective, detectUseServerDirective, detectInlineUseServerDirective, isRscEligibleFile } from "./directives";

// Re-export transforms
export {
  // Registries (build-time tracking)
  ClientModuleRegistry,
  ServerActionRegistry,
  // Parsers
  parseModuleExports,
  parseModuleExportsSync,
  parseServerActions,
  parseServerActionsSync,
  findInlineServerActions,
  // Code generators (generate code that uses @my-react/react-server runtime)
  generateClientReferenceProxyCode,
  generateClientModuleProxyCode,
  generateServerModuleCode,
  generateServerActionHandler,
  // Deprecated - use generateClientModuleProxyCode
  createClientModuleProxy,
} from "./transforms";
export type { ClientReferenceInfo, ServerActionInfo, ParsedExports } from "./transforms";

// Re-export utils
export { initLexer, isLexerInitialized, parseExports, parseExportsAsync, generateModuleId, parseModuleId, createReferenceId } from "./utils";

// Re-export plugins for advanced usage
export { createTransformPlugin, createDevServerPlugin, createConditionsPlugin, createBootstrapPlugin } from "./plugins";
export type { TransformPluginContext, DevServerPluginOptions, BootstrapPluginOptions } from "./plugins";

// Transform functions (high-level APIs for transforming modules)
export { transformClientModule, transformClientModuleSync } from "./client-transform";
export { transformServerModule, transformServerModuleSync, transformInlineServerActions } from "./server-transform";
