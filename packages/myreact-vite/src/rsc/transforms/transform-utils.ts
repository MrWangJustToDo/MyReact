import { extract_names } from "periscopic";

import type { Program } from "estree";

function tinyAssert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}

export function hasDirective(body: Program["body"], directive: string): boolean {
  return !!body.find(
    (stmt) =>
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      typeof stmt.expression.value === "string" &&
      stmt.expression.value === directive
  );
}

export function getExportNames(
  ast: Program,
  options: {
    ignoreExportAllDeclaration?: boolean;
  }
): {
  exportNames: string[];
} {
  const exportNames: string[] = [];

  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
          exportNames.push(node.declaration.id.name);
        } else if (node.declaration.type === "VariableDeclaration") {
          for (const decl of node.declaration.declarations) {
            exportNames.push(...extract_names(decl.id));
          }
        } else {
          node.declaration satisfies never;
        }
      } else {
        for (const spec of node.specifiers) {
          tinyAssert(spec.exported.type === "Identifier", "Expected exported identifier");
          exportNames.push(spec.exported.name);
        }
      }
    }

    if (!options.ignoreExportAllDeclaration && node.type === "ExportAllDeclaration") {
      throw new Error("unsupported ExportAllDeclaration");
    }

    if (node.type === "ExportDefaultDeclaration") {
      exportNames.push("default");
    }
  }

  return { exportNames };
}
