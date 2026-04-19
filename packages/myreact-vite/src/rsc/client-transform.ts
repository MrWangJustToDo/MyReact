/**
 * @file RSC Client Module Transform
 * Transforms "use client" modules into client reference proxies for server-side rendering
 *
 * This file is kept for backward compatibility.
 * The logic has been refactored into smaller modules:
 * - transforms/clientRegistry.ts - ClientModuleRegistry class
 * - transforms/clientParser.ts - parseModuleExports functions
 * - transforms/clientCodegen.ts - generateClientReferenceProxyCode function
 * - utils/lexer.ts - initLexer and parsing utilities
 * - utils/moduleId.ts - generateModuleId function
 */

import {
  parseModuleExports,
  parseModuleExportsSync,
  generateClientReferenceProxyCode,
  generateClientModuleProxyCode,
  createClientModuleProxy,
} from "./transforms";

import type { ClientModuleRegistry } from "./transforms";
import type { TransformResult } from "vite";

// Re-export types and classes for backward compatibility
export { ClientModuleRegistry } from "./transforms";
export type { ClientReferenceInfo } from "./transforms";
export { generateModuleId, initLexer } from "./utils";

/**
 * Parse module exports from source code using es-module-lexer
 * @deprecated Use parseModuleExports from "./transforms" instead
 */
export { parseModuleExports, parseModuleExportsSync };

/**
 * Transform a "use client" module into a client reference proxy
 *
 * @param code - The original source code
 * @param moduleId - The unique module ID
 * @param registry - The client module registry
 * @returns The transformed code
 */
export async function transformClientModule(code: string, moduleId: string, registry?: ClientModuleRegistry): Promise<TransformResult> {
  const { exports, hasDefaultExport } = await parseModuleExports(code);

  if (registry) {
    registry.register(moduleId, {
      moduleId,
      exports,
      hasDefaultExport,
    });
  }

  const proxyCode = generateClientReferenceProxyCode(moduleId, exports, hasDefaultExport);

  return {
    code: proxyCode,
    map: null,
  };
}

/**
 * Synchronous version of transformClientModule
 * Note: Requires es-module-lexer to be pre-initialized via initLexer()
 */
export function transformClientModuleSync(code: string, moduleId: string, registry?: ClientModuleRegistry): TransformResult {
  const { exports, hasDefaultExport } = parseModuleExportsSync(code);

  if (registry) {
    registry.register(moduleId, {
      moduleId,
      exports,
      hasDefaultExport,
    });
  }

  const proxyCode = generateClientReferenceProxyCode(moduleId, exports, hasDefaultExport);

  return {
    code: proxyCode,
    map: null,
  };
}

// Re-export the module proxy function
export { generateClientModuleProxyCode };
/** @deprecated Use generateClientModuleProxyCode instead */
export { createClientModuleProxy };
