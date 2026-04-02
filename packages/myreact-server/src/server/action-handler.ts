import { decodeReply, decodeAction } from "@lazarv/rsc/server";

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
      // Decode FormData using @lazarv/rsc
      const decodedAction = await decodeAction(body, {
        moduleLoader: serverModuleLoader,
      });

      if (typeof decodedAction === "function") {
        // decodeAction returns a bound function, execute it
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
 * 1. Extract action ID from header
 * 2. Decode and execute the action
 * 3. Serialize the result to Flight format
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
export async function handleServerAction(request: Request): Promise<Response> {
  const actionId = request.headers.get("React-Server-Action");

  if (!actionId) {
    return new Response(JSON.stringify({ error: "Missing React-Server-Action header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Decode action ID (may be URL-encoded)
  const decodedActionId = decodeURIComponent(actionId);

  // Check if action exists
  if (!getServerAction(decodedActionId)) {
    return new Response(JSON.stringify({ error: `Server action "${decodedActionId}" not found` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
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
      onError: (error) => {
        console.error("[@my-react/react-server] Action response error:", error);
        return error instanceof Error ? error.message : String(error);
      },
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

    // Return error as Flight stream
    const errorMessage = error instanceof Error ? error.message : String(error);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
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
