import { createFromReadableStream, createFromFetch, encodeReply, createServerReference } from "@lazarv/rsc/client";

import { createModuleLoader } from "./moduleLoader";

import type { FlightClientOptions, ModuleLoader } from "../shared/types";

/**
 * @public
 * Flight client for consuming RSC streams and invoking server actions
 */
export interface FlightClient {
  /**
   * Hydrate a container with a Flight stream
   */
  hydrate(container: Element, stream: ReadableStream<Uint8Array>): Promise<unknown>;

  /**
   * Consume a Flight stream and return the React element tree
   */
  createFromStream(stream: ReadableStream<Uint8Array>): Promise<unknown>;

  /**
   * Consume a Flight stream from a fetch response
   */
  createFromFetch(responsePromise: Promise<Response>): Promise<unknown>;

  /**
   * Call a server action
   */
  callServer(actionId: string, args: unknown[]): Promise<unknown>;

  /**
   * Create a callable server action reference
   */
  createServerAction(actionId: string): (...args: unknown[]) => Promise<unknown>;

  /**
   * Encode arguments for a server action call
   */
  encodeArgs(args: unknown[]): Promise<FormData | string>;
}

/**
 * @public
 * Create a Flight client instance
 *
 * The Flight client handles:
 * - Consuming Flight streams from the server
 * - Loading client component modules
 * - Invoking server actions
 *
 * @param options - Client configuration options
 * @returns FlightClient instance
 *
 * @example
 * ```typescript
 * const client = createFlightClient({
 *   actionEndpoint: "/__rsc_action",
 * });
 *
 * // Consume a Flight stream
 * const response = await fetch("/page");
 * const element = await client.createFromFetch(response);
 *
 * // Hydrate the page
 * hydrateRoot(document.getElementById("root"), element);
 * ```
 */
export function createFlightClient(options: FlightClientOptions = {}): FlightClient {
  const { moduleLoader: customModuleLoader, actionEndpoint = "/__rsc_action", fetch: customFetch = globalThis.fetch } = options;

  // Use custom or default module loader
  const moduleLoader: ModuleLoader = customModuleLoader || createModuleLoader();

  /**
   * Call a server action via HTTP POST
   */
  async function callServer(actionId: string, args: unknown[]): Promise<unknown> {
    const body = await encodeReply(args);

    const response = await customFetch(actionEndpoint, {
      method: "POST",
      headers: {
        "React-Server-Action": encodeURIComponent(actionId),
        ...(typeof body === "string" ? { "Content-Type": "text/plain" } : {}),
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`[@my-react/react-server] Server action failed: ${error}`);
    }

    // Consume the response as a Flight stream
    const result = createFromReadableStream(response.body!, {
      moduleLoader,
      callServer,
    });

    return result;
  }

  /**
   * Consume a Flight stream
   */
  function createFromStreamInternal(stream: ReadableStream<Uint8Array>): unknown {
    return createFromReadableStream(stream, {
      moduleLoader,
      callServer,
    });
  }

  /**
   * Consume a Flight stream from a fetch response
   */
  function createFromFetchInternal(responsePromise: Promise<Response>): unknown {
    return createFromFetch(responsePromise, {
      moduleLoader,
      callServer,
    });
  }

  /**
   * Hydrate a container with a Flight stream
   */
  async function hydrate(container: Element, stream: ReadableStream<Uint8Array>): Promise<unknown> {
    // Get the element tree from the Flight stream
    const element = await createFromStreamInternal(stream);

    // Import @my-react/react-dom dynamically to avoid circular deps
    // In practice, the user would call hydrateRoot directly
    try {
      const { hydrateRoot } = await import("@my-react/react-dom/client");
      return hydrateRoot(container, element as any);
    } catch {
      // If react-dom is not available, just return the element
      console.warn("[@my-react/react-server] @my-react/react-dom not available for hydration. " + "Use the element directly with hydrateRoot.");
      return element;
    }
  }

  /**
   * Create a callable server action
   */
  function createServerAction(actionId: string): (...args: unknown[]) => Promise<unknown> {
    return createServerReference(actionId, callServer);
  }

  /**
   * Encode action arguments
   */
  async function encodeArgs(args: unknown[]): Promise<FormData | string> {
    return encodeReply(args);
  }

  return {
    hydrate,
    createFromStream: createFromStreamInternal as (stream: ReadableStream<Uint8Array>) => Promise<unknown>,
    createFromFetch: createFromFetchInternal as (responsePromise: Promise<Response>) => Promise<unknown>,
    callServer,
    createServerAction,
    encodeArgs,
  };
}

/**
 * @public
 * Create a server action reference for use in client components
 *
 * @param actionId - The server action ID
 * @param callServerFn - The callServer function (usually from FlightClient)
 * @returns A callable function that invokes the server action
 *
 * @example
 * ```typescript
 * const submitForm = createServerActionReference(
 *   "actions.ts#submitForm",
 *   client.callServer
 * );
 *
 * // Use in component
 * <form action={submitForm}>...</form>
 * ```
 */
export function createServerActionReference(
  actionId: string,
  callServerFn: (actionId: string, args: unknown[]) => Promise<unknown>
): (...args: unknown[]) => Promise<unknown> {
  return createServerReference(actionId, callServerFn);
}

/**
 * Re-export encodeReply for direct use
 */
export { encodeReply };
