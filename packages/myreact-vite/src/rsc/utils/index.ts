/**
 * @file RSC Utilities Index
 * Re-exports all utility functions
 */

export { initLexer, isLexerInitialized, parseExports, parseExportsAsync } from "./lexer";
export { generateModuleId, parseModuleId, createReferenceId } from "./module-id";
export { RSC_SSR_ORIGINAL_QUERY, hasRscSsrOriginalQuery, withRscSsrOriginalQuery } from "./rsc-original";
export { asWalkRoot, getNodeRange } from "./ast";
export type { ParsedAst } from "./ast";
