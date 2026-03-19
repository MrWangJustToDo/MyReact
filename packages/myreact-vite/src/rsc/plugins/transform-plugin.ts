/**
 * @file RSC Transform Plugin
 * Main transform plugin for client/server module detection and transformation
 */

import { createFilter } from "vite";

import { detectUseClientDirective, detectUseServerDirective, detectInlineUseServerDirective, isRscEligibleFile } from "../directives";
import { parseModuleExports, generateClientReferenceProxyCode, parseServerActions, generateServerModuleCode, findInlineServerActions } from "../transforms";
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

    async transform(code, id): Promise<TransformResult | null> {
      const [filepath] = id.split("?");

      // Skip non-eligible files
      if (!filter(filepath) || !isRscEligibleFile(filepath)) {
        return null;
      }

      const moduleId = generateModuleId(filepath, projectRoot);

      // Check for "use client" directive
      if (detectUseClientDirective(code)) {
        context.clientModules.add(moduleId);

        // On server build, transform to client reference proxy
        if (isBuild && config.build?.ssr) {
          return transformClientModule(code, moduleId, context.clientRegistry);
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
        return transformServerModule(code, moduleId, context.serverRegistry);
      }

      // Check for inline "use server" in component files
      if (detectInlineUseServerDirective(code)) {
        return await transformInlineServerActions(code, moduleId, context.serverRegistry);
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
async function transformServerModule(code: string, moduleId: string, registry: ServerActionRegistry): Promise<TransformResult> {
  const actions = await parseServerActions(code);

  for (const action of actions) {
    registry.register(moduleId, action);
  }

  const transformedCode = generateServerModuleCode(code, moduleId, actions);

  return {
    code: transformedCode,
    map: null,
  };
}

/**
 * Transform inline server actions in a component file
 */
async function transformInlineServerActions(code: string, moduleId: string, registry: ServerActionRegistry): Promise<TransformResult> {
  const inlineActions = await findInlineServerActions(code);

  if (inlineActions.length === 0) {
    return { code, map: null };
  }

  let transformedCode = code;

  // Add import for server reference registration at the top
  const importStatement = `import { registerServerReference as __registerServerReference__ } from "@my-react/react-server/server";\n`;

  // Wrap each inline action with registration
  for (const action of inlineActions) {
    registry.register(moduleId, action.name, true);

    const actionId = `${moduleId}#${action.name}`;

    // Add a comment to mark the action for runtime registration
    transformedCode = transformedCode.replace(
      new RegExp(`(async\\s+function\\s+${action.name}|const\\s+${action.name}\\s*=\\s*async)`),
      `/* @__SERVER_ACTION__:${actionId} */ $1`
    );
  }

  transformedCode = importStatement + transformedCode;

  return {
    code: transformedCode,
    map: null,
  };
}
