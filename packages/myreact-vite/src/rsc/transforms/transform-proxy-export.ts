import MagicString from "magic-string";
import { extract_names } from "periscopic";

import { hasDirective } from "./transform-utils";

import type { Node, Program } from "estree";

export type TransformProxyExportOptions = {
  code?: string;
  runtime: (name: string, meta?: { value: string }) => string;
  ignoreExportAllDeclaration?: boolean;
  rejectNonAsyncFunction?: boolean;
  keep?: boolean;
};

export function transformDirectiveProxyExport(
  ast: Program,
  options: {
    directive: string;
  } & TransformProxyExportOptions
):
  | {
      exportNames: string[];
      output: MagicString;
    }
  | undefined {
  if (!hasDirective(ast.body, options.directive)) {
    return;
  }
  return transformProxyExport(ast, options);
}

type NodeWithPos = Node & { start?: number; end?: number };

function getStart(node: NodeWithPos): number {
  return node.start ?? 0;
}

function getEnd(node: NodeWithPos): number {
  return node.end ?? 0;
}

export function transformProxyExport(
  ast: Program,
  options: TransformProxyExportOptions
): {
  exportNames: string[];
  output: MagicString;
} {
  if (options.keep && typeof options.code !== "string") {
    throw new Error("`keep` option requires `code`");
  }

  const codeLength = options.code?.length ?? 0;
  const output = new MagicString(options.code ?? " ".repeat(codeLength));
  const exportNames: string[] = [];

  function createExport(node: NodeWithPos, names: string[]) {
    exportNames.push(...names);
    const newCode = names
      .map((name) => (name === "default" ? "export default" : `export const ${name} =`) + ` /* #__PURE__ */ ${options.runtime(name)};\n`)
      .join("");
    output.update(getStart(node), getEnd(node), newCode);
  }

  function validateNonAsyncFunction(node: Node, ok?: boolean) {
    if (options.rejectNonAsyncFunction && !ok) {
      throw Object.assign(new Error("unsupported non async function"), {
        pos: (node as NodeWithPos).start,
      });
    }
  }

  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
          validateNonAsyncFunction(node, node.declaration.type === "FunctionDeclaration" && node.declaration.async);
          createExport(node, [node.declaration.id.name]);
        } else if (node.declaration.type === "VariableDeclaration") {
          validateNonAsyncFunction(
            node,
            node.declaration.declarations.every((decl) => decl.init?.type === "ArrowFunctionExpression" && decl.init.async)
          );
          if (options.keep && options.code) {
            if (node.declaration.declarations.length === 1) {
              const decl = node.declaration.declarations[0]!;
              if (decl.id.type === "Identifier" && decl.init) {
                const name = decl.id.name;
                const value = options.code.slice(getStart(decl.init as NodeWithPos), getEnd(decl.init as NodeWithPos));
                const newCode = `export const ${name} = /* #__PURE__ */ ${options.runtime(name, { value })};`;
                output.update(getStart(node as NodeWithPos), getEnd(node as NodeWithPos), newCode);
                exportNames.push(name);
                continue;
              }
            }
          }
          const names = node.declaration.declarations.flatMap((decl) => extract_names(decl.id));
          createExport(node, names);
        } else {
          node.declaration satisfies never;
        }
      } else {
        const names: string[] = [];
        for (const spec of node.specifiers) {
          if (spec.exported.type !== "Identifier") continue;
          names.push(spec.exported.name);
        }
        createExport(node, names);
      }
      continue;
    }

    if (!options.ignoreExportAllDeclaration && node.type === "ExportAllDeclaration") {
      throw new Error("unsupported ExportAllDeclaration");
    }

    if (node.type === "ExportDefaultDeclaration") {
      validateNonAsyncFunction(node, node.declaration.type === "Identifier" || (node.declaration.type === "FunctionDeclaration" && node.declaration.async));
      createExport(node, ["default"]);
      continue;
    }

    if (options.keep) continue;
    output.remove(getStart(node as NodeWithPos), getEnd(node as NodeWithPos));
  }

  return { exportNames, output };
}
