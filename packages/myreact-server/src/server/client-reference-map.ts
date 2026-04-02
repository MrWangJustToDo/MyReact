import { CLIENT_REFERENCE_SYMBOL } from "../shared/types";

import type { ClientReference, ClientReferenceMetadata } from "../shared/types";

/**
 * Registry of client component references
 */
const clientReferenceRegistry = new Map<string, ClientReferenceMetadata>();

/**
 * @public
 * Register a client component reference
 *
 * This function creates a client reference proxy that will be serialized
 * in the Flight stream as a reference to a client-side module.
 *
 * @param proxy - The proxy object (can be empty {})
 * @param moduleId - The module ID (file path or package name)
 * @param exportName - The export name (e.g., "default" or named export)
 * @returns The client reference object
 *
 * @example
 * ```typescript
 * // In build tool transform for "use client" files
 * const ClientComponent = registerClientReference(
 *   {},
 *   "./components/Counter.tsx",
 *   "default"
 * );
 * ```
 */
export function registerClientReference<T extends object>(proxy: T, moduleId: string, exportName: string): T & ClientReference {
  const key = `${moduleId}#${exportName}`;

  // Register in the registry
  clientReferenceRegistry.set(key, {
    id: moduleId,
    name: exportName,
    chunks: [],
  });

  // Add client reference properties to the proxy
  const clientRef = proxy as T & ClientReference;
  Object.defineProperties(clientRef, {
    $$typeof: {
      value: CLIENT_REFERENCE_SYMBOL,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    $$id: {
      value: moduleId,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    $$name: {
      value: exportName,
      enumerable: false,
      configurable: false,
      writable: false,
    },
  });

  return clientRef;
}

/**
 * @public
 * Create a proxy for an entire client module
 *
 * This creates a Proxy where every property access returns a client
 * reference for that export name. Useful for transforming entire
 * "use client" modules.
 *
 * @param moduleId - The module ID
 * @returns A proxy that returns client references for any property access
 *
 * @example
 * ```typescript
 * const clientModule = createClientModuleProxy("./components/ui.tsx");
 * // clientModule.Button -> ClientReference for Button
 * // clientModule.Input -> ClientReference for Input
 * ```
 */
export function createClientModuleProxy(moduleId: string): Record<string, ClientReference> {
  const cache = new Map<string, ClientReference>();

  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        if (prop === "$$typeof") {
          return CLIENT_REFERENCE_SYMBOL;
        }

        if (prop === "$$id") {
          return moduleId;
        }

        // Check cache
        if (cache.has(prop)) {
          return cache.get(prop);
        }

        // Create new client reference
        const ref = registerClientReference({}, moduleId, prop);
        cache.set(prop, ref);
        return ref;
      },

      has(_target, _prop: string) {
        return true; // All properties exist
      },

      ownKeys() {
        return [];
      },

      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    }
  );
}

/**
 * @public
 * Get a registered client reference by key
 */
export function getClientReference(key: string): ClientReferenceMetadata | undefined {
  return clientReferenceRegistry.get(key);
}

/**
 * @public
 * Check if a value is a client reference
 */
export function isClientReference(value: unknown): value is ClientReference {
  return typeof value === "object" && value !== null && (value as ClientReference).$$typeof === CLIENT_REFERENCE_SYMBOL;
}

/**
 * Clear the client reference registry (for testing)
 */
export function clearClientReferenceRegistry(): void {
  clientReferenceRegistry.clear();
}
