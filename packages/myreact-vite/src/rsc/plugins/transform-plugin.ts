/**
 * @file RSC Transform Plugin
 * Main transform plugin for client/server module detection and transformation
 */

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

import type { ClientModuleRegistry, ServerActionRegistry } from "../transforms";
import type { RscPluginOptions } from "../types";
import type { Plugin, ResolvedConfig, TransformResult } from "vite";

export interface TransformPluginContext {
  clientRegistry: ClientModuleRegistry;
  serverRegistry: ServerActionRegistry;
  clientModules: Set<string>;
  serverModules: Set<string>;
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

      const isServer = Boolean(transformOptions?.ssr) || Boolean((this as { ssr?: boolean }).ssr) || Boolean(isBuild && config.build?.ssr);

      const parseCode = await getParseCode(code, filepath);

      // Check for "use client" directive
      if (detectUseClientDirective(code)) {
        context.clientModules.add(moduleId);

        // On server builds (including dev SSR), transform to client reference proxy
        if (isServer) {
          return transformClientModule(parseCode, moduleId, context.clientRegistry);
        }

        // Mark as client module for manifest
        context.clientRegistry.register(moduleId, {
          moduleId,
          exports: [],
          hasDefaultExport: true,
        });

        return null;
      }

      // Check for "use server" directive at top level
      if (detectUseServerDirective(code)) {
        context.serverModules.add(moduleId);
        return transformServerModule(parseCode, code, moduleId, context.serverRegistry, isServer);
      }

      // Check for inline "use server" in component files
      if (detectInlineUseServerDirective(code)) {
        if (!isServer) {
          return null;
        }
        return await transformInlineServerActions(code, parseCode, moduleId, context.serverRegistry);
      }

      return null;
    },

    generateBundle() {
      // Generate client manifest
      if (isBuild && config.build?.ssr) {
        const clientManifest = context.clientRegistry.generateManifest();
        this.emitFile({
          type: "asset",
          fileName: "client-manifest.json",
          source: JSON.stringify(clientManifest, null, 2),
        });
      }

      // Generate server action manifest
      if (isBuild) {
        const serverManifest = context.serverRegistry.generateManifest();
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
  isServer: boolean
): Promise<TransformResult> {
  const ast = (await parseAstAsync(parseCode)) as unknown as import("estree").Program;

  if (isServer) {
    const result = transformServerActionServer(parseCode, ast, {
      runtime: (value, name) => `__registerServerReference__(${value}, ${JSON.stringify(`${moduleId}#${name}`)}, ${JSON.stringify(name)})`,
      rejectNonAsyncFunction: true,
    });

    const exportNames = "exportNames" in result ? result.exportNames : result.names;
    for (const action of exportNames) {
      registry.register(moduleId, action, true);
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

  const proxyCode = `import { createServerActionReference as __createServerActionReference__ } from "@my-react/react-server/client";\n${proxyResult.output.toString()}`;
  return { code: proxyCode, map: null };
}

/**
 * Transform inline server actions in a component file
 */
async function transformInlineServerActions(code: string, parseCode: string, moduleId: string, registry: ServerActionRegistry): Promise<TransformResult> {
  const inlineActions = await findInlineServerActions(code, parseCode);

  if (inlineActions.length === 0) {
    return { code, map: null };
  }

  const ast = (await parseAstAsync(parseCode)) as unknown as import("estree").Program;
  const result = transformServerActionServer(parseCode, ast, {
    runtime: (value, name) => `__registerServerReference__(${value}, ${JSON.stringify(`${moduleId}#${name}`)}, ${JSON.stringify(name)})`,
    rejectNonAsyncFunction: true,
  });

  const exportNames = "exportNames" in result ? result.exportNames : result.names;
  for (const action of exportNames) {
    registry.register(moduleId, action, true);
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
