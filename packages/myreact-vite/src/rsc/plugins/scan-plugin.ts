/**
 * @file RSC Scan Build Strip Plugin
 * Strips all code except imports during scan builds for faster module graph traversal
 */

import * as esModuleLexer from "es-module-lexer";
import { walk } from "estree-walker";
import { parseAstAsync } from "vite";

import type { RscPluginManager } from "../manager";
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
      const ast = await parseAstAsync(code);

      walk(ast as any, {
        enter(node: any) {
          if (
            node.type === "CallExpression" &&
            node.callee?.type === "MemberExpression" &&
            node.callee.object?.type === "MetaProperty" &&
            node.callee.object.meta?.type === "Identifier" &&
            node.callee.object.meta.name === "import" &&
            node.callee.object.property?.type === "Identifier" &&
            node.callee.object.property.name === "meta" &&
            node.callee.property?.type === "Identifier" &&
            node.callee.property.name === "glob"
          ) {
            const importMetaGlob = code.slice(node.start, node.end);
            output += `console.log(${importMetaGlob});\n`;
          }
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
  // Skip node_modules except for specific packages
  if (id.includes("node_modules")) {
    const allowedPackages = ["@my-react/", "react-server-dom"];
    return allowedPackages.some((pkg) => id.includes(pkg));
  }

  // Only scan JS/TS files
  return /\.[jt]sx?$/.test(id);
}
