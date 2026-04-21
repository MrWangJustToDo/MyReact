/**
 * @file RSC Vite Plugin
 * Adds React Server Components support to MyReact Vite plugin
 */

export type { RscPluginOptions, RscBuildPluginOptions } from "./types";
export { RscPluginManager, createRscPluginManager } from "./manager";
export type { ClientReferenceMeta, ServerReferenceMeta, AssetsManifest, AssetDeps } from "./manager";

// Unified plugin - the recommended API
export { rsc, getRscApi } from "./unified-plugin";
export type { UnifiedRscPluginOptions } from "./unified-plugin";

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
