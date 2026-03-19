/**
 * @file RSC Server Module Transform
 * Transforms "use server" modules into server action references
 *
 * This file is kept for backward compatibility.
 * The logic has been refactored into smaller modules:
 * - transforms/server-registry.ts - ServerActionRegistry class
 * - transforms/server-parser.ts - parseServerActions functions
 * - transforms/server-codegen.ts - generateServerModuleCode function
 * - utils/lexer.ts - initLexer and parsing utilities
 */

import { parseServerActions, parseServerActionsSync, generateServerModuleCode, findInlineServerActions, generateServerActionHandler } from "./transforms";

import type { ServerActionRegistry } from "./transforms";
import type { TransformResult } from "vite";

// Re-export types and classes for backward compatibility
export { ServerActionRegistry } from "./transforms";
export type { ServerActionInfo, InlineServerAction } from "./transforms";
export { initLexer } from "./utils";

/**
 * Parse server actions from a "use server" module
 * @deprecated Use parseServerActions from "./transforms" instead
 */
export { parseServerActions, parseServerActionsSync };

/**
 * Transform a "use server" module to register server actions
 *
 * @param code - The original source code
 * @param moduleId - The unique module ID
 * @param registry - The server action registry
 * @returns The transformed code
 */
export async function transformServerModule(code: string, moduleId: string, registry?: ServerActionRegistry): Promise<TransformResult> {
  const actions = await parseServerActions(code);

  if (registry) {
    for (const action of actions) {
      registry.register(moduleId, action);
    }
  }

  const transformedCode = generateServerModuleCode(code, moduleId, actions);

  return {
    code: transformedCode,
    map: null,
  };
}

/**
 * Synchronous version of transformServerModule
 */
export function transformServerModuleSync(code: string, moduleId: string, registry?: ServerActionRegistry): TransformResult {
  const actions = parseServerActionsSync(code);

  if (registry) {
    for (const action of actions) {
      registry.register(moduleId, action);
    }
  }

  const transformedCode = generateServerModuleCode(code, moduleId, actions);

  return {
    code: transformedCode,
    map: null,
  };
}

/**
 * Transform inline server actions in a component file
 *
 * @param code - The original source code
 * @param moduleId - The unique module ID
 * @param registry - The server action registry
 * @returns The transformed code
 */
export async function transformInlineServerActions(code: string, moduleId: string, registry?: ServerActionRegistry): Promise<TransformResult> {
  const inlineActions = await findInlineServerActions(code);

  if (inlineActions.length === 0) {
    return { code, map: null };
  }

  let transformedCode = code;

  // Add import for server reference registration at the top
  const importStatement = `import { registerServerReference as __registerServerReference__ } from "@my-react/react-server/server";\n`;

  // Wrap each inline action with registration
  for (const action of inlineActions) {
    if (registry) {
      registry.register(moduleId, action.name, true);
    }

    const actionId = `${moduleId}#${action.name}`;

    // Add a comment to mark the action for runtime registration
    transformedCode = transformedCode.replace(
      new RegExp(`(async\\s+function\\s+${action.name}|const\\s+${action.name}\\s*=\\s*async)`),
      `/* @__SERVER_ACTION__:${actionId} */ $1`
    );
  }

  transformedCode = importStatement + transformedCode;

  return {
    code: transformedCode,
    map: null,
  };
}

// Re-export the action handler generator
export { generateServerActionHandler };
