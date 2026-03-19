/**
 * Global type declarations for RSC Vite plugin
 */

declare const __DEV__: boolean;
declare const __VERSION__: string;

declare module "es-module-lexer" {
  export interface ExportSpecifier {
    /** Exported name */
    n: string;
    /** Local name (for re-exports) */
    ln?: string;
    /** Start position */
    s: number;
    /** End position */
    e: number;
    /** Local start (for re-exports) */
    ls?: number;
    /** Local end (for re-exports) */
    le?: number;
  }

  export interface ImportSpecifier {
    /** Module specifier */
    n?: string;
    /** Start of module specifier */
    s: number;
    /** End of module specifier */
    e: number;
    /** Start of import statement */
    ss: number;
    /** End of import statement */
    se: number;
    /** Dynamic import expression start (-1 if not dynamic) */
    d: number;
    /** Assert clause (import attributes) */
    a: number;
  }

  /**
   * Initialize the WebAssembly module
   */
  export const init: Promise<void>;

  /**
   * Parse ES module imports and exports
   * @param source - The source code to parse
   * @param name - Optional source name for error messages
   * @returns Tuple of [imports, exports]
   */
  export function parse(source: string, name?: string): [ImportSpecifier[], ExportSpecifier[]];
}
