import { createFromReadableStream, encodeReply, createServerReference } from "@lazarv/rsc/client";
import { __my_react_internal__, createElement, Suspense, use, type MyReactElement } from "@my-react/react/type";

import { attachFlightChunkRegistry } from "../shared/flight-chunk-registry";
import { normalizeRscValue } from "../shared/normalize-rsc";

import { createManifestModuleLoader, createModuleLoader } from "./module-loader";

import type { FlightChunkRegistry } from "../shared/flight-chunk-registry";
import type { FlightClientOptions, ModuleLoader } from "../shared/types";
import type { hydrateRoot } from "@my-react/react-dom/client";
import type { ReactNode } from "react";

const { cacheLazy } = __my_react_internal__;

/**
 * @public
 * Flight client for consuming RSC streams and invoking server actions
 */
export interface FlightClient {
  /**
   * Hydrate a container with a Flight stream
   */
  hydrate(container: Element, stream: ReadableStream<Uint8Array>): ReturnType<typeof hydrateRoot>;

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
export async function createFlightClient(options: FlightClientOptions = {}): Promise<FlightClient> {
  const { hydrateRoot } = await import("@my-react/react-dom/client");

  const { moduleLoader: customModuleLoader, clientManifest, actionEndpoint = "/__rsc_action", fetch: customFetch = globalThis.fetch } = options;

  // Use custom or default module loader
  const moduleLoader: ModuleLoader = customModuleLoader || (clientManifest ? createManifestModuleLoader(clientManifest) : createModuleLoader());

  /**
   * Call a server action via HTTP POST
   */
  async function callServer(actionId: string, args: unknown[]): Promise<unknown> {
    const body = await encodeReply(args);

    const response = await customFetch(actionEndpoint, {
      method: "POST",
      headers: {
        "React-Server-Action": encodeURIComponent(actionId),
        // Helps same-origin middleware; browsers also send Origin automatically
        "X-My-React-RSC-Action": "1",
        ...(typeof body === "string" ? { "Content-Type": "text/plain" } : {}),
      },
      body,
      credentials: "same-origin",
    });

    const contentType = response.headers.get("Content-Type") || "";

    // Flight action results (success or encoded error) — same normalize path as createFromStream
    if (contentType.includes("text/x-component") && response.body) {
      return decodeFlightStream(response.body, moduleLoader, callServer);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`[@my-react/react-server] Server action failed: ${error}`);
    }

    throw new Error(`[@my-react/react-server] Server action returned unexpected Content-Type: ${contentType || "(empty)"}`);
  }

  if (typeof globalThis !== "undefined") {
    globalThis.__MY_REACT_CALL_SERVER__ = callServer;
  }

  /**
   * Consume a Flight stream
   */
  function createFromStreamInternal(stream: ReadableStream<Uint8Array>): Promise<unknown> {
    return decodeFlightStream(stream, moduleLoader, callServer);
  }

  /**
   * Consume a Flight stream from a fetch response
   */
  function createFromFetchInternal(responsePromise: Promise<Response>): Promise<unknown> {
    return Promise.resolve(responsePromise).then(async (response) => {
      if (!response.body) {
        throw new Error("[@my-react/react-server] Missing response body for Flight fetch");
      }
      return decodeFlightStream(response.body, moduleLoader, callServer);
    });
  }

  /**
   * Hydrate a container with a Flight stream
   */
  function hydrate(container: Element, rscStream: ReadableStream<Uint8Array>) {
    // Get the element tree from the Flight stream
    const payloadPromise = createFromStreamInternal(rscStream);

    function SsrRoot() {
      const ele = use(payloadPromise) as MyReactElement;

      return ele;
    }

    const shell = createElement(Suspense, { fallback: createElement("div", { className: "loading" }, "Loading...") }, createElement(SsrRoot));

    return hydrateRoot(container, shell as ReactNode);
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
    createFromStream: createFromStreamInternal,
    createFromFetch: createFromFetchInternal,
    callServer,
    createServerAction,
    encodeArgs,
  };
}

type PromiseWithState<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  _value?: T;
  _reason?: unknown;
};

function decodeFlightStream(
  stream: ReadableStream<Uint8Array>,
  moduleLoader: ModuleLoader,
  callServer?: (id: string, args: unknown[]) => Promise<unknown>
): PromiseWithState<unknown> {
  const { stream: decodeStream, registry } = attachFlightChunkRegistry(stream, moduleLoader);
  const result = createFromReadableStream(decodeStream, {
    moduleLoader,
    callServer,
  }) as Promise<unknown>;
  return wrapPromiseWithState(result, moduleLoader, registry);
}

function wrapPromiseWithState(value: Promise<unknown>, moduleLoader: ModuleLoader, flightChunks?: FlightChunkRegistry): PromiseWithState<unknown> {
  const normalizedPromise = Promise.resolve(value).then((resolved) =>
    normalizeRscValue(resolved, {
      moduleLoader,
      flightChunks,
      wrapPendingPromise: (promise) => createElement(cacheLazy(promise as Promise<any>)),
    })
  );
  const promiseWithState = normalizedPromise as PromiseWithState<unknown>;

  return promiseWithState;
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
  callServerFn?: (actionId: string, args: unknown[]) => Promise<unknown>
): (...args: unknown[]) => Promise<unknown> {
  // Lazily resolve callServer so proxies can be created before createFlightClient runs
  const callServer = (id: string, args: unknown[]): Promise<unknown> => {
    const resolvedCallServer = callServerFn ?? (typeof globalThis !== "undefined" ? globalThis.__MY_REACT_CALL_SERVER__ : undefined);

    if (!resolvedCallServer) {
      throw new Error("[@my-react/react-server] Missing callServer function. Create a FlightClient or pass callServer explicitly.");
    }

    return resolvedCallServer(id, args);
  };

  return createServerReference(actionId, callServer);
}

/**
 * Re-export encodeReply for direct use
 */
export { encodeReply };
