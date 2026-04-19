/* eslint-disable max-lines */
/**
 * @file RSC Transform Plugin
 * Main transform plugin for client/server module detection and transformation
 */

import { walk } from "estree-walker";
import { createFilter, transformWithEsbuild, parseAstAsync } from "vite";

import { detectUseClientDirective, detectUseServerDirective, detectInlineUseServerDirective, isRscEligibleFile } from "../directives";
import {
  parseModuleExports,
  generateClientReferenceProxyCode,
  findInlineServerActions,
  transformServerActionServer,
  transformDirectiveProxyExport,
} from "../transforms";
import { initLexer, generateModuleId } from "../utils";

import type { RscPluginManager } from "../manager";
import type { ClientModuleRegistry, ServerActionRegistry } from "../transforms";
import type { RscPluginOptions } from "../types";
import type { Program } from "estree";
import type { Plugin, ResolvedConfig, TransformResult } from "vite";

export interface TransformPluginContext {
  clientRegistry: ClientModuleRegistry;
  serverRegistry: ServerActionRegistry;
  clientModules: Set<string>;
  serverModules: Set<string>;
  /** Optional manager for build orchestration */
  manager?: RscPluginManager;
}

async function findInvalidServerHook(code: string): Promise<string | null> {
  let ast: Program | null = null;
  try {
    ast = (await parseAstAsync(code)) as Program;
  } catch {
    return null;
  }

  const forbidden = new Set<string>([
    "useState",
    "useSingle",
    "useReducer",
    "useEffect",
    "useLayoutEffect",
    "useInsertionEffect",
    "useMemo",
    "useCallback",
    "useRef",
    "useImperativeHandle",
    "useDebugValue",
    "useDeferredValue",
    "useTransition",
    "useSyncExternalStore",
    "useId",
    "useContext",
    "useActionState",
    "useOptimistic",
  ]);

  let found: string | null = null;

  walk(ast, {
    enter(node) {
      if (node.type !== "CallExpression") return;

      const callee = node.callee;
      if (callee.type === "Identifier") {
        const name = callee.name;
        if (name !== "use" && (name.startsWith("use") || forbidden.has(name))) {
          found = name;
          this.skip();
        }
      } else if (callee.type === "MemberExpression" && !callee.computed && callee.property.type === "Identifier") {
        const name = callee.property.name;
        if (name !== "use" && (name.startsWith("use") || forbidden.has(name))) {
          found = name;
          this.skip();
        }
      }
    },
  });

  return found;
}

/**
 * Create the RSC transform plugin
 */
export function createTransformPlugin(options: RscPluginOptions, context: TransformPluginContext): Plugin {
  const include = options.include ?? /\.[tj]sx?$/;
  const exclude = options.exclude ?? /node_modules/;
  const filter = createFilter(include, exclude);

  let config: ResolvedConfig;
  let projectRoot = process.cwd();
  let isBuild = false;

  // Get manager from context for build orchestration
  const manager = context.manager;

  return {
    name: "vite:my-react-rsc-transform",
    enforce: "pre",

    async configResolved(resolvedConfig) {
      config = resolvedConfig;
      projectRoot = config.root;
      isBuild = config.command === "build";

      // Initialize es-module-lexer for better performance
      await initLexer();
    },

    async transform(code, id, transformOptions): Promise<TransformResult | null> {
      const [filepath, rawQuery] = id.split("?");
      const isOriginal = rawQuery?.includes("rsc-original");

      // Skip non-eligible files
      if (!filter(filepath) || !isRscEligibleFile(filepath)) {
        return null;
      }

      // If explicit original request, skip RSC transforms
      if (isOriginal) {
        return null;
      }

      const moduleId = generateModuleId(filepath, projectRoot);

      // Environment detection for client module transformation
      //
      // For "use client" modules:
      // - RSC environment: Transform to proxy
      // - SSR flag set (legacy/dev mode): Transform to proxy (SSR uses ?rsc-original to bypass)
      // - Client/browser: Keep original
      //
      // For "use server" modules:
      // - Server-side (RSC/SSR): Register actions
      // - Client: Generate proxy
      const envName = this.environment?.name;
      const isRscEnv = envName === "rsc";
      const isSsrEnv = envName === "ssr";
      const ssrFlag = Boolean(transformOptions?.ssr) || Boolean((this as { ssr?: boolean }).ssr);

      // Proxy client modules:
      // - In RSC environment (build): always proxy
      // - In dev mode with ssrFlag: proxy (SSR rendering uses ?rsc-original to bypass)
      // - In build mode SSR environment: DON'T proxy (need real code for SSR)
      const isBuildModeSsr = isBuild && isSsrEnv;
      const shouldProxyClientModules = isRscEnv || (ssrFlag && !isBuildModeSsr);

      // For "use server" modules, both RSC and SSR need to register actions
      const isServerForServerModules = isRscEnv || isSsrEnv || ssrFlag;

      // During scan builds, just register modules without full transformation
      const isScanBuild = manager?.isScanBuild ?? false;

      const parseCode = await getParseCode(code, filepath);

      if (!detectUseClientDirective(code)) {
        const hook = await findInvalidServerHook(parseCode);
        if (hook) {
          throw new Error(
            `[@my-react/react-vite] Server Component "${filepath}" uses "${hook}". ` +
              `Hooks are not allowed in Server Components. Add "use client" or remove the hook.`
          );
        }
      }

      // Check for "use client" directive
      if (detectUseClientDirective(code)) {
        context.clientModules.add(moduleId);

        const { exports, hasDefaultExport } = await parseModuleExports(parseCode);

        // Register with manager if available
        if (manager) {
          manager.registerClientReference(moduleId, {
            importId: moduleId,
            exportNames: hasDefaultExport ? ["default", ...exports.filter((e) => e !== "default")] : exports,
          });
        }

        // Register with local registry
        context.clientRegistry.register(moduleId, {
          moduleId,
          exports,
          hasDefaultExport,
        });

        // During scan build, let scan-strip plugin handle code stripping
        // We only register the module but don't transform
        if (isScanBuild) {
          return null;
        }

        // Only RSC environment transforms client modules to proxies
        // SSR and Client environments keep original code
        if (shouldProxyClientModules) {
          return transformClientModule(parseCode, moduleId, context.clientRegistry);
        }

        return null;
      }

      // Check for "use server" directive at top level
      if (detectUseServerDirective(code)) {
        context.serverModules.add(moduleId);

        // During scan build, just register without transformation
        // Let scan-strip plugin handle code stripping to preserve imports
        if (isScanBuild) {
          const ast = (await parseAstAsync(parseCode)) as Program;
          const result = transformDirectiveProxyExport(ast, {
            directive: "use server",
            code: parseCode,
            runtime: (_name) => `null`,
            rejectNonAsyncFunction: false,
          });

          if (result) {
            for (const action of result.exportNames) {
              context.serverRegistry.register(moduleId, action);
            }
            if (manager) {
              manager.registerServerReference(moduleId, result.exportNames);
            }
          }

          return null;
        }

        return transformServerModule(parseCode, code, moduleId, context.serverRegistry, isServerForServerModules, manager);
      }

      // Check for inline "use server" in component files
      if (detectInlineUseServerDirective(code)) {
        if (!isServerForServerModules) {
          return null;
        }

        // During scan build, skip inline action transformation
        if (isScanBuild) {
          return null;
        }

        return await transformInlineServerActions(code, parseCode, moduleId, context.serverRegistry, manager);
      }

      return null;
    },

    generateBundle(_options, bundle) {
      if (!isBuild) {
        return;
      }

      // Skip manifest generation during scan builds
      if (manager?.isScanBuild) {
        return;
      }

      // Store bundle in manager if available
      if (manager && this.environment?.name) {
        manager.bundles[this.environment.name] = bundle;
      }

      // Generate manifests based on environment
      const envName = this.environment?.name;
      const base = config?.base ?? "/";

      // Generate client manifest during client build
      if (envName === "client" || (!envName && !config.build?.ssr)) {
        // Use manager data for proper chunk tracking
        const clientManifest: Record<string, { id: string; name: string; chunks: string[]; referenceKey: string }> = {};

        if (manager) {
          for (const [moduleId, meta] of Object.entries(manager.clientReferenceMetaMap)) {
            const exports = meta.renderedExports.length > 0 ? meta.renderedExports : meta.exportNames;

            for (const exportName of exports) {
              const key = `${moduleId}#${exportName}`;
              const chunkId = meta.groupChunkId;
              let chunks: string[] = [];

              if (chunkId && bundle[chunkId]) {
                const chunk = bundle[chunkId];
                if (chunk.type === "chunk") {
                  chunks = [`${base}${chunk.fileName}`];
                }
              } else {
                // Find main entry chunk
                for (const output of Object.values(bundle)) {
                  if (output.type === "chunk" && (output as { isEntry?: boolean }).isEntry) {
                    chunks = [`${base}${output.fileName}`];
                    break;
                  }
                }
              }

              clientManifest[key] = {
                id: moduleId,
                name: exportName,
                chunks,
                referenceKey: meta.referenceKey,
              };
            }
          }
        } else {
          // Fallback to registry if no manager
          const registryManifest = context.clientRegistry.generateManifest();
          Object.assign(clientManifest, registryManifest);
        }

        this.emitFile({
          type: "asset",
          fileName: "client-manifest.json",
          source: JSON.stringify(clientManifest, null, 2),
        });
      }

      // Generate server action manifest during RSC or SSR build
      if (envName === "rsc" || envName === "ssr" || (!envName && config.build?.ssr)) {
        // Use manager data for proper reference keys
        const serverManifest: Record<string, { id: string; name: string; moduleId: string; referenceKey: string }> = {};

        if (manager) {
          for (const [moduleId, meta] of Object.entries(manager.serverReferenceMetaMap)) {
            for (const name of meta.exportNames) {
              const actionId = `${moduleId}#${name}`;
              serverManifest[actionId] = {
                id: actionId,
                name,
                moduleId,
                referenceKey: meta.referenceKey,
              };
            }
          }
        } else {
          // Fallback to registry
          const registryManifest = context.serverRegistry.generateManifest();
          Object.assign(serverManifest, registryManifest);
        }

        this.emitFile({
          type: "asset",
          fileName: "server-manifest.json",
          source: JSON.stringify(serverManifest, null, 2),
        });
      }
    },
  };
}

/**
 * Transform a "use client" module into a client reference proxy
 */
async function transformClientModule(code: string, moduleId: string, registry: ClientModuleRegistry): Promise<TransformResult> {
  const { exports, hasDefaultExport } = await parseModuleExports(code);

  registry.register(moduleId, {
    moduleId,
    exports,
    hasDefaultExport,
  });

  const proxyCode = generateClientReferenceProxyCode(moduleId, exports, hasDefaultExport);

  return {
    code: proxyCode,
    map: null,
  };
}

/**
 * Transform a "use server" module to register server actions
 */
async function transformServerModule(
  parseCode: string,
  originalCode: string,
  moduleId: string,
  registry: ServerActionRegistry,
  isServer: boolean,
  manager?: RscPluginManager
): Promise<TransformResult> {
  const ast = (await parseAstAsync(parseCode)) as Program;

  if (isServer) {
    const result = transformServerActionServer(parseCode, ast, {
      runtime: (value, name) => `__registerServerReference__(${value}, ${JSON.stringify(`${moduleId}#${name}`)}, ${JSON.stringify(name)})`,
      rejectNonAsyncFunction: false,
    });

    const exportNames = "exportNames" in result ? result.exportNames : result.names;
    for (const action of exportNames) {
      registry.register(moduleId, action, true);
    }

    // Register with manager if available
    if (manager) {
      manager.registerServerReference(moduleId, exportNames);
    }

    const code = `import { registerServerReference as __registerServerReference__ } from "@my-react/react-server/server";\n${result.output.toString()}`;
    return { code, map: null };
  }

  const proxyResult = transformDirectiveProxyExport(ast, {
    directive: "use server",
    code: parseCode,
    runtime: (name) => `__createServerActionReference__(${JSON.stringify(`${moduleId}#${name}`)})`,
    rejectNonAsyncFunction: true,
  });

  if (!proxyResult) {
    return { code: parseCode, map: null };
  }

  for (const action of proxyResult.exportNames) {
    registry.register(moduleId, action);
  }

  // Register with manager if available
  if (manager) {
    manager.registerServerReference(moduleId, proxyResult.exportNames);
  }

  const proxyCode = `import { createServerActionReference as __createServerActionReference__ } from "@my-react/react-server/client";\n${proxyResult.output.toString()}`;
  return { code: proxyCode, map: null };
}

/**
 * Transform inline server actions in a component file
 */
async function transformInlineServerActions(
  code: string,
  parseCode: string,
  moduleId: string,
  registry: ServerActionRegistry,
  manager?: RscPluginManager
): Promise<TransformResult> {
  const inlineActions = await findInlineServerActions(code, parseCode);

  if (inlineActions.length === 0) {
    return { code, map: null };
  }

  const ast = (await parseAstAsync(parseCode)) as Program;
  const result = transformServerActionServer(parseCode, ast, {
    runtime: (value, name) => `__registerServerReference__(${value}, ${JSON.stringify(`${moduleId}#${name}`)}, ${JSON.stringify(name)})`,
    rejectNonAsyncFunction: true,
  });

  const exportNames = "exportNames" in result ? result.exportNames : result.names;
  for (const action of exportNames) {
    registry.register(moduleId, action, true);
  }

  // Register with manager if available
  if (manager) {
    manager.registerServerReference(moduleId, exportNames);
  }

  const transformedCode = `import { registerServerReference as __registerServerReference__ } from "@my-react/react-server/server";\n${result.output.toString()}`;

  return {
    code: transformedCode,
    map: null,
  };
}

async function getParseCode(code: string, filepath: string): Promise<string> {
  if (!/\.[tj]sx?$/.test(filepath)) {
    return code;
  }

  const loader = filepath.endsWith(".tsx") ? "tsx" : filepath.endsWith(".ts") ? "ts" : filepath.endsWith(".jsx") ? "jsx" : "js";

  const result = await transformWithEsbuild(code, filepath, {
    loader,
    jsx: "automatic",
    target: "es2020",
  });

  return result.code;
}
