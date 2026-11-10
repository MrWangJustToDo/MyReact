/**
 * @file RSC Directive Detection
 * Detects "use client" and "use server" directives in source files
 */

/**
 * Pattern to detect "use server" directive inside a function body
 * This is for inline server actions
 */
const USE_SERVER_INLINE_PATTERN = /['"`]use server['"`][\s]*;?/;

function skipTrivia(code: string, start: number): number {
  let index = start;

  while (index < code.length) {
    const char = code[index];

    if (char === " " || char === "\t" || char === "\r" || char === "\n" || char === "\uFEFF") {
      index++;
      continue;
    }

    if (char === "/" && code[index + 1] === "/") {
      const newline = code.indexOf("\n", index + 2);
      index = newline === -1 ? code.length : newline + 1;
      continue;
    }

    if (char === "/" && code[index + 1] === "*") {
      const end = code.indexOf("*/", index + 2);
      index = end === -1 ? code.length : end + 2;
      continue;
    }

    break;
  }

  return index;
}

/**
 * Read the JavaScript directive prologue. Directives are not required to be
 * the first statement: `"use strict"; "use client";` is valid and both are
 * directives. A simple regex anchored at the file start only sees the first one.
 */
function readPrologueDirectives(code: string): string[] {
  const directives: string[] = [];
  let index = 0;

  // Shebang is allowed before the directive prologue.
  if (code.startsWith("#!")) {
    const newline = code.indexOf("\n");
    if (newline === -1) return directives;
    index = newline + 1;
  }

  while (index < code.length) {
    index = skipTrivia(code, index);
    if (index >= code.length) break;

    const quote = code[index];
    if (quote !== '"' && quote !== "'" && quote !== "`") break;

    index++;
    let value = "";
    let closed = false;

    while (index < code.length) {
      const char = code[index++];

      if (char === "\\") {
        value += code[index++] ?? "";
        continue;
      }

      if (char === quote) {
        closed = true;
        break;
      }

      // Template literals with substitutions are expressions, not directives.
      if (quote === "`" && char === "$" && code[index] === "{") {
        break;
      }

      value += char;
    }

    if (!closed) break;

    let after = index;
    while (after < code.length && (code[after] === " " || code[after] === "\t")) after++;
    if (code[after] === ";") after++;

    const next = code[after];
    // A directive statement ends at a newline, a comment, a block end, or EOF.
    // Anything else means this string literal was part of an expression.
    if (next !== undefined && next !== "\n" && next !== "\r" && next !== "/" && next !== "}") {
      break;
    }

    directives.push(value);
    index = after;
  }

  return directives;
}

export interface DirectiveInfo {
  /**
   * Whether the file has a "use client" directive
   */
  hasUseClient: boolean;

  /**
   * Whether the file has a "use server" directive at the top level
   */
  hasUseServer: boolean;

  /**
   * Whether the file has inline "use server" directives (inside functions)
   */
  hasInlineUseServer: boolean;
}

/**
 * Detects "use client" directive in source code
 *
 * @param code - The source code to check
 * @returns true if the file starts with "use client" directive
 *
 * @example
 * ```typescript
 * detectUseClientDirective('"use client";\nimport React from "react";'); // true
 * detectUseClientDirective('import React from "react";'); // false
 * ```
 */
export function detectUseClientDirective(code: string): boolean {
  return readPrologueDirectives(code).includes("use client");
}

/**
 * Detects "use server" directive at the top level of source code
 *
 * @param code - The source code to check
 * @returns true if the file starts with "use server" directive
 *
 * @example
 * ```typescript
 * detectUseServerDirective('"use server";\nexport async function action() {}'); // true
 * detectUseServerDirective('export async function action() {}'); // false
 * ```
 */
export function detectUseServerDirective(code: string): boolean {
  return readPrologueDirectives(code).includes("use server");
}

/**
 * Detects inline "use server" directives inside function bodies
 *
 * @param code - The source code to check
 * @returns true if the file contains inline "use server" directives
 *
 * @example
 * ```typescript
 * detectInlineUseServerDirective('async function action() { "use server"; }'); // true
 * ```
 */
export function detectInlineUseServerDirective(code: string): boolean {
  // First check if there's a top-level use server (skip if so)
  if (detectUseServerDirective(code)) {
    return false;
  }

  // Check for use server anywhere in the code (indicates inline usage)
  return USE_SERVER_INLINE_PATTERN.test(code);
}

/**
 * Detects all RSC directives in source code
 *
 * @param code - The source code to check
 * @returns Object with directive detection results
 *
 * @example
 * ```typescript
 * const info = detectDirectives('"use client";\nimport React from "react";');
 * // { hasUseClient: true, hasUseServer: false, hasInlineUseServer: false }
 * ```
 */
export function detectDirectives(code: string): DirectiveInfo {
  return {
    hasUseClient: detectUseClientDirective(code),
    hasUseServer: detectUseServerDirective(code),
    hasInlineUseServer: detectInlineUseServerDirective(code),
  };
}

/**
 * Check if a file extension indicates it might contain RSC directives
 */
export function isRscEligibleFile(filename: string): boolean {
  const extensions = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".mts"];
  return extensions.some((ext) => filename.endsWith(ext));
}

/**
 * Get the directive from a file, removing it from the code
 *
 * @param code - The source code
 * @returns Object with directive type and code without the directive
 */
export function extractDirective(code: string): {
  directive: "use client" | "use server" | null;
  codeWithoutDirective: string;
} {
  const directives = readPrologueDirectives(code);

  if (directives.includes("use client")) {
    return {
      directive: "use client",
      codeWithoutDirective: code, // Keep original for now
    };
  }

  if (directives.includes("use server")) {
    return {
      directive: "use server",
      codeWithoutDirective: code, // Keep original for now
    };
  }

  return {
    directive: null,
    codeWithoutDirective: code,
  };
}
