import { renderToReadableStream } from "@lazarv/rsc/server";

import { createClientManifestResolver } from "./manifest";

import type { RenderToFlightStreamOptions } from "../shared/types";
import type { MyReactElementNode } from "@my-react/react/type";

/**
 * @public
 * Render a MyReact element tree to a Flight protocol ReadableStream
 *
 * This function serializes the server component tree using the React Flight
 * protocol via @lazarv/rsc. Client components are serialized as references,
 * and server components are executed on the server.
 *
 * Note: Client components must be registered using `registerClientReference`
 * from `@my-react/react-server/server` (re-exported from @lazarv/rsc/server)
 * for proper serialization.
 *
 * @param element - The root element to render
 * @param options - Rendering options
 * @returns A ReadableStream containing the Flight-encoded data
 *
 * @example
 * ```typescript
 * import { renderToFlightStream } from "@my-react/react-server/server";
 *
 * async function handler(req: Request) {
 *   const element = <App />;
 *   const stream = await renderToFlightStream(element, {
 *     onError: (error) => {
 *       console.error("RSC Error:", error);
 *       return error.message;
 *     },
 *   });
 *
 *   return new Response(stream, {
 *     headers: { "Content-Type": "text/x-component" },
 *   });
 * }
 * ```
 */
export async function renderToFlightStream(element: MyReactElementNode, options: RenderToFlightStreamOptions = {}): Promise<ReadableStream<Uint8Array>> {
  // Use client manifest resolver if provided, otherwise @lazarv/rsc handles references internally
  const moduleResolver = options.clientManifest ? createClientManifestResolver(options.clientManifest) : options.moduleResolver;

  // Create the Flight stream using @lazarv/rsc
  const stream = renderToReadableStream(element, {
    moduleResolver,
    onError: (error: unknown) => {
      // Call user-provided error handler
      if (options.onError) {
        const digest = options.onError(error);
        if (digest) {
          return digest;
        }
      }

      // Default: return error message as digest
      if (error instanceof Error) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.error("[@my-react/react-server] RSC rendering error:", error);
        }
        return error.message;
      }

      return String(error);
    },
    signal: options.signal,
    identifierPrefix: options.identifierPrefix,
  });

  return stream;
}
