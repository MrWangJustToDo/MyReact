/**
 * @file Client Module Export Parser
 * Parse module exports using es-module-lexer
 */

import { walk } from "estree-walker";
import { parseAstAsync } from "vite";

import { parseExports, parseExportsAsync } from "../utils/lexer";

export interface ParsedExports {
  exports: string[];
  hasDefaultExport: boolean;
  /** `export * from` cannot be represented by a static client proxy. */
  hasExportAll: boolean;
}

async function detectExportAll(code: string): Promise<boolean> {
  try {
    const ast = await parseAstAsync(code);
    let found = false;
    walk(ast, {
      enter(node) {
        if (node.type === "ExportAllDeclaration") {
          found = true;
          this.skip();
        }
      },
    });
    return found;
  } catch {
    // Fall back to a conservative syntax check below.
    return hasExportAllSyntax(code);
  }
}

function hasExportAllSyntax(code: string): boolean {
  const withoutComments = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return /(?:^|[;}\n])\s*export\s+\*\s*(?!as\b)/m.test(withoutComments);
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
  const hasExportAll = await detectExportAll(code);

  const moduleExports = await parseExportsAsync(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;

    if (!exportName) {
      continue;
    }

    if (exportName === "default") {
      hasDefaultExport = true;
    } else {
      exports.push(exportName);
    }
  }

  return { exports: [...new Set(exports)], hasDefaultExport, hasExportAll };
}

/**
 * Synchronous version of parseModuleExports
 * Note: Requires es-module-lexer to be pre-initialized via initLexer()
 */
export function parseModuleExportsSync(code: string): ParsedExports {
  const exports: string[] = [];
  let hasDefaultExport = false;
  const hasExportAll = hasExportAllSyntax(code);

  const moduleExports = parseExports(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;

    if (!exportName) {
      continue;
    }

    if (exportName === "default") {
      hasDefaultExport = true;
    } else {
      exports.push(exportName);
    }
  }

  return { exports: [...new Set(exports)], hasDefaultExport, hasExportAll };
}
