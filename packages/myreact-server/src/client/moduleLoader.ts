import type { ClientReferenceMetadata, ModuleLoader } from "../shared/types";

/**
 * Module registry type
 */
interface ModuleRegistry {
  get(id: string): Record<string, unknown> | undefined;
  set(id: string, module: Record<string, unknown>): void;
  has(id: string): boolean;
}

/**
 * Initialize the global module registry if it doesn't exist
 */
function initializeModuleRegistry(): ModuleRegistry {
  if (typeof globalThis !== "undefined") {
    if (!(globalThis as any).__my_react_modules__) {
      (globalThis as any).__my_react_modules__ = new Map<string, Record<string, unknown>>();
    }
    return (globalThis as any).__my_react_modules__ as ModuleRegistry;
  }

  // Fallback for non-browser environments
  const fallbackRegistry = new Map<string, Record<string, unknown>>();
  return {
    get: (id) => fallbackRegistry.get(id),
    set: (id, module) => fallbackRegistry.set(id, module),
    has: (id) => fallbackRegistry.has(id),
  };
}

/**
 * Global module registry
 */
const moduleRegistry = initializeModuleRegistry();

/**
 * Pending module loads
 */
const pendingLoads = new Map<string, Promise<Record<string, unknown>>>();

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
 * Synchronously require a module export
 *
 * This is called by @lazarv/rsc when deserializing client references.
 * The module must already be loaded and registered.
 *
 * @param metadata - The client reference metadata
 * @returns The module export
 * @throws Error if module is not loaded
 */
export function requireModule(metadata: ClientReferenceMetadata): unknown {
  const module = moduleRegistry.get(metadata.id);

  if (!module) {
    throw new Error(`[@my-react/react-server] Module "${metadata.id}" not loaded. ` + `Make sure to preload modules before consuming the Flight stream.`);
  }

  const exportValue = module[metadata.name];

  if (exportValue === undefined && metadata.name !== "default") {
    console.warn(`[@my-react/react-server] Export "${metadata.name}" not found in module "${metadata.id}"`);
  }

  return exportValue;
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
      const module = await import(/* webpackIgnore: true */ metadata.id);
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

/**
 * @public
 * Create a module loader interface for @lazarv/rsc
 *
 * @returns ModuleLoader interface
 */
export function createModuleLoader(): ModuleLoader {
  return {
    requireModule,
    preloadModule,
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
  if ((moduleRegistry as any).keys) {
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
  if ((moduleRegistry as any).clear) {
    (moduleRegistry as any).clear();
  }
}
