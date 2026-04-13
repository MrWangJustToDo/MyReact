// Client-side RSC exports
export { createFlightClient, createServerActionReference, encodeReply } from "./flight-client";
export type { FlightClient } from "./flight-client";

export {
  createModuleLoader,
  createManifestModuleLoader,
  registerModule,
  requireModule,
  preloadModule,
  isModuleLoaded,
  getLoadedModules,
} from "./module-loader";

// Re-export types
export type {
  FlightClientOptions,
  ModuleLoader,
  ClientReferenceMetadata,
  ClientManifest,
  ClientManifestEntry,
  ServerActionManifest,
  ServerActionManifestEntry,
} from "../shared/types";
