/**
 * Extract import statements that reference relative (local) paths.
 *
 * Converts named/default/namespace imports to side-effect-only imports
 * (`import './foo'`) to preserve webpack's dependency graph without
 * executing user code or pulling in external packages.
 *
 * This is critical for the MT layer: entry files like `index.ts` may not
 * contain `'main thread'` directives themselves, but they import `.tsx`
 * or `.ts` files that do. Without preserving these edges, webpack never
 * reaches the files with worklet registrations.
 *
 * Imports with `with { runtime: 'shared' }` are also skipped — these are
 * handled separately by `extractSharedImports()`.
 *
 * Commented-out imports and non-code assets (`.png`, `.css`, …) are ignored —
 * MT only needs JS/TS edges for worklet discovery.
 */

/** Relative imports that can carry `'main thread'` worklets. */
const CODE_MODULE_RE = /\.(?:[cm]?[jt]sx?)$/i;

function isCodeModuleSpecifier(specifier: string): boolean {
  // Extensionless (`./App`) or explicit JS/TS — keep for dep graph.
  // Assets (`.png`, `.css`, `.svg`, …) never contain worklet registrations.
  const bare = specifier.split("?")[0] ?? specifier;
  const last = bare.split("/").pop() ?? bare;
  if (!last.includes(".")) {
    return true;
  }
  return CODE_MODULE_RE.test(last);
}

/**
 * Strip `//` and `/* *\/` comments while preserving string/template literals,
 * so regex-based import extraction cannot pick up commented-out imports.
 */
export function stripComments(source: string): string {
  let result = "";
  let i = 0;

  while (i < source.length) {
    const ch = source[i] as string;
    const next = source[i + 1];

    // String / template literals — copy through with escapes.
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      result += quote;
      i += 1;
      while (i < source.length) {
        const c = source[i] as string;
        if (c === "\\") {
          result += c + (source[i + 1] ?? "");
          i += 2;
          continue;
        }
        result += c;
        i += 1;
        if (c === quote) {
          break;
        }
        // Template literals may contain ${...}; keep scanning until closing `.
        // Nested braces/strings inside ${} are rare for import lines; we only
        // need not to treat `//` inside templates as comments, which this does.
      }
      continue;
    }

    // Line comment
    if (ch === "/" && next === "/") {
      i += 2;
      while (i < source.length && source[i] !== "\n") {
        i += 1;
      }
      continue;
    }

    // Block comment
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) {
        // Keep newlines so line-oriented tools still see structure
        if (source[i] === "\n") {
          result += "\n";
        }
        i += 1;
      }
      i += 2; // skip */
      continue;
    }

    result += ch;
    i += 1;
  }

  return result;
}

export function extractLocalImports(source: string): string {
  const code = stripComments(source);
  const specifiers = new Set<string>();

  // Match 'from' clause with relative specifier: from './foo' or from "../bar"
  // but skip lines that contain `with {` (shared runtime imports).
  const fromRe = /from\s+['"](\.[^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = fromRe.exec(code)) !== null) {
    // Check if this import has `with {` attribute (shared runtime import)
    const lineStart = code.lastIndexOf("\n", match.index) + 1;
    const lineEnd = code.indexOf("\n", match.index);
    const line = code.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (/with\s*\{/.test(line)) {
      continue;
    }
    const specifier = match[1] as string;
    if (isCodeModuleSpecifier(specifier)) {
      specifiers.add(specifier);
    }
  }

  // Match bare side-effect imports: import './foo' or import "../bar"
  const bareRe = /import\s+['"](\.[^'"]+)['"]/g;
  while ((match = bareRe.exec(code)) !== null) {
    const specifier = match[1] as string;
    if (isCodeModuleSpecifier(specifier)) {
      specifiers.add(specifier);
    }
  }

  if (specifiers.size === 0) {
    return "";
  }

  return [...specifiers].map((s) => `import '${s}';`).join("\n");
}

/**
 * Keep allowlisted worklet package imports as side-effect stitches on MT so
 * app sources that `import { … } from '@lynx-js/gesture-runtime'` (etc.) still
 * pull those packages onto the MT layer after component bodies are stripped.
 * Prefer this over MT entry force-entry. Skips `import type`.
 */
export function extractWorkletPackageSideEffectImports(source: string, packages: readonly string[]): string {
  const code = stripComments(source);
  const wanted = new Set(packages);
  const found = new Set<string>();
  const re = /(?:^|[^\w.$])import\s+(?!type\b)(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(code)) !== null) {
    const spec = match[1] as string;
    if (wanted.has(spec)) {
      found.add(spec);
    }
  }
  if (found.size === 0) {
    return "";
  }
  return [...found].map((s) => `import '${s}';`).join("\n");
}

/**
 * Extract import statements with `with { runtime: 'shared' }` attributes.
 *
 * These imports reference modules whose code must be available on both
 * threads. The `with { runtime: 'shared' }` attribute is stripped and
 * the specifier is prefixed with `!!` (webpack inline loader syntax) to
 * skip all configured loaders — most importantly worklet-loader-mt,
 * which would otherwise strip the module's exports. rspack's native
 * TypeScript compilation still applies, so the shared module's code
 * is available as regular JS on the MT layer.
 */
export function extractSharedImports(source: string): string {
  const code = stripComments(source);
  // Match import statements containing `with { runtime: 'shared' }`.
  // SWC may reformat across multiple lines, so we use [\s\S]*? for the
  // attribute block.
  const re = /import\s+(.+?)\s+from\s+(['"])([^'"]+)\2\s*with\s*\{[\s\S]*?runtime:\s*['"]shared['"][\s\S]*?\}\s*;?/g;
  const imports: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(code)) !== null) {
    const specifiers = match[1] as string;
    const quote = match[2] as string;
    const modulePath = match[3] as string;
    // Use `!!` with explicit `builtin:swc-loader` to skip all configured
    // loaders (especially worklet-loader-mt) while keeping TS compilation.
    imports.push(`import ${specifiers} from ${quote}!!builtin:swc-loader!${modulePath}${quote};`);
  }
  return imports.join("\n");
}

/**
 * Extract registerWorkletInternal(...) calls from LEPUS output.
 *
 * The LEPUS output contains:
 * - import { loadWorkletRuntime } from "..."
 * - var loadWorkletRuntime = __loadWorkletRuntime;
 * - worklet object declarations
 * - loadWorkletRuntime(...) && registerWorkletInternal(type, hash, fn);
 *
 * Emit bare `registerWorkletInternal(...)` only — drop the
 * `loadWorkletRuntime(...) &&` guard from full LEPUS (see worklet-loader-mt).
 * Uses bracket-depth counting for nested braces in function bodies.
 */
export function extractRegistrations(lepusCode: string): string {
  const registrations: string[] = [];
  const marker = "registerWorkletInternal(";
  let searchFrom = 0;

  while (true) {
    const idx = lepusCode.indexOf(marker, searchFrom);
    if (idx === -1) {
      break;
    }

    // Find the end of the registerWorkletInternal(...) call using bracket counting
    let depth = 0;
    let i = idx + marker.length - 1; // position of the opening '('
    for (; i < lepusCode.length; i += 1) {
      if (lepusCode[i] === "(") {
        depth += 1;
      } else if (lepusCode[i] === ")") {
        depth -= 1;
        if (depth === 0) {
          break;
        }
      }
    }

    // Extract the full call including trailing semicolon
    let end = i + 1;
    if (end < lepusCode.length && lepusCode[end] === ";") {
      end += 1;
    }

    registrations.push(lepusCode.slice(idx, end));
    searchFrom = end;
  }

  return registrations.join("\n");
}
