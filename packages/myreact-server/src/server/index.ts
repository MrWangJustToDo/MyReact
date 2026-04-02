// Server-side RSC exports
export { renderToFlightStream, createServerDispatch } from "./render-to-flight-stream";
export { ServerComponentDispatch } from "./server-component-dispatch";
export { registerClientReference, createClientModuleProxy } from "./client-reference-map";
export { registerServerReference, getServerAction, serverActionRegistry } from "./server-reference-map";
export { handleServerAction, executeServerAction } from "./action-handler";
export { createFlightServer } from "./flight-server";

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
} from "../shared/types";

export { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "../shared/types";
