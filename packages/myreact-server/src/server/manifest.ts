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

      // @lazarv stores the export name in `$$id` (`moduleId#exportName`) and
      // does not populate `$$name` on registered references. Derive both parts
      // so manifest keys such as `/src/Foo.tsx#default` match correctly.
      const fullId = reference.$$id;
      const hashIndex = fullId.lastIndexOf("#");
      const moduleId = hashIndex === -1 ? fullId : fullId.slice(0, hashIndex);
      const exportName = reference.$$name || (hashIndex === -1 ? "default" : fullId.slice(hashIndex + 1));
      const key = `${moduleId}#${exportName}`;
      const entry = manifest[key];

      if (!entry) {
        throw new Error(`[@my-react/react-server] Client reference not in manifest: ${key}`);
      }

      return {
        id: entry.id,
        name: entry.name || exportName,
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
