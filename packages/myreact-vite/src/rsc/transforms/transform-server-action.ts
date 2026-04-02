import { transformHoistInlineDirective } from "./transform-hoist-inline";
import { hasDirective } from "./transform-utils";
import { transformWrapExport } from "./transform-wrap-export";

import type { Program } from "estree";
import type MagicString from "magic-string";

export function transformServerActionServer(
  input: string,
  ast: Program,
  options: {
    runtime: (value: string, name: string) => string;
    rejectNonAsyncFunction?: boolean;
    encode?: (value: string) => string;
    decode?: (value: string) => string;
  }
):
  | {
      exportNames: string[];
      output: MagicString;
    }
  | {
      output: MagicString;
      names: string[];
    } {
  if (hasDirective(ast.body, "use server")) {
    return transformWrapExport(input, ast, {
      runtime: (value, name) => options.runtime(value, name),
      rejectNonAsyncFunction: options.rejectNonAsyncFunction,
    });
  }

  return transformHoistInlineDirective(input, ast, {
    runtime: (value, name) => options.runtime(value, name),
    directive: "use server",
    rejectNonAsyncFunction: options.rejectNonAsyncFunction,
    encode: options.encode,
    decode: options.decode,
  });
}
