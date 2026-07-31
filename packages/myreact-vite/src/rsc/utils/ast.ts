/**
 * Helpers for Vite/Rollup AST nodes (numeric start/end) used with estree-walker.
 */

import type { Node } from "estree";
import type { parseAstAsync } from "vite";

export type ParsedAst = Awaited<ReturnType<typeof parseAstAsync>>;

/**
 * Vite's parseAstAsync returns a Rollup Program AST that is walkable as estree.Node,
 * but the public return type is not identical to estree.Program.
 */
export function asWalkRoot(ast: ParsedAst): Node {
  return ast as Node;
}

/** Read numeric range from a Rollup/Vite AST node (estree.Node does not declare these). */
export function getNodeRange(node: object): { start: number; end: number } | null {
  if (!("start" in node) || !("end" in node)) {
    return null;
  }
  const { start, end } = node;
  if (typeof start !== "number" || typeof end !== "number") {
    return null;
  }
  return { start, end };
}
