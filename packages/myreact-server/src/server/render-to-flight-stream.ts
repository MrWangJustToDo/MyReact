import { renderToReadableStream } from "@lazarv/rsc/server";

import { createClientManifestResolver } from "./manifest";
import { ServerComponentDispatch } from "./server-component-dispatch";

import type { RenderToFlightStreamOptions, ModuleResolver } from "../shared/types";
import type { MyReactElementNode } from "@my-react/react";

/**
 * Default module resolver when none is provided
 */
const defaultModuleResolver: ModuleResolver = {
  resolveClientReference(reference) {
    // Default: return the reference as-is
    return {
      id: (reference as { $$id: string }).$$id || String(reference),
      name: (reference as { $$name: string }).$$name || "default",
      chunks: [],
    };
  },
  resolveServerReference(reference) {
    return {
      id: (reference as { $$id: string }).$$id || String(reference),
      name: (reference as { $$name: string }).$$name || "default",
    };
  },
};

/**
 * @public
 * Render a MyReact element tree to a Flight protocol ReadableStream
 *
 * This function serializes the server component tree using the React Flight
 * protocol via @lazarv/rsc. Client components are serialized as references,
 * and server components are executed on the server.
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
  const dispatch = new ServerComponentDispatch();

  const moduleResolver =
    options.moduleResolver || (options.clientManifest ? createClientManifestResolver(options.clientManifest) : dispatch.getModuleResolver());

  // Create the Flight stream using @lazarv/rsc
  const stream = renderToReadableStream(element, {
    moduleResolver: moduleResolver || defaultModuleResolver,
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

/**
 * @public
 * Create a ServerComponentDispatch instance for advanced use cases
 *
 * This is useful when you need to register client/server references
 * manually or access the dispatch methods directly.
 *
 * @returns A new ServerComponentDispatch instance
 */
export function createServerDispatch(): ServerComponentDispatch {
  return new ServerComponentDispatch();
}
