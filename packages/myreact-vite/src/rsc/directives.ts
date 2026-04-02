/**
 * @file RSC Directive Detection
 * Detects "use client" and "use server" directives in source files
 */

/**
 * Pattern to detect "use client" directive at the top of a file
 * Matches: 'use client', "use client", `use client`
 */
const USE_CLIENT_PATTERN = /^[\s\r\n]*(['"`])use client\1[\s]*;?/;

/**
 * Pattern to detect "use server" directive at the top of a file
 * Matches: 'use server', "use server", `use server`
 */
const USE_SERVER_PATTERN = /^[\s\r\n]*(['"`])use server\1[\s]*;?/;

/**
 * Pattern to detect "use server" directive inside a function body
 * This is for inline server actions
 */
const USE_SERVER_INLINE_PATTERN = /['"`]use server['"`][\s]*;?/;

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
  // Strip leading comments (single-line and multi-line) before checking
  const codeWithoutComments = stripLeadingComments(code);
  return USE_CLIENT_PATTERN.test(codeWithoutComments);
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
  // Strip leading comments (single-line and multi-line) before checking
  const codeWithoutComments = stripLeadingComments(code);
  return USE_SERVER_PATTERN.test(codeWithoutComments);
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
 * Strips leading comments from code for directive detection
 * Handles both single-line (//) and multi-line comments
 */
function stripLeadingComments(code: string): string {
  let result = code;

  // Remove leading whitespace
  result = result.trimStart();

  // Pattern for comments at the start
  const singleLineComment = /^\/\/[^\n]*\n?/;
  const multiLineComment = /^\/\*[\s\S]*?\*\//;

  // Keep stripping comments until we hit actual code
  let changed = true;
  while (changed) {
    changed = false;

    // Strip whitespace
    const trimmed = result.trimStart();
    if (trimmed !== result) {
      result = trimmed;
      changed = true;
    }

    // Strip single-line comment
    if (singleLineComment.test(result)) {
      result = result.replace(singleLineComment, "");
      changed = true;
    }

    // Strip multi-line comment
    if (multiLineComment.test(result)) {
      result = result.replace(multiLineComment, "");
      changed = true;
    }
  }

  return result;
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
  const codeWithoutComments = stripLeadingComments(code);

  if (USE_CLIENT_PATTERN.test(codeWithoutComments)) {
    const match = codeWithoutComments.match(USE_CLIENT_PATTERN);
    if (match) {
      // Keep the original code structure but we know it's a client module
      return {
        directive: "use client",
        codeWithoutDirective: code, // Keep original for now
      };
    }
  }

  if (USE_SERVER_PATTERN.test(codeWithoutComments)) {
    const match = codeWithoutComments.match(USE_SERVER_PATTERN);
    if (match) {
      return {
        directive: "use server",
        codeWithoutDirective: code, // Keep original for now
      };
    }
  }

  return {
    directive: null,
    codeWithoutDirective: code,
  };
}
