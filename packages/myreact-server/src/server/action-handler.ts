import { decodeReply, decodeAction } from "@lazarv/rsc/server";
import { createElement } from "@my-react/react/type";

import { createClientErrorDigest, createPublicErrorMessage } from "../shared/error-digest";

import { renderToFlightStream } from "./render-to-flight-stream";
import { getServerAction } from "./server-reference-map";

import type { ModuleLoader } from "../shared/types";

/**
 * Module loader for decoding server action arguments
 */
const serverModuleLoader: ModuleLoader = {
  requireModule() {
    throw new Error("[@my-react/react-server] requireModule not available on server");
  },
  loadServerAction(id: string) {
    const action = getServerAction(id);
    if (!action) {
      throw new Error(`[@my-react/react-server] Server action "${id}" not found`);
    }
    return action;
  },
};

export type HandleServerActionOptions = {
  /**
   * When true (default), reject cross-site requests missing a matching Origin/Referer.
   * Set false only for trusted non-browser callers (e.g. local tests).
   * @default true
   */
  requireSameOrigin?: boolean;
};

/**
 * @public
 * Reject cross-site / forged Origin requests for server action POSTs.
 * Returns a Response when the request should be blocked; otherwise null.
 */
export function assertSameOriginActionRequest(request: Request): Response | null {
  const host = request.headers.get("host");
  if (!host) {
    return jsonError(400, "Missing Host header");
  }

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return jsonError(403, "Cross-site server action rejected");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== host) {
        return jsonError(403, "Origin does not match Host");
      }
      return null;
    } catch {
      return jsonError(403, "Invalid Origin header");
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host !== host) {
        return jsonError(403, "Referer does not match Host");
      }
      return null;
    } catch {
      return jsonError(403, "Invalid Referer header");
    }
  }

  // Browser fetch() same-origin POST sends Origin; missing both is treated as non-browser / CSRF-unsafe
  return jsonError(403, "Missing Origin or Referer for server action");
}

/**
 * Extract action id from FormData using the same field conventions as @lazarv/rsc decodeAction
 */
export function extractActionIdFromFormData(body: FormData): string | null {
  let actionId: string | null = null;
  let boundPrefix: string | null = null;

  for (const key of body.keys()) {
    if (key.startsWith("$ACTION_ID_")) {
      actionId = key.slice("$ACTION_ID_".length);
      break;
    }
    if (key.startsWith("$ACTION_REF_")) {
      boundPrefix = "$ACTION_" + key.slice("$ACTION_REF_".length) + ":";
      break;
    }
  }

  if (!actionId && !boundPrefix) {
    const legacy = body.get("$ACTION_ID");
    if (typeof legacy === "string") {
      actionId = legacy;
    }
  }

  if (boundPrefix) {
    const metadataPayload = body.get(boundPrefix + "0");
    if (metadataPayload && typeof metadataPayload === "string") {
      try {
        const parsed = JSON.parse(metadataPayload) as { id?: string } | string;
        if (parsed && typeof parsed === "object" && typeof parsed.id === "string") {
          actionId = parsed.id;
        } else if (typeof parsed === "string" && parsed.startsWith("$h")) {
          const refPayload = body.get(boundPrefix + parsed.slice(2));
          if (refPayload && typeof refPayload === "string") {
            const ref = JSON.parse(refPayload) as { id?: string };
            if (typeof ref.id === "string") {
              actionId = ref.id;
            }
          }
        }
      } catch {
        // ignore parse errors; decodeAction will fail later
      }
    }
  }

  return actionId;
}

/**
 * @public
 * Execute a server action with the given arguments
 *
 * This function decodes the action arguments from the request body
 * and executes the registered server action.
 *
 * @param actionId - The action ID
 * @param body - The request body (FormData or string)
 * @returns The action result
 *
 * @example
 * ```typescript
 * const result = await executeServerAction(
 *   "actions.ts#submitForm",
 *   formData
 * );
 * ```
 */
export async function executeServerAction(actionId: string, body: FormData | string): Promise<unknown> {
  const action = getServerAction(actionId);

  if (!action) {
    throw new ServerActionNotFoundError(actionId);
  }

  let args: unknown[];

  try {
    if (body instanceof FormData) {
      const formActionId = extractActionIdFromFormData(body);
      if (formActionId && formActionId !== actionId) {
        throw new Error(`FormData action id "${formActionId}" does not match header "${actionId}"`);
      }

      // Decode FormData using @lazarv/rsc
      const decodedAction = await decodeAction(body, {
        moduleLoader: serverModuleLoader,
      });

      if (typeof decodedAction === "function") {
        // decodeAction returns a bound/unbound action from FormData — header id already verified
        return await decodedAction();
      }

      // If not a function, decode as reply
      args = (await decodeReply(body, {
        moduleLoader: serverModuleLoader,
      })) as unknown[];
    } else {
      // Decode string body
      args = (await decodeReply(body, {
        moduleLoader: serverModuleLoader,
      })) as unknown[];
    }
  } catch (error) {
    throw new ServerActionDecodeError(actionId, error);
  }

  // Execute the action
  try {
    const result = await action(...(Array.isArray(args) ? args : [args]));
    return result;
  } catch (error) {
    throw new ServerActionExecutionError(actionId, error);
  }
}

/**
 * @public
 * Handle a server action HTTP request
 *
 * This function handles the full request lifecycle:
 * 1. Same-origin check (CSRF mitigation)
 * 2. Extract action ID from header
 * 3. Decode and execute the action
 * 4. Serialize the result to Flight format
 *
 * @param request - The HTTP request
 * @returns The HTTP response with Flight-encoded result
 *
 * @example
 * ```typescript
 * // In your server handler
 * if (request.method === "POST" && request.headers.get("React-Server-Action")) {
 *   return handleServerAction(request);
 * }
 * ```
 */
export async function handleServerAction(request: Request, options: HandleServerActionOptions = {}): Promise<Response> {
  const requireSameOrigin = options.requireSameOrigin !== false;
  if (requireSameOrigin) {
    const blocked = assertSameOriginActionRequest(request);
    if (blocked) {
      return blocked;
    }
  }

  const actionId = request.headers.get("React-Server-Action");

  if (!actionId) {
    return jsonError(400, "Missing React-Server-Action header");
  }

  // Decode action ID (may be URL-encoded)
  const decodedActionId = decodeURIComponent(actionId);

  // Check if action exists
  if (!getServerAction(decodedActionId)) {
    return jsonError(404, "Server action not found");
  }

  try {
    // Get request body
    const contentType = request.headers.get("Content-Type") || "";
    let body: FormData | string;

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }

    // Execute the action
    const result = await executeServerAction(decodedActionId, body);

    // Serialize result to Flight stream
    const stream = await renderToFlightStream(result as any, {
      onError: (error) => createClientErrorDigest(error, "A"),
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/x-component",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[@my-react/react-server] Server action error:", error);

    // Encode failures as Flight (same as success) so callServer can createFromReadableStream.
    // CSRF / missing-header rejects above stay JSON — those never reach the Flight client path.
    return flightErrorResponse(error, 500);
  }
}

/**
 * Serialize an action failure as a Flight stream that rejects on the client.
 */
async function flightErrorResponse(error: unknown, status: number): Promise<Response> {
  const digest = createClientErrorDigest(error, "A");
  const thrown = error instanceof Error ? error : new Error(createPublicErrorMessage("Server action failed", error));
  (thrown as Error & { digest?: string }).digest = digest;

  function ActionErrorBoundary(): never {
    throw thrown;
  }

  const stream = await renderToFlightStream(createElement(ActionErrorBoundary) as never, {
    onError: () => digest,
  });

  return new Response(stream, {
    status,
    headers: {
      "Content-Type": "text/x-component",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Error thrown when a server action is not found
 */
export class ServerActionNotFoundError extends Error {
  constructor(actionId: string) {
    super(`[@my-react/react-server] Server action "${actionId}" not found`);
    this.name = "ServerActionNotFoundError";
  }
}

/**
 * Error thrown when decoding action arguments fails
 */
export class ServerActionDecodeError extends Error {
  readonly originalError: unknown;

  constructor(actionId: string, cause: unknown) {
    super(`[@my-react/react-server] Failed to decode arguments for action "${actionId}": ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = "ServerActionDecodeError";
    this.originalError = cause;
  }
}

/**
 * Error thrown when executing an action fails
 */
export class ServerActionExecutionError extends Error {
  readonly originalError: unknown;

  constructor(actionId: string, cause: unknown) {
    super(`[@my-react/react-server] Failed to execute action "${actionId}": ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = "ServerActionExecutionError";
    this.originalError = cause;
  }
}
