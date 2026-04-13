import { CLIENT_REFERENCE_SYMBOL } from "../shared/types";

import type { ClientManifest, ClientReference, ClientReferenceMetadata, ModuleResolver, ServerActionManifest } from "../shared/types";

/**
 * @public
 * Create a module resolver from a client manifest
 */
export function createClientManifestResolver(manifest: ClientManifest): ModuleResolver {
  return {
    resolveClientReference(reference: ClientReference): ClientReferenceMetadata | null {
      if (reference.$$typeof !== CLIENT_REFERENCE_SYMBOL) {
        return null;
      }

      const key = `${reference.$$id}#${reference.$$name}`;
      const entry = manifest[key];

      if (!entry) {
        return {
          id: reference.$$id,
          name: reference.$$name,
          chunks: [],
          css: [],
        };
      }

      return {
        id: entry.id,
        name: entry.name,
        chunks: entry.chunks ?? [],
        css: entry.css ?? [],
      };
    },
  };
}

/**
 * @public
 * Load server action modules from manifest
 */
export async function loadServerActionManifest(
  manifest: ServerActionManifest,
  options?: {
    resolveModuleId?: (id: string) => string;
    loadModule?: (id: string) => Promise<unknown>;
  }
): Promise<void> {
  const moduleIds = new Set<string>();
  for (const entry of Object.values(manifest)) {
    if (entry?.moduleId) {
      moduleIds.add(entry.moduleId);
    }
  }

  const resolveModuleId = options?.resolveModuleId ?? ((id: string) => id);
  const loadModule = options?.loadModule ?? ((id: string) => import(/* @vite-ignore */ id));

  for (const moduleId of moduleIds) {
    await loadModule(resolveModuleId(moduleId));
  }
}
