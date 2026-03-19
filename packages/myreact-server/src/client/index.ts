// Client-side RSC exports
export { createFlightClient, createServerActionReference, encodeReply } from "./FlightClient";
export type { FlightClient } from "./FlightClient";

export { createModuleLoader, registerModule, requireModule, preloadModule, isModuleLoaded, getLoadedModules } from "./moduleLoader";

// Re-export types
export type { FlightClientOptions, ModuleLoader, ClientReferenceMetadata } from "../shared/types";
