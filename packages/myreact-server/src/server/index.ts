// Server-side RSC exports
import { registerServerReference as rscRegisterServerReference } from "@lazarv/rsc/server";

import { serverActionRegistry } from "./server-reference-map";

export { renderToFlightStream } from "./render-to-flight-stream";

// Re-export from @lazarv/rsc/server for proper Flight serialization integration
// Using @lazarv/rsc's registry ensures references are recognized during serialization
export { registerClientReference, createClientModuleProxy } from "@lazarv/rsc/server";

// Server action utilities
export { getServerAction, serverActionRegistry, isServerReference, getServerReferenceMetadata, clearServerActionRegistry } from "./server-reference-map";

/**
 * Register a server reference for both Flight serialization and action execution.
 * This wrapper ensures the action is registered in:
 * 1. @lazarv/rsc's internal registry (for Flight serialization)
 * 2. Our serverActionRegistry (for handleServerAction to find and execute)
 */
export function registerServerReference<T extends (...args: unknown[]) => unknown>(action: T, id: string, name: string): T {
  // Register with @lazarv/rsc for Flight serialization
  const registered = rscRegisterServerReference(action, id, name);

  // Also register in our serverActionRegistry for handleServerAction
  serverActionRegistry.set(id, registered);

  return registered as T;
}
export { handleServerAction, executeServerAction } from "./action-handler";
export { createFlightServer } from "./flight-server";
export { createClientManifestResolver, loadServerActionManifest } from "./manifest";

// Re-export types
export type {
  RenderToFlightStreamOptions,
  FlightServerOptions,
  ModuleResolver,
  ClientReferenceMetadata,
  ServerReferenceMetadata,
  ClientReference,
  ServerReference,
  ServerActionRequest,
  ServerActionResponse,
  ClientManifest,
  ClientManifestEntry,
  ServerActionManifest,
  ServerActionManifestEntry,
} from "../shared/types";

export { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "../shared/types";
