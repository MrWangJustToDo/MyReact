import type { ClientManifest, ClientManifestEntry, ClientReferenceMetadata, ModuleLoader } from "../shared/types";

/**
 * Module registry type
 */
interface ModuleRegistry extends Map<string, Record<string, unknown>> {
  get(id: string): Record<string, unknown> | undefined;
  set(id: string, module: Record<string, unknown>): this;
  has(id: string): boolean;
}

/**
 * Initialize the global module registry if it doesn't exist
 */
function initializeModuleRegistry(): ModuleRegistry {
  if (typeof globalThis !== "undefined") {
    if (!globalThis.__my_react_modules__) {
      globalThis.__my_react_modules__ = new Map<string, Record<string, unknown>>();
    }
    return globalThis.__my_react_modules__ as ModuleRegistry;
  }

  // Fallback for non-browser environments
  const fallbackRegistry = new Map<string, Record<string, unknown>>();

  return fallbackRegistry;
}

/**
 * Global module registry
 */
const moduleRegistry = initializeModuleRegistry();

/**
 * Pending module loads
 */
const pendingLoads = new Map<string, Promise<Record<string, unknown>>>();

type ModuleLoaderOptions = {
  manifest?: ClientManifest;
  resolveModuleId?: (id: string, metadata: ClientReferenceMetadata, entry?: ClientManifestEntry) => string;
  loadModule?: (id: string) => Promise<unknown>;
};

/**
 * @public
 * Register a client module in the registry
 *
 * @param moduleId - The module ID
 * @param moduleExports - The module exports object
 */
export function registerModule(moduleId: string, moduleExports: Record<string, unknown>): void {
  moduleRegistry.set(moduleId, moduleExports);
}

/**
 * @public
 * Synchronously require a module
 *
 * This is called by @lazarv/rsc when deserializing client references.
 * The module must already be loaded and registered.
 *
 * @param metadata - The client reference metadata
 * @returns The module exports object
 * @throws Error if module is not loaded
 */
export function requireModule(metadata: ClientReferenceMetadata): unknown | Promise<unknown> {
  const module = moduleRegistry.get(metadata.id);

  if (!module) {
    if (pendingLoads.has(metadata.id)) {
      return pendingLoads.get(metadata.id)!;
    }

    const loadPromise = (async () => {
      await preloadModule(metadata);
      const loaded = moduleRegistry.get(metadata.id);
      if (!loaded) {
        throw new Error(`[@my-react/react-server] Module "${metadata.id}" not loaded after preload.`);
      }
      return loaded;
    })();

    pendingLoads.set(metadata.id, loadPromise);
    return loadPromise;
  }

  return module;
}

/**
 * @public
 * Preload a module asynchronously
 *
 * This is called by @lazarv/rsc to preload client component chunks
 * before they're needed.
 *
 * @param metadata - The client reference metadata
 * @returns Promise that resolves when module is loaded
 */
export async function preloadModule(metadata: ClientReferenceMetadata): Promise<void> {
  // Already loaded
  if (moduleRegistry.has(metadata.id)) {
    return;
  }

  // Already loading
  if (pendingLoads.has(metadata.id)) {
    await pendingLoads.get(metadata.id);
    return;
  }

  // Start loading
  const loadPromise = (async () => {
    try {
      // Dynamic import - assumes module ID is a valid URL or path
      const module = await import(/* @vite-ignore */ metadata.id);
      moduleRegistry.set(metadata.id, module as Record<string, unknown>);
      return module as Record<string, unknown>;
    } catch (error) {
      console.error(`[@my-react/react-server] Failed to load module "${metadata.id}":`, error);
      throw error;
    } finally {
      pendingLoads.delete(metadata.id);
    }
  })();

  pendingLoads.set(metadata.id, loadPromise);
  await loadPromise;
}

/**
 * @public
 * Create a module loader interface for @lazarv/rsc
 *
 * @returns ModuleLoader interface
 */
export function createModuleLoader(): ModuleLoader {
  return createModuleLoaderWithOptions({});
}

/**
 * @public
 * Create a module loader with manifest support
 */
export function createManifestModuleLoader(manifest: ClientManifest, options?: Omit<ModuleLoaderOptions, "manifest">): ModuleLoader {
  return createModuleLoaderWithOptions({ ...options, manifest });
}

function createModuleLoaderWithOptions(options: ModuleLoaderOptions): ModuleLoader {
  const { manifest, resolveModuleId, loadModule } = options;

  function resolveEntry(metadata: ClientReferenceMetadata): ClientManifestEntry | undefined {
    if (!manifest) {
      return undefined;
    }

    return manifest[`${metadata.id}#${metadata.name}`];
  }

  function resolveImportId(metadata: ClientReferenceMetadata, entry?: ClientManifestEntry): string {
    const baseId = entry?.id ?? metadata.id;
    return resolveModuleId ? resolveModuleId(baseId, metadata, entry) : baseId;
  }

  async function loadById(id: string): Promise<Record<string, unknown>> {
    if (loadModule) {
      return (await loadModule(id)) as Record<string, unknown>;
    }
    return (await import(/* @vite-ignore */ id)) as Record<string, unknown>;
  }

  async function preloadModuleWithOptions(metadata: ClientReferenceMetadata): Promise<void> {
    if (moduleRegistry.has(metadata.id)) {
      return;
    }

    if (pendingLoads.has(metadata.id)) {
      await pendingLoads.get(metadata.id);
      return;
    }

    const entry = resolveEntry(metadata);
    const importId = resolveImportId(metadata, entry);
    const chunkIds = entry?.chunks ?? [];

    const loadPromise = (async () => {
      try {
        const preloadIds = new Set<string>([...chunkIds].filter(Boolean));
        for (const chunkId of preloadIds) {
          if (chunkId === importId) continue;
          await loadById(chunkId);
        }

        const module = await loadById(importId);
        moduleRegistry.set(metadata.id, module);
        return module;
      } catch (error) {
        console.error(`[@my-react/react-server] Failed to load module "${metadata.id}":`, error);
        throw error;
      } finally {
        pendingLoads.delete(metadata.id);
      }
    })();

    pendingLoads.set(metadata.id, loadPromise);
    await loadPromise;
  }

  function requireModuleWithOptions(metadata: ClientReferenceMetadata): unknown | Promise<unknown> {
    const module = moduleRegistry.get(metadata.id);

    if (!module) {
      if (pendingLoads.has(metadata.id)) {
        return pendingLoads.get(metadata.id)!;
      }

      const loadPromise = (async () => {
        await preloadModuleWithOptions(metadata);
        const loaded = moduleRegistry.get(metadata.id);
        if (!loaded) {
          throw new Error(`[@my-react/react-server] Module "${metadata.id}" not loaded after preload.`);
        }
        return loaded;
      })();

      pendingLoads.set(metadata.id, loadPromise);
      return loadPromise;
    }

    return module;
  }

  return {
    requireModule: requireModuleWithOptions,
    preloadModule: preloadModuleWithOptions,
  };
}

/**
 * @public
 * Check if a module is loaded
 *
 * @param moduleId - The module ID
 * @returns true if loaded
 */
export function isModuleLoaded(moduleId: string): boolean {
  return moduleRegistry.has(moduleId);
}

/**
 * @public
 * Get all loaded module IDs
 *
 * @returns Array of module IDs
 */
export function getLoadedModules(): string[] {
  const modules: string[] = [];
  if (moduleRegistry.keys) {
    for (const key of (moduleRegistry as any).keys()) {
      modules.push(key);
    }
  }
  return modules;
}

/**
 * Clear all loaded modules (for testing)
 */
export function clearModuleRegistry(): void {
  if (moduleRegistry.clear) {
    moduleRegistry.clear();
  }
}
