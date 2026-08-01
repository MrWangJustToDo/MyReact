import { createManifestModuleLoader } from "@my-react/react-server/client";
import { createFlightServer } from "@my-react/react-server/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { ClientManifest, ModuleLoader } from "@my-react/react-server/client";

function loadProdSsrManifest(): ClientManifest | null {
  try {
    const manifestPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "ssr-client-manifest.json");
    const raw = JSON.parse(readFileSync(manifestPath, "utf-8")) as Record<
      string,
      { id: string; name: string; chunks?: string[]; ssrModule?: string; sourceId?: string }
    >;

    const manifest: ClientManifest = {};
    for (const [key, entry] of Object.entries(raw)) {
      const chunk = entry.ssrModule ?? entry.id;
      manifest[key] = {
        id: chunk.startsWith(".") || chunk.startsWith("/") ? chunk : `./${chunk}`,
        name: entry.name,
        chunks: entry.chunks,
        ssrModule: entry.ssrModule,
        sourceId: entry.sourceId,
      };
    }
    return manifest;
  } catch {
    return null;
  }
}

function createDevModuleLoader(options?: { loadModule?: (id: string) => Promise<unknown> }): ModuleLoader {
  const loadedModules = new Map<string, unknown>();

  const resolveModule = async (id: string) => {
    if (options?.loadModule) {
      return options.loadModule(id);
    }

    const globalLoader = (globalThis as unknown as { __MY_REACT_RSC_SSR_LOAD_MODULE__?: (id: string) => Promise<unknown> }).__MY_REACT_RSC_SSR_LOAD_MODULE__;
    if (typeof globalLoader === "function") {
      return globalLoader(id);
    }

    return import(/* @vite-ignore */ id);
  };

  return {
    async preloadModule(metadata: { id: string }) {
      if (loadedModules.has(metadata.id)) return;
      const mod = await resolveModule(metadata.id);
      loadedModules.set(metadata.id, mod as Record<string, unknown>);
    },
    async requireModule(metadata: { id: string; name: string }) {
      if (loadedModules.has(metadata.id)) {
        return loadedModules.get(metadata.id);
      }
      const mod = await resolveModule(metadata.id);
      loadedModules.set(metadata.id, mod as Record<string, unknown>);
      return mod;
    },
  };
}

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    loadModule?: (id: string) => Promise<unknown>;
  }
) {
  const hasDevLoader =
    typeof options?.loadModule === "function" ||
    typeof (globalThis as unknown as { __MY_REACT_RSC_SSR_LOAD_MODULE__?: unknown }).__MY_REACT_RSC_SSR_LOAD_MODULE__ === "function";

  let moduleLoader: ModuleLoader;
  if (hasDevLoader) {
    moduleLoader = createDevModuleLoader(options);
  } else {
    const manifest = loadProdSsrManifest();
    moduleLoader = manifest
      ? createManifestModuleLoader(manifest, {
          allowDynamicImport: false,
          // Relative chunk ids must resolve from this SSR entry, not from @my-react/react-server
          loadModule: async (id) => {
            if (id.startsWith("./") || id.startsWith("../")) {
              return import(/* @vite-ignore */ new URL(id, import.meta.url).href);
            }
            return import(/* @vite-ignore */ id);
          },
        })
      : createDevModuleLoader(options);
  }

  const server = await createFlightServer({ moduleLoader });
  const htmlStream = await server.renderToStream(rscStream);
  const html = await readStreamToString(htmlStream);

  return { html };
}

async function readStreamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode();
  return result;
}
