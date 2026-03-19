/**
 * @file Server Action Parser
 * Parse server actions from "use server" modules using AST with estree-walker
 */

import { walk } from "estree-walker";
import { parseAstAsync } from "vite";

import { parseExports, parseExportsAsync } from "../utils/lexer";

import type {
  Node,
  BlockStatement,
  FunctionDeclaration,
  VariableDeclaration,
  ArrowFunctionExpression,
  FunctionExpression,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  ExpressionStatement,
  Literal,
  Identifier,
  Program,
} from "estree";

export interface InlineServerAction {
  start: number;
  end: number;
  name: string;
  isAsync: boolean;
}

/**
 * Parse server actions from a "use server" module using es-module-lexer
 *
 * @param code - The source code
 * @returns Array of function names that are server actions (exported functions)
 */
export async function parseServerActions(code: string): Promise<string[]> {
  const actions: string[] = [];
  const moduleExports = await parseExportsAsync(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;
    // All exports from a "use server" module are server actions
    if (exportName && exportName !== "default") {
      actions.push(exportName);
    }
  }

  // Check for default export separately
  const hasDefault = moduleExports.some((exp) => exp.n === "default");
  if (hasDefault) {
    actions.push("default");
  }

  return [...new Set(actions)];
}

/**
 * Synchronous version - requires lexer to be pre-initialized
 */
export function parseServerActionsSync(code: string): string[] {
  const actions: string[] = [];
  const moduleExports = parseExports(code);

  for (const exp of moduleExports) {
    const exportName = exp.n;
    if (exportName && exportName !== "default") {
      actions.push(exportName);
    }
  }

  const hasDefault = moduleExports.some((exp) => exp.n === "default");
  if (hasDefault) {
    actions.push("default");
  }

  return [...new Set(actions)];
}

/**
 * Check if a function body starts with "use server" directive
 */
function hasUseServerDirective(body: Node | null | undefined): boolean {
  if (!body || body.type !== "BlockStatement") {
    return false;
  }

  const blockBody = (body as BlockStatement).body;
  if (blockBody.length === 0) {
    return false;
  }

  const firstStatement = blockBody[0];
  if (firstStatement.type !== "ExpressionStatement") {
    return false;
  }

  const expression = (firstStatement as ExpressionStatement).expression;
  if (expression.type !== "Literal") {
    return false;
  }

  const literal = expression as Literal;
  return literal.value === "use server";
}

/**
 * Get the body of an async function for directive checking
 */
function getAsyncFunctionBody(node: Node): Node | null {
  if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") {
    const func = node as FunctionDeclaration | FunctionExpression;
    return func.async ? func.body : null;
  }

  if (node.type === "ArrowFunctionExpression") {
    const arrow = node as ArrowFunctionExpression;
    return arrow.async ? arrow.body : null;
  }

  return null;
}

// Extended node type with start/end positions from Vite's parser
type NodeWithPosition = Node & {
  start: number;
  end: number;
};

/**
 * Find inline "use server" actions in a component file using AST parsing with estree-walker
 * This looks for functions that contain "use server" directive inside their body
 *
 * @param code - The source code
 * @returns Array of inline action locations
 */
export async function findInlineServerActions(code: string): Promise<InlineServerAction[]> {
  const inlineActions: InlineServerAction[] = [];

  // Quick check - if no "use server" in code, skip AST parsing
  if (!code.includes("use server")) {
    return inlineActions;
  }

  try {
    const ast = (await parseAstAsync(code)) as unknown as Program;

    // Use estree-walker to traverse the AST
    walk(ast, {
      enter(node, parent) {
        const nodeWithPos = node as unknown as NodeWithPosition;

        // Handle function declarations
        if (node.type === "FunctionDeclaration") {
          const funcDecl = node as FunctionDeclaration;
          if (funcDecl.async && funcDecl.id && hasUseServerDirective(funcDecl.body)) {
            inlineActions.push({
              start: nodeWithPos.start,
              end: nodeWithPos.end,
              name: funcDecl.id.name,
              isAsync: true,
            });
            // Skip children since we found what we need
            this.skip();
          }
        }

        // Handle variable declarations with arrow functions or function expressions
        if (node.type === "VariableDeclaration") {
          const varDecl = node as VariableDeclaration;
          for (const declarator of varDecl.declarations) {
            if (declarator.id.type !== "Identifier" || !declarator.init) {
              continue;
            }

            const init = declarator.init;
            const identifier = declarator.id as Identifier;
            const body = getAsyncFunctionBody(init);

            if (body && hasUseServerDirective(body)) {
              inlineActions.push({
                start: nodeWithPos.start,
                end: nodeWithPos.end,
                name: identifier.name,
                isAsync: true,
              });
            }
          }
          // Skip children to avoid double processing
          this.skip();
        }

        // Handle exported function declarations
        if (node.type === "ExportNamedDeclaration") {
          const exportDecl = node as ExportNamedDeclaration;
          if (exportDecl.declaration?.type === "FunctionDeclaration") {
            const funcDecl = exportDecl.declaration as FunctionDeclaration;
            if (funcDecl.async && funcDecl.id && hasUseServerDirective(funcDecl.body)) {
              inlineActions.push({
                start: nodeWithPos.start,
                end: nodeWithPos.end,
                name: funcDecl.id.name,
                isAsync: true,
              });
            }
          }
          // Skip children
          this.skip();
        }

        // Handle export default declarations
        if (node.type === "ExportDefaultDeclaration") {
          const exportDecl = node as ExportDefaultDeclaration;
          const decl = exportDecl.declaration;

          // export default async function() { "use server"; ... }
          if (decl.type === "FunctionDeclaration") {
            const funcDecl = decl as FunctionDeclaration;
            if (funcDecl.async && hasUseServerDirective(funcDecl.body)) {
              inlineActions.push({
                start: nodeWithPos.start,
                end: nodeWithPos.end,
                name: funcDecl.id?.name || "default",
                isAsync: true,
              });
            }
          }

          // export default async () => { "use server"; ... }
          if (decl.type === "ArrowFunctionExpression" || decl.type === "FunctionExpression") {
            const body = getAsyncFunctionBody(decl);
            if (body && hasUseServerDirective(body)) {
              inlineActions.push({
                start: nodeWithPos.start,
                end: nodeWithPos.end,
                name: "default",
                isAsync: true,
              });
            }
          }
          // Skip children
          this.skip();
        }
      },
    });
  } catch (error) {
    // If AST parsing fails, fall back to regex-based detection
    console.warn("[@my-react/react-vite] AST parsing failed, falling back to regex:", error);
    return findInlineServerActionsRegex(code);
  }

  return inlineActions;
}

/**
 * Fallback regex-based detection for inline server actions
 * Used when AST parsing fails
 */
function findInlineServerActionsRegex(code: string): InlineServerAction[] {
  const inlineActions: InlineServerAction[] = [];

  // Pattern to find functions with "use server" inside
  // Match async function declarations with "use server" in body
  const asyncFnPattern = /async\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{[^}]*(['"`])use server\2/g;
  let match;
  while ((match = asyncFnPattern.exec(code)) !== null) {
    inlineActions.push({
      start: match.index,
      end: match.index + match[0].length,
      name: match[1],
      isAsync: true,
    });
  }

  // Match async arrow functions assigned to const with "use server" in body
  const asyncArrowPattern = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*async\s*(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*\{[^}]*(['"`])use server\2/g;
  while ((match = asyncArrowPattern.exec(code)) !== null) {
    inlineActions.push({
      start: match.index,
      end: match.index + match[0].length,
      name: match[1],
      isAsync: true,
    });
  }

  return inlineActions;
}
