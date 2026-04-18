/**
 * Auto chunk name loader for lazy imports.
 *
 * This loader automatically adds `webpackChunkName` magic comments to dynamic
 * imports that don't have them. This ensures all lazy-loaded components
 * generate `.bundle` files with CSS included.
 *
 * Transforms:
 *   import("./LazyCom")
 *   import('./components/MyComponent.tsx')
 *
 * Into:
 *   import(/* webpackChunkName: "LazyCom" *\/ "./LazyCom")
 *   import(/* webpackChunkName: "MyComponent" *\/ './components/MyComponent.tsx')
 */

import type { Rspack } from "@rsbuild/core";

/**
 * Extract a clean chunk name from an import path.
 * e.g., "./components/LazyCom.tsx" -> "LazyCom"
 */
function extractChunkName(importPath: string): string {
  // Remove quotes
  const path = importPath.replace(/^['"`]|['"`]$/g, "");

  // Split by path separators
  const parts = path.split(/[/\\]/);

  // Get the last part (filename)
  let filename = parts[parts.length - 1] || parts[parts.length - 2] || "chunk";

  // Remove extension
  filename = filename.replace(/\.[^.]+$/, "");

  // If it's "index", try to use the parent directory name
  if (filename === "index" && parts.length > 1) {
    filename = parts[parts.length - 2] || "chunk";
  }

  // Clean up the name - remove special characters, keep alphanumeric and hyphens
  filename = filename.replace(/[^a-zA-Z0-9-]/g, "");

  return filename || "chunk";
}

export default function autoChunkNameLoader(this: Rspack.LoaderContext, source: string): string {
  // Skip if no dynamic imports
  if (!source.includes("import(")) {
    return source;
  }

  // Regex to match dynamic imports without webpackChunkName
  // Matches: import("path") or import('path') or import(`path`)
  // But NOT: import(/* webpackChunkName: ... */ "path")
  const dynamicImportRegex = /import\s*\(\s*(?!\/\*[\s\S]*?webpackChunkName[\s\S]*?\*\/)(['"`])([^'"`]+)\1\s*\)/g;

  let result = source;
  let match: RegExpExecArray | null;

  // Use a different approach to avoid infinite loops with regex replacement
  const replacements: Array<{ original: string; replacement: string }> = [];

  // Reset lastIndex
  dynamicImportRegex.lastIndex = 0;

  while ((match = dynamicImportRegex.exec(source)) !== null) {
    const fullMatch = match[0];
    const quote = match[1];
    const importPath = match[2];

    // Skip if it already has any magic comment
    if (fullMatch.includes("/*")) {
      continue;
    }

    const chunkName = extractChunkName(importPath);
    const replacement = `import(/* webpackChunkName: "${chunkName}" */ ${quote}${importPath}${quote})`;

    replacements.push({ original: fullMatch, replacement });
  }

  // Apply replacements
  for (const { original, replacement } of replacements) {
    result = result.replace(original, replacement);
  }

  return result;
}

export const raw = false;
