/**
 * @file RSC Scan Build Strip Plugin
 * Strips all code except imports during scan builds for faster module graph traversal
 */

import * as esModuleLexer from "es-module-lexer";
import { walk } from "estree-walker";
import { parseAstAsync } from "vite";

import { asWalkRoot, getNodeRange } from "../utils";

import type { RscPluginManager } from "../manager";
import type { CallExpression, Identifier, MemberExpression, MetaProperty, Node } from "estree";
import type { Plugin } from "vite";

/**
 * Create the scan build strip plugin
 *
 * During scan builds, we only need to traverse the module graph to discover
 * "use client" and "use server" boundaries. This plugin strips all code
 * except imports to make this traversal faster.
 */
export function createScanPlugin(manager: RscPluginManager): Plugin {
  return {
    name: "vite:my-react-rsc-scan-strip",
    apply: "build",
    enforce: "post",

    async buildStart() {
      await esModuleLexer.init;
    },

    async transform(code, id) {
      if (!manager.isScanBuild) return null;

      // Skip virtual modules and internal rollup modules
      if (id.startsWith("\0") || id.includes("rolldown/runtime")) {
        return null;
      }

      // Only strip app sources. Stripping workspace CJS (`packages/myreact*`) or
      // node_modules breaks Rollup commonjs interop (`__require` / `?commonjs-es-import`)
      // — which surfaces on no-ssr builds that use a client scan instead of SSR scan.
      if (!shouldScanModule(id)) {
        return null;
      }

      try {
        const output = await transformScanBuildStrip(code);
        return {
          code: output,
          map: { mappings: "" },
        };
      } catch {
        // If parsing fails, return minimal code
        return {
          code: "export {};",
          map: { mappings: "" },
        };
      }
    },
  };
}

/**
 * Regex to detect import.meta.glob calls
 */
const importGlobRE = /\bimport\.meta\.glob(?:<\w+>)?\s*\(/g;

/**
 * Transform code for scan build by stripping everything except imports
 *
 * This preserves:
 * 1. All import statements (to traverse the module graph)
 * 2. import.meta.glob calls (for dynamic imports)
 *
 * @param code - Source code to transform
 * @returns Stripped code with only imports
 */
export async function transformScanBuildStrip(code: string): Promise<string> {
  const [imports] = esModuleLexer.parse(code);

  // Collect all import statements
  let output = imports
    .map((e) => {
      if (e.n) {
        return `import ${JSON.stringify(e.n)};\n`;
      }
      return null;
    })
    .filter(Boolean)
    .join("");

  // Preserve import.meta.glob for proper glob handling
  if (importGlobRE.test(code)) {
    try {
      const ast = asWalkRoot(await parseAstAsync(code));

      walk(ast, {
        enter(node) {
          if (!isImportMetaGlobCall(node)) {
            return;
          }
          const range = getNodeRange(node);
          if (!range) {
            return;
          }
          const importMetaGlob = code.slice(range.start, range.end);
          output += `console.log(${importMetaGlob});\n`;
        },
      });
    } catch {
      // Ignore parse errors for glob preservation
    }
  }

  // Ensure we have at least an empty export
  if (!output.trim()) {
    output = "export {};";
  }

  return output;
}

/**
 * Check if a module should be scanned for RSC boundaries
 *
 * @param id - Module ID
 * @returns Whether to scan this module
 */
export function shouldScanModule(id: string): boolean {
  // Framework / deps: keep full code so CJS interop and package graphs stay valid
  if (id.includes("node_modules")) {
    return false;
  }
  if (id.includes("/packages/myreact")) {
    return false;
  }

  // Only scan JS/TS app sources for "use client" / "use server" boundaries
  return /\.[jt]sx?$/.test(id);
}

function isImportMetaGlobCall(node: Node): node is CallExpression {
  if (node.type !== "CallExpression" || node.callee.type !== "MemberExpression") {
    return false;
  }
  const callee = node.callee as MemberExpression;
  if (callee.object.type !== "MetaProperty" || callee.property.type !== "Identifier") {
    return false;
  }
  const meta = callee.object as MetaProperty;
  const property = callee.property as Identifier;
  return (
    meta.meta.type === "Identifier" &&
    meta.meta.name === "import" &&
    meta.property.type === "Identifier" &&
    meta.property.name === "meta" &&
    property.name === "glob"
  );
}
