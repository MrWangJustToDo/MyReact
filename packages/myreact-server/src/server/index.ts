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
  // Accept both the @lazarv convention (`moduleId` + `exportName`) and the
  // Vite transform convention (`moduleId#exportName` + `exportName`).
  // @lazarv appends `#name` itself, so passing an already-qualified id would
  // produce `moduleId#name#name` and break actions passed as Flight props.
  const hashIndex = id.lastIndexOf("#");
  const moduleId = hashIndex === -1 ? id : id.slice(0, hashIndex);
  const exportName = hashIndex === -1 ? name : id.slice(hashIndex + 1) || name;
  const fullId = `${moduleId}#${exportName}`;

  // Register with @lazarv/rsc for Flight serialization
  const registered = rscRegisterServerReference(action, moduleId, exportName);

  // Also register in our serverActionRegistry for handleServerAction
  serverActionRegistry.set(fullId, registered);

  return registered as T;
}
export { handleServerAction, executeServerAction, assertSameOriginActionRequest, extractActionIdFromFormData } from "./action-handler";
export type { HandleServerActionOptions } from "./action-handler";
export { createFlightServer } from "./flight-server";
export { createClientManifestResolver, loadServerActionManifest } from "./manifest";
export { createClientErrorDigest, createPublicErrorMessage } from "../shared/error-digest";

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
