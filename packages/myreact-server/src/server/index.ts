// Server-side RSC exports
export { renderToFlightStream, createServerDispatch } from "./renderToFlightStream";
export { ServerComponentDispatch } from "./ServerComponentDispatch";
export { registerClientReference, createClientModuleProxy } from "./clientReferenceMap";
export { registerServerReference, getServerAction, serverActionRegistry } from "./serverReferenceMap";
export { handleServerAction, executeServerAction } from "./actionHandler";

// Re-export types
export type {
  RenderToFlightStreamOptions,
  ModuleResolver,
  ClientReferenceMetadata,
  ServerReferenceMetadata,
  ClientReference,
  ServerReference,
  ServerActionRequest,
  ServerActionResponse,
} from "../shared/types";

export { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "../shared/types";
