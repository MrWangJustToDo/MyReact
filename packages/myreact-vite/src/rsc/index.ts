/**
 * @file RSC Vite Plugin
 * Adds React Server Components support to MyReact Vite plugin
 */

import { createTransformPlugin, createDevServerPlugin, createConditionsPlugin, createBootstrapPlugin } from "./plugins";
import { ClientModuleRegistry, ServerActionRegistry } from "./transforms";

import type { RscPluginOptions } from "./types";
import type { Plugin } from "vite";

export type { RscPluginOptions } from "./types";

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
  });

  const devServerPlugin = createDevServerPlugin({
    rscEndpoint,
    actionEndpoint,
  });

  const conditionsPlugin = createConditionsPlugin();

  const bootstrapPlugin = createBootstrapPlugin({
    rscEndpoint,
    actionEndpoint,
  });

  return [transformPlugin, devServerPlugin, conditionsPlugin, bootstrapPlugin];
}

// Re-export directives
export { detectUseClientDirective, detectUseServerDirective, detectInlineUseServerDirective, isRscEligibleFile } from "./directives";

// Re-export transforms
export {
  // Registries
  ClientModuleRegistry,
  ServerActionRegistry,
  // Parsers
  parseModuleExports,
  parseModuleExportsSync,
  parseServerActions,
  parseServerActionsSync,
  findInlineServerActions,
  // Code generators
  generateClientReferenceProxyCode,
  createClientModuleProxy,
  generateServerModuleCode,
  generateServerActionHandler,
} from "./transforms";
export type { ClientReferenceInfo, ServerActionInfo, ParsedExports } from "./transforms";

// Re-export utils
export { initLexer, isLexerInitialized, parseExports, parseExportsAsync, generateModuleId, parseModuleId, createReferenceId } from "./utils";

// Re-export plugins for advanced usage
export { createTransformPlugin, createDevServerPlugin, createConditionsPlugin, createBootstrapPlugin } from "./plugins";
export type { TransformPluginContext, DevServerPluginOptions, BootstrapPluginOptions } from "./plugins";

// Legacy exports for backward compatibility with clientTransform.ts and serverTransform.ts
// These re-export from the old files which will be updated to use new modules
export {
  transformClientModule,
  transformClientModuleSync,
  parseModuleExports as parseModuleExportsLegacy,
  parseModuleExportsSync as parseModuleExportsSyncLegacy,
  ClientModuleRegistry as ClientModuleRegistryLegacy,
  generateModuleId as generateModuleIdLegacy,
  initLexer as initLexerLegacy,
} from "./client-transform";

export {
  transformServerModule,
  transformServerModuleSync,
  transformInlineServerActions,
  parseServerActions as parseServerActionsLegacy,
  parseServerActionsSync as parseServerActionsSyncLegacy,
  ServerActionRegistry as ServerActionRegistryLegacy,
  initLexer as initServerLexer,
} from "./server-transform";
