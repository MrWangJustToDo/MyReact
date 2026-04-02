import { SERVER_REFERENCE_SYMBOL } from "../shared/types";

import type { ServerReference, ServerReferenceMetadata } from "../shared/types";

/**
 * Registry of server actions by ID
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const serverActionRegistry = new Map<string, Function>();

/**
 * @public
 * Register a server action (function with "use server")
 *
 * This function marks a function as a server action and registers it
 * for later invocation when called from the client.
 *
 * @param fn - The server action function
 * @param actionId - Unique action ID (e.g., "module#functionName")
 * @param name - The function name
 * @returns The function with server reference properties
 *
 * @example
 * ```typescript
 * async function submitForm(formData: FormData) {
 *   "use server";
 *   // ... server logic
 * }
 *
 * // In build tool transform
 * registerServerReference(submitForm, "actions.ts#submitForm", "submitForm");
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function registerServerReference<T extends Function>(fn: T, actionId: string, name: string): T & ServerReference {
  // Register in the registry
  serverActionRegistry.set(actionId, fn);

  // Add server reference properties
  const serverRef = fn as T & ServerReference;
  Object.defineProperties(serverRef, {
    $$typeof: {
      value: SERVER_REFERENCE_SYMBOL,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    $$id: {
      value: actionId,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    $$name: {
      value: name,
      enumerable: false,
      configurable: false,
      writable: false,
    },
  });

  // Override bind to support bound server actions
  const originalBind = fn.bind;
  Object.defineProperty(serverRef, "bind", {
    value: function boundServerAction(thisArg: unknown, ...boundArgs: unknown[]) {
      const boundFn = originalBind.call(fn, thisArg, ...boundArgs);

      // Create a new server reference for the bound function
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const boundRef = boundFn as Function & ServerReference;
      Object.defineProperties(boundRef, {
        $$typeof: {
          value: SERVER_REFERENCE_SYMBOL,
          enumerable: false,
          configurable: false,
          writable: false,
        },
        $$id: {
          value: actionId,
          enumerable: false,
          configurable: false,
          writable: false,
        },
        $$name: {
          value: name,
          enumerable: false,
          configurable: false,
          writable: false,
        },
        $$bound: {
          value: boundArgs,
          enumerable: false,
          configurable: false,
          writable: false,
        },
      });

      return boundRef;
    },
    enumerable: false,
    configurable: true,
    writable: true,
  });

  return serverRef;
}

/**
 * @public
 * Get a registered server action by ID
 *
 * @param actionId - The action ID
 * @returns The server action function or undefined
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function getServerAction(actionId: string): Function | undefined {
  return serverActionRegistry.get(actionId);
}

/**
 * @public
 * Check if a value is a server reference
 */
export function isServerReference(value: unknown): value is ServerReference {
  return typeof value === "object" && value !== null && (value as ServerReference).$$typeof === SERVER_REFERENCE_SYMBOL;
}

/**
 * @public
 * Get server reference metadata from a value
 */
export function getServerReferenceMetadata(value: ServerReference): ServerReferenceMetadata {
  return {
    id: value.$$id,
    name: value.$$name,
    bound: value.$$bound !== undefined,
  };
}

/**
 * Clear the server action registry (for testing)
 */
export function clearServerActionRegistry(): void {
  serverActionRegistry.clear();
}
