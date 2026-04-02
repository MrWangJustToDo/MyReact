/**
 * @file Client Module Export Parser
 * Parse module exports using es-module-lexer
 */

import { parseExports, parseExportsAsync } from "../utils/lexer";

export interface ParsedExports {
  exports: string[];
  hasDefaultExport: boolean;
}

/**
 * Parse module exports from source code using es-module-lexer (async)
 *
 * @param code - The source code
 * @returns Object with export information
 */
export async function parseModuleExports(code: string): Promise<ParsedExports> {
  const exports: string[] = [];
  let hasDefaultExport = false;

  const moduleExports = await parseExportsAsync(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;

    if (exportName === "default") {
      hasDefaultExport = true;
    } else if (exportName) {
      exports.push(exportName);
    }
  }

  return { exports: [...new Set(exports)], hasDefaultExport };
}

/**
 * Synchronous version of parseModuleExports
 * Note: Requires es-module-lexer to be pre-initialized via initLexer()
 */
export function parseModuleExportsSync(code: string): ParsedExports {
  const exports: string[] = [];
  let hasDefaultExport = false;

  const moduleExports = parseExports(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;

    if (exportName === "default") {
      hasDefaultExport = true;
    } else if (exportName) {
      exports.push(exportName);
    }
  }

  return { exports: [...new Set(exports)], hasDefaultExport };
}
