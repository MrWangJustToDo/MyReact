/**
 * @file RSC HMR Plugin (Phase 1)
 * Server Component changes → custom `rsc:update` → browser refetch Flight.
 * Client Component changes stay on React Refresh; invalidate RSC proxies for those modules.
 *
 * Aligned with @vitejs/plugin-rsc (hotUpdate + client.hot.send intercept).
 */

import { detectUseClientDirective } from "../directives";
import { generateModuleId } from "../utils";

import type { RscPluginManager } from "../manager";
import type { EnvironmentModuleNode, HotUpdateOptions, Plugin, UpdatePayload, ViteDevServer } from "vite";

/**
 * Create the RSC HMR plugin
 */
export function createHmrPlugin(manager: RscPluginManager): Plugin {
  return {
    name: "vite:my-react-rsc-hmr",
    apply: "serve",

    configResolved(config) {
      manager.config = config;
    },

    configureServer(server) {
      manager.server = server;

      const clientEnv = server.environments.client;
      if (!clientEnv?.hot?.send) {
        return;
      }

      // Propagate client-boundary invalidation into the RSC graph so the next
      // Flight fetch sees fresh client reference proxies (official plugin-rsc).
      const originalSend = clientEnv.hot.send.bind(clientEnv.hot);
      clientEnv.hot.send = ((payload: unknown) => {
        const e = payload as UpdatePayload;
        if (e && typeof e === "object" && e.type === "update" && Array.isArray(e.updates)) {
          const rscEnv = server.environments.rsc;
          if (rscEnv) {
            for (const update of e.updates) {
              if (update.type !== "js-update") continue;

              const clientMod = clientEnv.moduleGraph.urlToModuleMap.get(update.path);
              if (!clientMod?.id || !isClientReferenceId(manager, clientMod.id)) {
                continue;
              }

              invalidateRscModuleForId(rscEnv.moduleGraph, clientMod.id, clientMod.file);
            }
          }
        }

        return originalSend(payload as never);
      }) as typeof clientEnv.hot.send;
    },

    async hotUpdate(ctx) {
      if (this.environment.name !== "rsc") {
        return;
      }

      if (await isInsideClientBoundary(manager, ctx)) {
        return;
      }

      // Surface transform errors to the browser overlay before refetch
      for (const mod of ctx.modules) {
        if (mod.type === "js" && mod.url) {
          try {
            await this.environment.transformRequest(mod.url);
          } catch (error) {
            sendClientError(ctx.server, error);
            throw error;
          }
        }
      }

      for (const mod of ctx.modules) {
        this.environment.moduleGraph.invalidateModule(mod);
      }

      // Also invalidate by file so soft caches / alternate ids clear
      const rscGraph = ctx.server.environments.rsc?.moduleGraph;
      if (rscGraph && ctx.file) {
        const byFile = rscGraph.getModulesByFile(ctx.file);
        if (byFile) {
          for (const mod of byFile) {
            rscGraph.invalidateModule(mod);
          }
        }
      }

      const clientHot = ctx.server.environments.client?.hot;
      if (clientHot?.send) {
        clientHot.send({
          type: "custom",
          event: "rsc:update",
          data: { file: ctx.file },
        });
      }

      // Handled via rsc:update — skip default env HMR (avoids extra reload noise)
      return [];
    },
  };
}

function isClientReferenceId(manager: RscPluginManager, id: string): boolean {
  const bare = id.split("?")[0] ?? id;
  if (manager.clientReferenceMetaMap[bare] || manager.clientReferenceMetaMap[id]) {
    return true;
  }

  const root = manager.config?.root;
  if (root) {
    const generated = generateModuleId(bare, root);
    if (manager.clientReferenceMetaMap[generated]) {
      return true;
    }
  }

  return false;
}

async function isInsideClientBoundary(manager: RscPluginManager, ctx: HotUpdateOptions): Promise<boolean> {
  // File itself is a client module (covers first edit before meta map is warm)
  try {
    const code = await ctx.read();
    if (detectUseClientDirective(code)) {
      return true;
    }
  } catch {
    // ignore read errors; fall through to graph walk
  }

  const visited = new Set<string>();

  function recurse(mod: EnvironmentModuleNode): boolean {
    if (!mod.id) return false;
    if (isClientReferenceId(manager, mod.id)) return true;
    if (visited.has(mod.id)) return false;
    visited.add(mod.id);

    for (const importer of mod.importers) {
      if (recurse(importer)) {
        return true;
      }
    }
    return false;
  }

  return ctx.modules.some((mod) => recurse(mod));
}

function invalidateRscModuleForId(
  moduleGraph: {
    getModuleById: (id: string) => EnvironmentModuleNode | undefined;
    getModulesByFile: (file: string) => Set<EnvironmentModuleNode> | undefined;
    invalidateModule: (mod: EnvironmentModuleNode) => void;
  },
  id: string,
  file?: string | null
): void {
  const bare = id.split("?")[0] ?? id;
  const candidates = [id, bare];

  for (const candidate of candidates) {
    const mod = moduleGraph.getModuleById(candidate);
    if (mod) {
      moduleGraph.invalidateModule(mod);
    }
  }

  if (file) {
    const byFile = moduleGraph.getModulesByFile(file);
    if (byFile) {
      for (const mod of byFile) {
        moduleGraph.invalidateModule(mod);
      }
    }
  }
}

function sendClientError(server: ViteDevServer, error: unknown): void {
  const clientHot = server.environments.client?.hot;
  if (!clientHot?.send) return;

  const err = error instanceof Error ? error : new Error(String(error));
  clientHot.send({
    type: "error",
    err: {
      message: err.message,
      stack: err.stack ?? "",
    },
  });
}
