/* eslint-disable max-lines */
/**
 * @file RSC Build Plugin
 * Multi-environment configuration and build orchestration for production builds
 */

import fs from "node:fs";
import path from "node:path";

import type { RscPluginManager, AssetDeps } from "../manager";
import type { Plugin, UserConfig, ViteBuilder } from "vite";

export interface BuildPluginOptions {
  /** Entry points for each environment */
  entries?: {
    rsc?: string;
    ssr?: string;
    client?: string;
  };
  /** Custom output directories */
  outDirs?: {
    rsc?: string;
    ssr?: string;
    client?: string;
  };
  /** Whether to enable SSR environment (default: true) */
  enableSsr?: boolean;
}

/**
 * Default resolve conditions for RSC environment
 */
const RSC_CONDITIONS = ["react-server", "node", "import"];

/**
 * Patterns for packages that should be externalized in RSC/SSR builds
 * Only externalize @my-react packages (react/react-dom are aliased to @my-react)
 */
const EXTERNAL_PACKAGE_PATTERNS = [/^@my-react\/react($|\/)/, /^@my-react\/react-dom($|\/)/, /^@my-react\/react-server($|\/)/];

/**
 * Check if a module ID should be externalized
 */
function isExternalModule(id: string): boolean {
  return EXTERNAL_PACKAGE_PATTERNS.some((pattern) => pattern.test(id));
}

/**
 * Alias configuration to map react -> @my-react/react
 */
const REACT_ALIASES = {
  react: "@my-react/react",
  "react/jsx-runtime": "@my-react/react/jsx-runtime",
  "react/jsx-dev-runtime": "@my-react/react/jsx-dev-runtime",
  "react-dom": "@my-react/react-dom",
  "react-dom/client": "@my-react/react-dom/client",
  "react-dom/server": "@my-react/react-dom/server",
};

/**
 * Packages that should NOT be externalized (bundled with output)
 */
const NO_EXTERNAL_PACKAGES = ["server-only", "client-only"];

/**
 * Create the RSC build configuration plugin
 *
 * This plugin:
 * 1. Configures multi-environment builds (rsc, ssr, client)
 * 2. Sets up the buildApp hook for orchestrating the 5-step build
 * 3. Manages assets between environments
 * 4. Tracks client reference chunks for manifest generation
 */
export function createBuildPlugin(manager: RscPluginManager, options: BuildPluginOptions = {}): Plugin[] {
  const enableSsr = options.enableSsr !== false;

  return [
    {
      name: "vite:my-react-rsc-build-config",
      enforce: "pre",

      config(userConfig, { command }): UserConfig | null {
        const rscOutDir = options.outDirs?.rsc ?? "dist/rsc";
        const ssrOutDir = options.outDirs?.ssr ?? "dist/ssr";
        const clientOutDir = options.outDirs?.client ?? "dist/client";

        // Base environment configuration (applies to both dev and build)
        const baseConfig: UserConfig = {
          appType: userConfig.appType ?? "custom",

          // Top-level aliases apply to all environments
          resolve: {
            alias: REACT_ALIASES,
          },

          environments: {
            // RSC environment - runs server components with react-server condition
            rsc: {
              resolve: {
                conditions: RSC_CONDITIONS,
                noExternal: NO_EXTERNAL_PACKAGES,
              },
              ...(command === "build"
                ? {
                    build: {
                      outDir: rscOutDir,
                      copyPublicDir: false,
                      emitAssets: true,
                      rollupOptions: {
                        input: options.entries?.rsc ? { index: options.entries.rsc } : undefined,
                        external: isExternalModule,
                      },
                    },
                  }
                : {}),
            },

            // SSR environment - renders HTML from RSC stream
            // SSR externalizes @my-react packages (CJS) - client components bundled as separate entries
            ...(enableSsr
              ? {
                  ssr: {
                    resolve: {
                      noExternal: NO_EXTERNAL_PACKAGES,
                    },
                    ...(command === "build"
                      ? {
                          build: {
                            outDir: ssrOutDir,
                            copyPublicDir: false,
                            rollupOptions: {
                              input: options.entries?.ssr ? { index: options.entries.ssr } : undefined,
                              external: isExternalModule,
                            },
                          },
                        }
                      : {}),
                  },
                }
              : {}),

            // Client environment - browser bundle
            client: {
              ...(command === "build"
                ? {
                    build: {
                      outDir: clientOutDir,
                      rollupOptions: {
                        input: options.entries?.client ? { index: options.entries.client } : undefined,
                      },
                    },
                  }
                : {}),
            },
          },
        };

        // Add build orchestration only for build command
        if (command === "build") {
          baseConfig.builder = {
            sharedPlugins: true,
            sharedConfigBuild: true,
            async buildApp(builder) {
              await orchestrateBuild(builder, manager, { enableSsr });
            },
          };
        }

        return baseConfig;
      },

      configResolved(config) {
        manager.config = config;

        // Ensure outDir is fully resolved
        for (const env of Object.values(config.environments ?? {})) {
          if (env?.build?.outDir) {
            env.build.outDir = path.resolve(config.root, env.build.outDir);
          }
        }
      },
    },
    // Chunk tracking plugin - tracks which chunks contain which client references
    {
      name: "vite:my-react-rsc-chunk-tracker",
      apply: "build",

      generateBundle(_, bundle) {
        const envName = this.environment?.name;

        // Skip scan builds
        if (manager.isScanBuild) return;

        if (envName === "rsc") {
          // Track which RSC chunks import which client references
          for (const [_chunkId, output] of Object.entries(bundle)) {
            if (output.type !== "chunk") continue;

            const chunk = output as { type: "chunk"; fileName: string; modules: Record<string, unknown> };

            // Check each module in this chunk
            for (const moduleId of Object.keys(chunk.modules)) {
              // Normalize the module ID for comparison
              const normalizedId = normalizeModuleId(moduleId, manager.config.root);

              // Check if this module is a client reference
              const meta = manager.clientReferenceMetaMap[normalizedId];
              if (meta) {
                meta.serverChunk = chunk.fileName;
              }
            }
          }
        }

        if (envName === "client") {
          // Track which client chunks contain which client modules
          for (const [chunkId, output] of Object.entries(bundle)) {
            if (output.type !== "chunk") continue;

            const chunk = output as { type: "chunk"; fileName: string; modules: Record<string, unknown> };

            for (const moduleId of Object.keys(chunk.modules)) {
              const normalizedId = normalizeModuleId(moduleId, manager.config.root);

              // Check if this module is a client reference
              const meta = manager.clientReferenceMetaMap[normalizedId];
              if (meta) {
                meta.groupChunkId = chunkId;
              }
            }
          }

          // Store a copy of bundle for manifest generation and HTML emission
          // We need to copy because Rollup may modify the bundle after generateBundle
          manager.bundles[envName] = { ...bundle };
        }

        if (envName === "ssr") {
          // Store SSR bundle for manifest generation
          manager.bundles[envName] = { ...bundle };
        }
      },
    },
  ];
}

/**
 * Normalize module ID for comparison
 */
function normalizeModuleId(moduleId: string, root: string): string {
  // Remove query strings
  let normalized = moduleId.split("?")[0];

  // Convert absolute path to relative
  if (normalized.startsWith(root)) {
    normalized = "/" + path.relative(root, normalized).replace(/\\/g, "/");
  }

  // Handle paths starting with /src or similar
  if (!normalized.startsWith("/") && !normalized.startsWith(".")) {
    normalized = "/" + normalized;
  }

  return normalized;
}

/**
 * Orchestrate the multi-phase RSC build
 *
 * Build order with SSR (5 steps):
 * 1. RSC scan - discover "use client" boundaries
 * 2. SSR scan - discover "use server" boundaries
 * 3. RSC real - build server components
 * 4. Client - build client bundle with tree-shaking
 * 5. SSR real - final SSR build with complete manifests
 *
 * Build order without SSR (4 steps):
 * 1. RSC scan - discover "use client" boundaries
 * 2. Client scan - discover "use server" boundaries
 * 3. RSC real - build server components
 * 4. Client real - build client bundle
 */
async function orchestrateBuild(builder: ViteBuilder, manager: RscPluginManager, options: { enableSsr: boolean }): Promise<void> {
  const { enableSsr } = options;
  const logger = builder.config.logger;

  const logStep = (msg: string) => {
    logger.info(`\x1b[34m${msg}\x1b[0m`);
  };

  const rscEnv = builder.environments.rsc;
  const clientEnv = builder.environments.client;
  const ssrEnv = enableSsr ? builder.environments.ssr : undefined;

  if (!rscEnv) {
    throw new Error("[@my-react/react-vite] RSC environment not configured");
  }
  if (!clientEnv) {
    throw new Error("[@my-react/react-vite] Client environment not configured");
  }

  // Handle RSC outDir potentially being inside SSR outDir
  const rscOutDir = rscEnv.config.build.outDir;
  const ssrOutDir = ssrEnv?.config.build.outDir ?? "";
  const rscInsideSsr = ssrEnv && path.normalize(rscOutDir).startsWith(path.normalize(ssrOutDir) + path.sep);

  const tempRscOutDir = path.join(builder.config.root, "node_modules", ".my-react-rsc-temp", "rsc");

  if (enableSsr && ssrEnv) {
    // 5-step build with SSR
    manager.isScanBuild = true;
    rscEnv.config.build.write = false;
    ssrEnv.config.build.write = false;

    logStep("[1/5] Analyzing client references (RSC scan)...");
    await builder.build(rscEnv);

    logStep("[2/5] Analyzing server references (SSR scan)...");
    await builder.build(ssrEnv);

    manager.isScanBuild = false;
    rscEnv.config.build.write = true;
    ssrEnv.config.build.write = true;

    // After scan builds, inject server action modules as additional RSC entries
    // This ensures server actions are bundled and registerServerReference calls are executed
    const serverActionModules = Object.keys(manager.serverReferenceMetaMap);
    if (serverActionModules.length > 0) {
      const existingInput = rscEnv.config.build.rollupOptions?.input;
      const currentInputs: Record<string, string> = {};

      if (typeof existingInput === "string") {
        currentInputs["index"] = existingInput;
      } else if (Array.isArray(existingInput)) {
        existingInput.forEach((input, i) => {
          currentInputs[`entry${i}`] = input;
        });
      } else if (existingInput && typeof existingInput === "object") {
        Object.assign(currentInputs, existingInput);
      }

      // Add each server action module as an additional entry
      serverActionModules.forEach((moduleId, i) => {
        // Convert /src/... path to relative path
        const relativePath = moduleId.startsWith("/") ? `.${moduleId}` : moduleId;
        currentInputs[`__server_action_${i}`] = path.resolve(builder.config.root, relativePath);
      });

      rscEnv.config.build.rollupOptions = {
        ...rscEnv.config.build.rollupOptions,
        input: currentInputs,
      };
    }

    logStep("[3/5] Building RSC environment...");
    await builder.build(rscEnv);

    // Evacuate RSC output if inside SSR dir
    if (rscInsideSsr) {
      if (fs.existsSync(tempRscOutDir)) {
        fs.rmSync(tempRscOutDir, { recursive: true });
      }
      fs.mkdirSync(path.dirname(tempRscOutDir), { recursive: true });
      if (fs.existsSync(rscOutDir)) {
        fs.renameSync(rscOutDir, tempRscOutDir);
      }
    }

    manager.stabilize();

    logStep("[4/5] Building client environment...");
    await builder.build(clientEnv);

    // Generate index.html with RSC config
    await emitIndexHtml(builder, manager, clientEnv);

    // Add client component modules as additional SSR entries
    // This ensures client components can be rendered during SSR
    const clientModules = Object.keys(manager.clientReferenceMetaMap);
    if (clientModules.length > 0) {
      const existingInput = ssrEnv.config.build.rollupOptions?.input;
      const currentInputs: Record<string, string> = {};

      if (typeof existingInput === "string") {
        currentInputs["index"] = existingInput;
      } else if (Array.isArray(existingInput)) {
        existingInput.forEach((input, i) => {
          currentInputs[`entry${i}`] = input;
        });
      } else if (existingInput && typeof existingInput === "object") {
        Object.assign(currentInputs, existingInput);
      }

      // Add each client module as an additional entry
      clientModules.forEach((moduleId, i) => {
        const relativePath = moduleId.startsWith("/") ? `.${moduleId}` : moduleId;
        currentInputs[`__client_ssr_${i}`] = path.resolve(builder.config.root, relativePath);
      });

      ssrEnv.config.build.rollupOptions = {
        ...ssrEnv.config.build.rollupOptions,
        input: currentInputs,
      };
    }

    logStep("[5/5] Building SSR environment...");
    await builder.build(ssrEnv);

    // Generate SSR client manifest for runtime module loading
    if (clientModules.length > 0) {
      const ssrClientManifest: Record<string, { id: string; name: string; ssrModule: string }> = {};
      const ssrBundle = manager.bundles["ssr"];

      if (ssrBundle) {
        for (const [_chunkId, output] of Object.entries(ssrBundle)) {
          if (output.type !== "chunk") continue;
          const chunk = output as { type: "chunk"; fileName: string; modules: Record<string, unknown>; isEntry?: boolean };
          if (!chunk.isEntry) continue;

          for (const moduleId of Object.keys(chunk.modules)) {
            const normalizedId = normalizeModuleId(moduleId, manager.config.root);
            const meta = manager.clientReferenceMetaMap[normalizedId];
            if (meta) {
              for (const exportName of meta.exportNames) {
                const key = `${normalizedId}#${exportName}`;
                ssrClientManifest[key] = {
                  id: normalizedId,
                  name: exportName,
                  ssrModule: chunk.fileName,
                };
              }
            }
          }
        }
      }

      // Write SSR client manifest
      const ssrOutDir = ssrEnv.config.build.outDir;
      const manifestPath = path.join(ssrOutDir, "ssr-client-manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(ssrClientManifest, null, 2));
    }

    // Restore RSC output
    if (rscInsideSsr && fs.existsSync(tempRscOutDir)) {
      if (fs.existsSync(rscOutDir)) {
        fs.rmSync(rscOutDir, { recursive: true });
      }
      fs.mkdirSync(path.dirname(rscOutDir), { recursive: true });
      fs.renameSync(tempRscOutDir, rscOutDir);
    }

    manager.writeAssetsManifest(["ssr", "rsc"]);
  } else {
    // 4-step build without SSR
    manager.isScanBuild = true;
    rscEnv.config.build.write = false;
    clientEnv.config.build.write = false;

    logStep("[1/4] Analyzing client references (RSC scan)...");
    await builder.build(rscEnv);

    logStep("[2/4] Analyzing server references (Client scan)...");
    await builder.build(clientEnv);

    manager.isScanBuild = false;
    rscEnv.config.build.write = true;
    clientEnv.config.build.write = true;

    logStep("[3/4] Building RSC environment...");
    await builder.build(rscEnv);

    manager.stabilize();

    logStep("[4/4] Building client environment...");
    await builder.build(clientEnv);

    // Generate index.html with RSC config
    await emitIndexHtml(builder, manager, clientEnv);

    manager.writeAssetsManifest(["rsc"]);
  }
}

/**
 * Emit index.html with RSC config and client entry script
 */
async function emitIndexHtml(builder: ViteBuilder, manager: RscPluginManager, clientEnv: { config: { build: { outDir: string } } }): Promise<void> {
  const root = manager.config?.root || builder.config.root;
  const clientOutDir = clientEnv.config.build.outDir;
  const base = manager.config?.base ?? builder.config.base ?? "/";

  // Read source index.html
  const sourceHtmlPath = path.join(root, "index.html");
  let html = "";

  if (fs.existsSync(sourceHtmlPath)) {
    html = fs.readFileSync(sourceHtmlPath, "utf-8");
  } else {
    // Generate a basic HTML template if none exists
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyReact RSC</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  // Find the client entry chunk
  const bundle = manager.bundles["client"];
  let entryScript = "";
  let entryCss: string[] = [];

  if (bundle) {
    for (const output of Object.values(bundle)) {
      if (output.type === "chunk" && (output as { isEntry?: boolean }).isEntry) {
        entryScript = `${base}${output.fileName}`;
        const cssSet = (output as { viteMetadata?: { importedCss?: Set<string> } }).viteMetadata?.importedCss;
        if (cssSet) {
          entryCss = [...cssSet].map((c) => `${base}${c}`);
        }
        break;
      }
    }
  }

  // Generate full bootstrap script (same as transformIndexHtml in bootstrap-plugin)
  const rscEndpoint = manager.rscEndpoint ?? "/__rsc";
  const actionEndpoint = manager.actionEndpoint ?? "/__rsc_action";

  const bootstrapScript = `<script type="module">
// MyReact RSC Bootstrap
window.__MY_REACT_RSC_CONFIG__ = {
  rscEndpoint: ${JSON.stringify(rscEndpoint)},
  actionEndpoint: ${JSON.stringify(actionEndpoint)},
};

// RSC Stream Client (based on rsc-html-stream/client)
// Creates a ReadableStream from RSC payload injected by the server
(function() {
  const encoder = new TextEncoder();
  let streamController;

  window.__MY_REACT_RSC_STREAM__ = new ReadableStream({
    start(controller) {
      if (typeof window === 'undefined') {
        return;
      }
      const handleChunk = (chunk) => {
        if (typeof chunk === 'string') {
          controller.enqueue(encoder.encode(chunk));
        } else {
          controller.enqueue(chunk);
        }
      };
      // Initialize or use existing flight data array
      window.__FLIGHT_DATA = window.__FLIGHT_DATA || [];
      window.__FLIGHT_DATA.forEach(handleChunk);
      // Override push to handle new chunks as they arrive
      window.__FLIGHT_DATA.push = (chunk) => {
        handleChunk(chunk);
      };
      streamController = controller;
    },
  });

  // Close the stream when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      streamController?.close();
    });
  } else {
    streamController?.close();
  }
})();
</script>`;

  // Inject CSS links
  const cssLinks = entryCss.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n");

  // Inject entry script
  const scriptTag = entryScript ? `<script type="module" src="${entryScript}"></script>` : "";

  // Remove any existing script tags that reference src/entry-client
  html = html.replace(/<script[^>]*src="[^"]*entry-client[^"]*"[^>]*><\/script>/g, "");

  // Inject bootstrap script into head (prepend for early initialization)
  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>\n${bootstrapScript}`);
  } else if (html.includes("<html>")) {
    html = html.replace("<html>", `<html>\n<head>${bootstrapScript}</head>`);
  }

  // Inject CSS links before </head>
  if (cssLinks && html.includes("</head>")) {
    html = html.replace("</head>", `${cssLinks}\n</head>`);
  }

  // Inject script before </body>
  if (html.includes("</body>")) {
    html = html.replace("</body>", `${scriptTag}\n</body>`);
  } else {
    html += scriptTag;
  }

  // Write to client output directory
  const resolvedOutDir = path.isAbsolute(clientOutDir) ? clientOutDir : path.join(root, clientOutDir);
  const outputHtmlPath = path.join(resolvedOutDir, "index.html");
  fs.mkdirSync(path.dirname(outputHtmlPath), { recursive: true });
  fs.writeFileSync(outputHtmlPath, html);
}

/**
 * Collect asset dependencies from a bundle
 */
export function collectAssetDeps(
  bundle: Record<string, { type: string; fileName: string; viteMetadata?: { importedCss?: Set<string>; importedAssets?: Set<string> } }>
): Record<string, { deps: AssetDeps }> {
  const result: Record<string, { deps: AssetDeps }> = {};

  for (const [chunkId, output] of Object.entries(bundle)) {
    if (output.type !== "chunk") continue;

    const css = [...(output.viteMetadata?.importedCss ?? [])];
    const js = [output.fileName];

    result[chunkId] = {
      deps: { js, css },
    };
  }

  return result;
}

/**
 * Convert asset deps to URLs with base path
 */
export function assetsURLOfDeps(deps: AssetDeps, base: string): AssetDeps {
  return {
    js: deps.js.map((p) => `${base}${p}`),
    css: deps.css.map((p) => `${base}${p}`),
  };
}
