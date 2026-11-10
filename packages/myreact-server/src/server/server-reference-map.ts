import { SERVER_REFERENCE_SYMBOL } from "../shared/types";

import type { ServerReference, ServerReferenceMetadata } from "../shared/types";

/**
 * Registry of server actions by ID
 * Used by action-handler.ts to look up and execute server actions
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const serverActionRegistry = new Map<string, Function>();

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
  // @lazarv registers server references as callable functions, not plain objects.
  return (typeof value === "function" || (typeof value === "object" && value !== null)) && (value as ServerReference).$$typeof === SERVER_REFERENCE_SYMBOL;
}

/**
 * @public
 * Get server reference metadata from a value
 */
export function getServerReferenceMetadata(value: ServerReference): ServerReferenceMetadata {
  const id = value.$$id ?? "";
  const hashIndex = id.lastIndexOf("#");

  return {
    id,
    name: value.$$name ?? (hashIndex === -1 ? "default" : id.slice(hashIndex + 1)),
    bound: Array.isArray(value.$$bound) && value.$$bound.length > 0,
  };
}

/**
 * Clear the server action registry (for testing)
 */
export function clearServerActionRegistry(): void {
  serverActionRegistry.clear();
}
