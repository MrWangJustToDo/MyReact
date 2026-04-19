/**
 * @file RSC Cross-Environment Module Loading Plugin
 * Enables loading modules from other Vite environments (rsc, ssr, client)
 *
 * Provides:
 * - import.meta.viteRsc.loadModule<T>(env, entryName) - Load module from another environment
 * - import.meta.viteRsc.loadBootstrapScriptContent(entryName) - Get client bootstrap script
 */

import MagicString from "magic-string";
import path from "node:path";

import type { RscPluginManager } from "../manager";
import type { Plugin, TransformResult, ViteDevServer } from "vite";

/**
 * Marker for build-time replacement of cross-env imports
 */
const LOAD_MODULE_MARKER_START = "__my_react_rsc_load_module_start__:";
const LOAD_MODULE_MARKER_END = ":__my_react_rsc_load_module_end__";
const BOOTSTRAP_MARKER_START = "__my_react_rsc_bootstrap_start__:";
const BOOTSTRAP_MARKER_END = ":__my_react_rsc_bootstrap_end__";

/**
 * Create the cross-environment module loading plugin
 *
 * This enables `import.meta.viteRsc.loadModule(environment, entryName)` for
 * loading modules from other environments:
 *
 * - In dev mode: Uses Vite's environment runners
 * - In build mode: Rewrites to relative imports between output directories
 */
export function createCrossEnvPlugin(manager: RscPluginManager): Plugin[] {
  let server: ViteDevServer | undefined;

  return [
    {
      name: "vite:my-react-rsc-cross-env",
      enforce: "pre",

      configureServer(viteServer) {
        server = viteServer;

        // Set up global environment runner import function
        globalThis.__MY_REACT_ENVIRONMENT_RUNNER_IMPORT__ = async function (environmentName: string, id: string): Promise<unknown> {
          const environment = server?.environments[environmentName];
          if (!environment) {
            throw new Error(`[@my-react/react-vite] Unknown environment '${environmentName}'`);
          }

          // Check if environment is runnable
          if (!("runner" in environment) || typeof (environment as any).runner?.import !== "function") {
            throw new Error(`[@my-react/react-vite] Environment '${environmentName}' is not runnable`);
          }

          return (environment as any).runner.import(id);
        };
      },

      async transform(code, _id) {
        // Support both import.meta.viteRsc and import.meta.myReactRsc
        const hasLoadModule = code.includes(".loadModule") && (code.includes("import.meta.viteRsc") || code.includes("import.meta.myReactRsc"));
        const hasBootstrap = code.includes(".loadBootstrapScriptContent") && (code.includes("import.meta.viteRsc") || code.includes("import.meta.myReactRsc"));

        if (!hasLoadModule && !hasBootstrap) {
          return null;
        }

        const s = new MagicString(code);

        // Match import.meta.viteRsc.loadModule or import.meta.myReactRsc.loadModule
        // With optional type parameter: loadModule<Type>("env", "entry")
        const loadModuleRegex = /import\.meta\.(?:viteRsc|myReactRsc)\.loadModule(?:<[^>]+>)?\(\s*(['"])([^'"]+)\1\s*(?:,\s*(['"])([^'"]+)\3)?\s*\)/g;

        let match;
        while ((match = loadModuleRegex.exec(code)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          const environmentName = match[2];
          const entryName = match[4];

          let replacement: string;

          if (this.environment?.mode === "dev" && server) {
            // Dev mode: use runner import
            const environment = server.environments[environmentName];
            if (!environment) {
              this.error(`[@my-react/react-vite] Unknown environment '${environmentName}'`);
              continue;
            }

            const source = getEntrySource(environment.config as { build?: { rollupOptions?: { input?: unknown } } }, entryName);
            const resolved = await environment.pluginContainer.resolveId(source);

            if (!resolved) {
              this.error(`[@my-react/react-vite] Failed to resolve entry '${source}'`);
              continue;
            }

            replacement = `globalThis.__MY_REACT_ENVIRONMENT_RUNNER_IMPORT__(${JSON.stringify(environmentName)}, ${JSON.stringify(resolved.id)})`;
          } else {
            // Build mode: emit a marker to be replaced in renderChunk
            const marker = {
              fromEnv: this.environment?.name ?? "unknown",
              toEnv: environmentName,
              targetFileName: `${entryName || "index"}.js`,
            };

            replacement = JSON.stringify(`${LOAD_MODULE_MARKER_START}${JSON.stringify(marker)}${LOAD_MODULE_MARKER_END}`);
          }

          s.update(start, end, replacement);
        }

        // Match import.meta.viteRsc.loadBootstrapScriptContent or import.meta.myReactRsc.loadBootstrapScriptContent
        const bootstrapRegex = /import\.meta\.(?:viteRsc|myReactRsc)\.loadBootstrapScriptContent\(\s*(?:(['"])([^'"]+)\1)?\s*\)/g;

        while ((match = bootstrapRegex.exec(code)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          const entryName = match[2] || "index";

          let replacement: string;

          if (this.environment?.mode === "dev" && server) {
            // Dev mode: return empty string, Vite handles module loading
            replacement = `""`;
          } else {
            // Build mode: emit a marker to be replaced in renderChunk
            const marker = {
              entryName,
            };

            replacement = JSON.stringify(`${BOOTSTRAP_MARKER_START}${JSON.stringify(marker)}${BOOTSTRAP_MARKER_END}`);
          }

          s.update(start, end, replacement);
        }

        if (s.hasChanged()) {
          const result: TransformResult = {
            code: s.toString(),
            map: s.generateMap({ hires: "boundary" }) as TransformResult["map"],
          };
          return result;
        }

        return null;
      },

      renderChunk(code, _chunk) {
        const hasLoadModule = code.includes(LOAD_MODULE_MARKER_START);
        const hasBootstrap = code.includes(BOOTSTRAP_MARKER_START);

        if (!hasLoadModule && !hasBootstrap) {
          return null;
        }

        const s = new MagicString(code);

        // Handle loadModule markers
        if (hasLoadModule) {
          const loadModuleRegex = new RegExp(`['"\`]${escapeRegex(LOAD_MODULE_MARKER_START)}([\\s\\S]*?)${escapeRegex(LOAD_MODULE_MARKER_END)}['"\`]`, "g");

          let match;
          while ((match = loadModuleRegex.exec(code)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            try {
              const markerData = JSON.parse(match[1]);
              const { fromEnv, toEnv, targetFileName } = markerData;

              const fromOutDir = manager.config.environments?.[fromEnv]?.build.outDir ?? "dist";
              const toOutDir = manager.config.environments?.[toEnv]?.build.outDir ?? "dist";

              // Calculate relative path from current chunk to target entry
              const currentChunkDir = path.join(fromOutDir, path.dirname(_chunk.fileName));
              const targetPath = path.join(toOutDir, targetFileName);
              let relativePath = path.relative(currentChunkDir, targetPath);

              // Ensure it starts with ./
              if (!relativePath.startsWith(".")) {
                relativePath = "./" + relativePath;
              }

              // Normalize path separators
              relativePath = relativePath.replace(/\\/g, "/");

              const replacement = `(import(${JSON.stringify(relativePath)}))`;
              s.update(start, end, replacement);
            } catch {
              continue;
            }
          }
        }

        // Handle bootstrap markers
        if (hasBootstrap) {
          const bootstrapRegex = new RegExp(`['"\`]${escapeRegex(BOOTSTRAP_MARKER_START)}([\\s\\S]*?)${escapeRegex(BOOTSTRAP_MARKER_END)}['"\`]`, "g");

          let match;
          while ((match = bootstrapRegex.exec(code)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            try {
              const markerData = JSON.parse(match[1]);
              const { entryName } = markerData;

              // Get the client entry URL from the assets manifest
              // const clientOutDir = manager.config.environments?.client?.build.outDir ?? "dist/client";
              const base = manager.config.base ?? "/";

              // Find the client entry chunk
              const entryFileName = `${entryName}.js`;
              const entryUrl = `${base}${entryFileName}`;

              // Generate bootstrap script content
              const bootstrapContent = `import(${JSON.stringify(entryUrl)})`;
              const replacement = JSON.stringify(bootstrapContent);
              s.update(start, end, replacement);
            } catch {
              continue;
            }
          }
        }

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: "boundary" }) as TransformResult["map"],
          };
        }

        return null;
      },
    },
  ];
}

/**
 * Get the entry source path for an environment
 */
function getEntrySource(config: { build?: { rollupOptions?: { input?: unknown } } }, entryName?: string): string {
  const input = config.build?.rollupOptions?.input;

  if (!input) {
    return entryName ? `./${entryName}` : "./index";
  }

  if (typeof input === "string") {
    return input;
  }

  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    const name = entryName || "index";
    return (input as Record<string, string>)[name] ?? `./${name}`;
  }

  return entryName ? `./${entryName}` : "./index";
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Declare the global function type
declare global {
  function __MY_REACT_ENVIRONMENT_RUNNER_IMPORT__(environmentName: string, id: string): Promise<unknown>;
}
