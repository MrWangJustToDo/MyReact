/**
 * @file RSC Transforms Index
 * Re-exports all transform modules
 */

// Registries
export { ClientModuleRegistry } from "./client-registry";
export type { ClientReferenceInfo } from "./client-registry";

export { ServerActionRegistry } from "./server-registry";
export type { ServerActionInfo } from "./server-registry";

// Parsers
export { parseModuleExports, parseModuleExportsSync } from "./client-parser";
export type { ParsedExports } from "./client-parser";

export { parseServerActions, parseServerActionsSync, findInlineServerActions } from "./server-parser";
export type { InlineServerAction } from "./server-parser";

// Code generators
export { generateClientReferenceProxyCode, createClientModuleProxy } from "./client-codegen";

export { generateServerModuleCode, generateInlineActionMarker, generateServerActionHandler, generateServerActionProxyCode } from "./server-codegen";

// Transform helpers (plugin-rsc style)
export { transformServerActionServer } from "./transform-server-action";
export { transformDirectiveProxyExport } from "./transform-proxy-export";
export { hasDirective, getExportNames } from "./transform-utils";
