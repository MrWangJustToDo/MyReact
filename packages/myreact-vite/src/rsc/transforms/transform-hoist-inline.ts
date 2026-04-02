import { walk } from "estree-walker";
import MagicString from "magic-string";
import { analyze } from "periscopic";

import type { Program, Literal, Node } from "estree";

function tinyAssert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}

type NodeWithPos = Node & { start?: number; end?: number };

const exactRegex = (value: string): RegExp => new RegExp("^" + value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "$");

function matchDirective(body: Program["body"], directive: RegExp): { match: RegExpMatchArray; node: Literal } | undefined {
  for (const stmt of body) {
    if (stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && typeof stmt.expression.value === "string") {
      const match = stmt.expression.value.match(directive);
      if (match) {
        return { match, node: stmt.expression };
      }
    }
  }
}

export function transformHoistInlineDirective(
  input: string,
  ast: Program,
  {
    runtime,
    rejectNonAsyncFunction,
    ...options
  }: {
    runtime: (value: string, name: string, meta: { directiveMatch: RegExpMatchArray }) => string;
    directive: string | RegExp;
    rejectNonAsyncFunction?: boolean;
    encode?: (value: string) => string;
    decode?: (value: string) => string;
    noExport?: boolean;
  }
): {
  output: MagicString;
  names: string[];
} {
  if (!input.endsWith("\n")) {
    input += "\n";
  }

  const output = new MagicString(input);
  const directive = typeof options.directive === "string" ? exactRegex(options.directive) : options.directive;

  walk(ast, {
    enter(node) {
      if (node.type === "ExportAllDeclaration") {
        this.remove();
      }
      if (node.type === "ExportNamedDeclaration" && !node.declaration) {
        this.remove();
      }
    },
  });

  const analyzed = analyze(ast);
  const names: string[] = [];

  walk(ast, {
    enter(node, parent) {
      if (
        (node.type === "FunctionExpression" || node.type === "FunctionDeclaration" || node.type === "ArrowFunctionExpression") &&
        node.body.type === "BlockStatement"
      ) {
        const match = matchDirective(node.body.body, directive)?.match;
        if (!match) return;
        if (!node.async && rejectNonAsyncFunction) {
          throw Object.assign(new Error(`"${String(directive)}" doesn't allow non async function`), {
            pos: (node as NodeWithPos).start,
          });
        }

        const scope = analyzed.map.get(node);
        tinyAssert(scope, "Missing scope information");

        const declName = node.type === "FunctionDeclaration" && node.id ? node.id.name : undefined;
        const originalName =
          declName || (parent?.type === "VariableDeclarator" && parent.id.type === "Identifier" && parent.id.name) || "anonymous_server_function";

        const bindVars = [...scope.references].filter((ref) => {
          if (ref === declName) {
            return false;
          }
          const owner = scope.find_owner(ref);
          return owner && owner !== scope && owner !== analyzed.scope;
        });

        let newParams = [...bindVars, ...node.params.map((n) => input.slice((n as NodeWithPos).start ?? 0, (n as NodeWithPos).end ?? 0))].join(", ");
        if (bindVars.length > 0 && options.decode) {
          newParams = ["$$hoist_encoded", ...node.params.map((n) => input.slice((n as NodeWithPos).start ?? 0, (n as NodeWithPos).end ?? 0))].join(", ");
          output.appendLeft(
            ((node.body.body[0] as NodeWithPos) ?? { start: 0 }).start ?? 0,
            `const [${bindVars.join(",")}] = ${options.decode("$$hoist_encoded")};\n`
          );
        }

        const newName = `$$hoist_${names.length}` + (originalName ? `_${originalName}` : "");
        names.push(newName);

        output.update(
          (node as NodeWithPos).start ?? 0,
          (node.body as NodeWithPos).start ?? 0,
          `\n;${options.noExport ? "" : "export "}${node.async ? "async " : ""}function ${newName}(${newParams}) `
        );
        output.appendLeft(
          (node as NodeWithPos).end ?? 0,
          `;\n/* #__PURE__ */ Object.defineProperty(${newName}, "name", { value: ${JSON.stringify(originalName)} });\n`
        );
        output.move((node as NodeWithPos).start ?? 0, (node as NodeWithPos).end ?? 0, input.length);

        let newCode = `/* #__PURE__ */ ${runtime(newName, newName, { directiveMatch: match })}`;
        if (bindVars.length > 0) {
          const bindArgs = options.encode ? options.encode("[" + bindVars.join(", ") + "]") : bindVars.join(", ");
          newCode = `${newCode}.bind(null, ${bindArgs})`;
        }
        if (declName) {
          newCode = `const ${declName} = ${newCode};`;
          if (parent?.type === "ExportDefaultDeclaration") {
            output.remove((parent as NodeWithPos).start ?? 0, (node as NodeWithPos).start ?? 0);
            newCode = `${newCode}\nexport default ${declName};`;
          }
        }
        output.appendLeft((node as NodeWithPos).start ?? 0, newCode);
      }
    },
  });

  return {
    output,
    names,
  };
}

export function findDirectives(ast: Program, directive: string): Literal[] {
  const directiveRE = exactRegex(directive);
  const nodes: Literal[] = [];
  walk(ast, {
    enter(node) {
      if (node.type === "Program" || node.type === "BlockStatement") {
        const match = matchDirective(node.body, directiveRE);
        if (match) {
          nodes.push(match.node);
        }
      }
    },
  });
  return nodes;
}
