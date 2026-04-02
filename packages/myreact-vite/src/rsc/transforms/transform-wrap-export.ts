import MagicString from "magic-string";
import { extract_names } from "periscopic";

import type { Node, Program } from "estree";

function tinyAssert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}

type NodeWithPos = Node & { start?: number; end?: number };

type ExportMeta = {
  declName?: string;
  isFunction?: boolean;
  defaultExportIdentifierName?: string;
};

export type TransformWrapExportFilter = (name: string, meta: ExportMeta) => boolean;

export type TransformWrapExportOptions = {
  runtime: (value: string, name: string, meta: ExportMeta) => string;
  ignoreExportAllDeclaration?: boolean;
  rejectNonAsyncFunction?: boolean;
  filter?: TransformWrapExportFilter;
};

export function transformWrapExport(
  input: string,
  ast: Program,
  options: TransformWrapExportOptions
): {
  exportNames: string[];
  output: MagicString;
} {
  const output = new MagicString(input);
  const exportNames: string[] = [];
  const toAppend: string[] = [];
  const filter = options.filter ?? (() => true);

  function wrapSimple(start: number, end: number, exports: { name: string; meta: ExportMeta }[]) {
    exportNames.push(...exports.map((e) => e.name));
    const newCode = exports
      .map((e) => [filter(e.name, e.meta) && `${e.name} = /* #__PURE__ */ ${options.runtime(e.name, e.name, e.meta)};\n`, `export { ${e.name} };\n`])
      .flat()
      .filter(Boolean)
      .join("");
    output.update(start, end, newCode);
    output.move(start, end, input.length);
  }

  function wrapExport(name: string, exportName: string, meta: ExportMeta = {}) {
    exportNames.push(exportName);
    if (!filter(exportName, meta)) {
      toAppend.push(`export { ${name} as ${exportName} }`);
      return;
    }

    toAppend.push(`const $$wrap_${name} = /* #__PURE__ */ ${options.runtime(name, exportName, meta)}`, `export { $$wrap_${name} as ${exportName} }`);
  }

  function validateNonAsyncFunction(node: Node) {
    if (!options.rejectNonAsyncFunction) return;
    if (
      node.type === "ClassDeclaration" ||
      ((node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") && !node.async)
    ) {
      throw Object.assign(new Error("unsupported non async function"), {
        pos: (node as NodeWithPos).start,
      });
    }
  }

  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
          validateNonAsyncFunction(node.declaration);
          const name = node.declaration.id.name;
          wrapSimple((node as NodeWithPos).start ?? 0, (node.declaration as NodeWithPos).start ?? 0, [
            { name, meta: { isFunction: node.declaration.type === "FunctionDeclaration", declName: name } },
          ]);
        } else if (node.declaration.type === "VariableDeclaration") {
          for (const decl of node.declaration.declarations) {
            if (decl.init) {
              validateNonAsyncFunction(decl.init);
            }
          }
          if (node.declaration.kind === "const") {
            output.update((node.declaration as NodeWithPos).start ?? 0, ((node.declaration as NodeWithPos).start ?? 0) + 5, "let");
          }
          const names = node.declaration.declarations.flatMap((decl) => extract_names(decl.id));
          let isFunction = false;
          if (node.declaration.declarations.length === 1) {
            const decl = node.declaration.declarations[0]!;
            isFunction = decl.id.type === "Identifier" && (decl.init?.type === "ArrowFunctionExpression" || decl.init?.type === "FunctionExpression");
          }
          wrapSimple(
            (node as NodeWithPos).start ?? 0,
            (node.declaration as NodeWithPos).start ?? 0,
            names.map((name) => ({ name, meta: { isFunction, declName: name } }))
          );
        } else {
          node.declaration satisfies never;
        }
      } else {
        if (node.source) {
          output.remove((node as NodeWithPos).start ?? 0, (node as NodeWithPos).end ?? 0);
          for (const spec of node.specifiers) {
            tinyAssert(spec.local.type === "Identifier", "Expected local identifier");
            tinyAssert(spec.exported.type === "Identifier", "Expected exported identifier");
            const name = spec.local.name;
            toAppend.push(`import { ${name} as $$import_${name} } from ${node.source.raw}`);
            wrapExport(`$$import_${name}`, spec.exported.name);
          }
        } else {
          output.remove((node as NodeWithPos).start ?? 0, (node as NodeWithPos).end ?? 0);
          for (const spec of node.specifiers) {
            tinyAssert(spec.local.type === "Identifier", "Expected local identifier");
            tinyAssert(spec.exported.type === "Identifier", "Expected exported identifier");
            wrapExport(spec.local.name, spec.exported.name);
          }
        }
      }
    }

    if (!options.ignoreExportAllDeclaration && node.type === "ExportAllDeclaration") {
      throw Object.assign(new Error("unsupported ExportAllDeclaration"), {
        pos: (node as NodeWithPos).start,
      });
    }

    if (node.type === "ExportDefaultDeclaration") {
      validateNonAsyncFunction(node.declaration as Node);
      let localName: string;
      let isFunction = false;
      let declName: string | undefined;
      let defaultExportIdentifierName: string | undefined;

      if ((node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") && node.declaration.id) {
        localName = node.declaration.id.name;
        output.remove((node as NodeWithPos).start ?? 0, (node.declaration as NodeWithPos).start ?? 0);
        isFunction = node.declaration.type === "FunctionDeclaration";
        declName = node.declaration.id.name;
      } else {
        localName = "$$default";
        output.update((node as NodeWithPos).start ?? 0, (node.declaration as NodeWithPos).start ?? 0, "const $$default = ");
        if (node.declaration.type === "Identifier") {
          defaultExportIdentifierName = node.declaration.name;
        }
      }

      wrapExport(localName, "default", { isFunction, declName, defaultExportIdentifierName });
    }
  }

  if (toAppend.length > 0) {
    output.append(["", ...toAppend, ""].join(";\n"));
  }

  return { exportNames, output };
}
