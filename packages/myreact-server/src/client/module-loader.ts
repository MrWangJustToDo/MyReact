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
  /** When true (default if manifest is set), reject ids missing from the manifest */
  requireManifestEntry?: boolean;
  resolveModuleId?: (id: string, metadata: ClientReferenceMetadata, entry?: ClientManifestEntry) => string;
  loadModule?: (id: string) => Promise<unknown>;
  /**
   * Allow dynamic `import(metadata.id)` when the module is not yet registered.
   * Default false for createModuleLoader (registry-only); createManifestModuleLoader
   * resolves through the manifest then imports the mapped chunk id.
   */
  allowDynamicImport?: boolean;
};

/**
 * Reject remote / protocol-based module ids that must never be imported from Flight metadata.
 */
export function assertSafeClientModuleId(id: string): void {
  if (!id || typeof id !== "string") {
    throw new Error("[@my-react/react-server] Invalid client module id");
  }
  if (/^(https?:|data:|blob:|file:|node:|\/\/)/i.test(id.trim())) {
    throw new Error(`[@my-react/react-server] Refusing to import unsafe module id: ${id}`);
  }
}

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
 * Default loader is registry-oriented: without `allowDynamicImport`, modules
 * must already be registered (e.g. via bootstrap). Use createManifestModuleLoader
 * or pass allowDynamicImport for Vite URL imports.
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

  assertSafeClientModuleId(metadata.id);

  // Start loading — only when dynamic import is explicitly allowed via options path;
  // the standalone preloadModule keeps DEV-compatible import but blocks unsafe protocols.
  const loadPromise = (async () => {
    try {
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
 * Registry-first: does not dynamic-import arbitrary Flight ids unless
 * `allowDynamicImport: true` is passed.
 */
export function createModuleLoader(options?: Omit<ModuleLoaderOptions, "manifest">): ModuleLoader {
  return createModuleLoaderWithOptions({
    // Allow Vite/relative imports by default, but never remote protocols (assertSafeClientModuleId).
    allowDynamicImport: options?.allowDynamicImport ?? true,
    ...options,
  });
}

/**
 * @public
 * Create a module loader with manifest support
 *
 * Requires each client reference to resolve through the manifest (A19).
 */
export function createManifestModuleLoader(manifest: ClientManifest, options?: Omit<ModuleLoaderOptions, "manifest">): ModuleLoader {
  return createModuleLoaderWithOptions({
    ...options,
    manifest,
    requireManifestEntry: options?.requireManifestEntry !== false,
    allowDynamicImport: options?.allowDynamicImport ?? true,
  });
}

function createModuleLoaderWithOptions(options: ModuleLoaderOptions): ModuleLoader {
  const { manifest, resolveModuleId, loadModule, requireManifestEntry = Boolean(manifest), allowDynamicImport = false } = options;

  function resolveEntry(metadata: ClientReferenceMetadata): ClientManifestEntry | undefined {
    if (!manifest) {
      return undefined;
    }

    return manifest[`${metadata.id}#${metadata.name}`] ?? manifest[metadata.id];
  }

  function resolveImportId(metadata: ClientReferenceMetadata, entry?: ClientManifestEntry): string {
    if (entry?.ssrModule) {
      return entry.ssrModule.startsWith(".") ? entry.ssrModule : `./${entry.ssrModule}`;
    }
    const baseId = entry?.id ?? metadata.id;
    return resolveModuleId ? resolveModuleId(baseId, metadata, entry) : baseId;
  }

  async function loadById(id: string): Promise<Record<string, unknown>> {
    assertSafeClientModuleId(id);
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
    if (requireManifestEntry && !entry) {
      throw new Error(`[@my-react/react-server] Client reference not in manifest: ${metadata.id}#${metadata.name || "default"}`);
    }

    if (!entry && !allowDynamicImport && !loadModule) {
      throw new Error(
        `[@my-react/react-server] Module "${metadata.id}" is not registered. ` + `Pass a clientManifest, call registerModule(), or enable allowDynamicImport.`
      );
    }

    const importId = resolveImportId(metadata, entry);
    const chunkIds = entry?.chunks ?? [];

    const loadPromise = (async () => {
      try {
        assertSafeClientModuleId(importId);
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
