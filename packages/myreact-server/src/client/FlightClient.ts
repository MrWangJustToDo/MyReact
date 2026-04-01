import { createFromReadableStream, createFromFetch, encodeReply, createServerReference } from "@lazarv/rsc/client";
import { createElement, isValidElement, lazy, type MyReactElement } from "@my-react/react";
import { Lazy as REACT_LAZY_TYPE, CLIENT_REFERENCE_SYMBOL as REACT_CLIENT_REFERENCE, isPromise } from "@my-react/react-shared";

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

  if (typeof globalThis !== "undefined") {
    (globalThis as unknown as { __MY_REACT_CALL_SERVER__?: (actionId: string, args: unknown[]) => Promise<unknown> }).__MY_REACT_CALL_SERVER__ = callServer;
  }

  /**
   * Consume a Flight stream
   */
  async function createFromStreamInternal(stream: ReadableStream<Uint8Array>): Promise<unknown> {
    const result = await createFromReadableStream(stream, {
      moduleLoader,
      callServer,
    });
    return normalizeRscValue(result, moduleLoader);
  }

  /**
   * Consume a Flight stream from a fetch response
   */
  async function createFromFetchInternal(responsePromise: Promise<Response>): Promise<unknown> {
    const result = await createFromFetch(responsePromise, {
      moduleLoader,
      callServer,
    });
    return normalizeRscValue(result, moduleLoader);
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
      return hydrateRoot(container, element as MyReactElement);
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

function createLazyFromRscLazy(rscLazy: { _payload: unknown; _init: (payload: unknown) => unknown }): Record<string, unknown> {
  return lazy(async () => {
    try {
      return (await rscLazy._init(rscLazy._payload)) as Promise<any>;
    } catch (error) {
      if (error && typeof (error as { then?: unknown }).then === "function") {
        return await (error as Promise<unknown>);
      }
      throw error;
    }
  });
}

function createLazyFromClientReference(
  reference: { $$id?: string; $$name?: string; $$metadata?: { id: string; name?: string } },
  moduleLoader: ModuleLoader
): Record<string, unknown> {
  return lazy(async () => {
    const metadata = reference.$$metadata ?? { id: reference.$$id ?? "", name: reference.$$name ?? "default" };
    const result = moduleLoader.requireModule(metadata as { id: string; name: string });
    const resolved = result && typeof (result as Promise<unknown>).then === "function" ? await (result as Promise<unknown>) : result;
    const exportName = metadata.name || "default";
    return (
      typeof resolved === "object" && resolved !== null
        ? ((resolved as Record<string, unknown>)[exportName] ?? (resolved as Record<string, unknown>).default ?? resolved)
        : resolved
    ) as Promise<any>;
  });
}

function normalizeRscType(type: unknown, moduleLoader: ModuleLoader): unknown {
  if (!type || typeof type !== "object") {
    return type;
  }

  const typed = type as {
    $$typeof?: symbol;
    _payload?: unknown;
    _init?: (payload: unknown) => unknown;
    loader?: unknown;
    $$id?: string;
    $$name?: string;
    $$metadata?: { id: string; name?: string };
  };

  if (typed.$$typeof === REACT_LAZY_TYPE && typeof typed.loader !== "function" && typeof typed._init === "function") {
    return createLazyFromRscLazy({ _payload: typed._payload, _init: typed._init });
  }

  if (typed.$$typeof === REACT_CLIENT_REFERENCE) {
    return createLazyFromClientReference({ $$id: typed.$$id, $$name: typed.$$name, $$metadata: typed.$$metadata }, moduleLoader);
  }

  return type;
}

function normalizeRscValue(value: unknown, moduleLoader: ModuleLoader): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRscValue(item, moduleLoader));
  }

  if (isValidElement(value)) {
    const element = value;
    const nextType = normalizeRscType(element.type, moduleLoader);
    const nextProps = element.props ? normalizeRscValue(element.props, moduleLoader) : element.props;
    const props = (nextProps || {}) as MyReactElement["props"];
    const children = props.children !== undefined ? normalizeChildrenValue(props.children, moduleLoader) : props.children;
    return {
      ...element,
      type: nextType,
      props: { ...props, children },
    };
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      const normalized = normalizeRscValue(record[key], moduleLoader);
      next[key] = normalized;
      if (normalized !== record[key]) {
        changed = true;
      }
    }
    return changed ? next : value;
  }

  return value;
}

function normalizeChildrenValue(value: unknown, moduleLoader: ModuleLoader): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeChildrenValue(item, moduleLoader));
  }

  if (isPromise(value)) {
    const promiseValue = value as PromiseWithState<unknown>;
    // if (promiseValue.status === "fulfilled") {
    //   return normalizeChildrenValue(promiseValue._value, moduleLoader);
    // }
    // if (promiseValue.status === "rejected") {
    //   throw promiseValue._reason;
    // }
    const ele = lazy(() => promiseValue as Promise<any>);

    return createElement(ele);
  }

  return normalizeRscValue(value, moduleLoader);
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
  const resolvedCallServer =
    callServerFn ??
    (typeof globalThis !== "undefined"
      ? (globalThis as unknown as { __MY_REACT_CALL_SERVER__?: (actionId: string, args: unknown[]) => Promise<unknown> }).__MY_REACT_CALL_SERVER__
      : undefined);

  if (!resolvedCallServer) {
    throw new Error("[@my-react/react-server] Missing callServer function. Create a FlightClient or pass callServer explicitly.");
  }

  return createServerReference(actionId, resolvedCallServer);
}

/**
 * Re-export encodeReply for direct use
 */
export { encodeReply };
