/**
 * @my-react/react-server
 * React Server Components support for MyReact
 *
 * @example Server-side rendering:
 * ```typescript
 * import { renderToFlightStream } from "@my-react/react-server/server";
 *
 * const stream = await renderToFlightStream(<App />);
 * ```
 *
 * @example Client-side hydration:
 * ```typescript
 * import { createFlightClient } from "@my-react/react-server/client";
 *
 * const client = createFlightClient();
 * client.hydrate(container, response.body);
 * ```
 */

// Re-export from submodules for convenience
// Users should prefer importing from /server or /client directly

export { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "./shared/types";

export type {
  ClientReferenceMetadata,
  ServerReferenceMetadata,
  ClientReference,
  ServerReference,
  ModuleResolver,
  ModuleLoader,
  FlightClientOptions,
  RenderToFlightStreamOptions,
  ServerActionRequest,
  ServerActionResponse,
} from "./shared/types";
