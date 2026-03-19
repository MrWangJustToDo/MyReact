/**
 * @file ES Module Lexer utilities
 * Shared lexer initialization and parsing functions
 */

import { init, parse } from "es-module-lexer";

import type { ExportSpecifier } from "es-module-lexer";

// Track if es-module-lexer has been initialized
let lexerInitialized = false;

/**
 * Initialize the es-module-lexer
 * Call this at plugin startup for better performance
 */
export async function initLexer(): Promise<void> {
  if (!lexerInitialized) {
    await init;
    lexerInitialized = true;
  }
}

/**
 * Check if lexer is initialized
 */
export function isLexerInitialized(): boolean {
  return lexerInitialized;
}

/**
 * Parse module exports using es-module-lexer
 * @param code - Source code to parse
 * @returns Array of export specifiers
 */
export function parseExports(code: string): ExportSpecifier[] {
  try {
    const [, exports] = parse(code);
    return exports;
  } catch (error) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.warn("[@my-react/react-vite] Failed to parse module:", error);
    }
    return [];
  }
}

/**
 * Parse module exports asynchronously (ensures lexer is initialized)
 * @param code - Source code to parse
 * @returns Array of export specifiers
 */
export async function parseExportsAsync(code: string): Promise<ExportSpecifier[]> {
  await initLexer();
  return parseExports(code);
}

export type { ExportSpecifier };
