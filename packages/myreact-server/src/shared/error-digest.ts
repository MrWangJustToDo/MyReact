/**
 * Client-facing error digests for Flight / HTTP responses.
 * Logs full details server-side; returns opaque messages outside __DEV__.
 */

let digestCounter = 0;

function isDev(): boolean {
  return typeof __DEV__ !== "undefined" && __DEV__;
}

/**
 * @public
 * Format an error for Flight `onError` digests or JSON error bodies.
 * In production returns a stable opaque id; in development returns the message.
 */
export function createClientErrorDigest(error: unknown, prefix = "E"): string {
  digestCounter += 1;
  const id = `${prefix}${digestCounter.toString(36)}`;

  if (isDev()) {
    if (error instanceof Error) {
      console.error(`[@my-react/react-server] ${id}:`, error);
      return error.message;
    }
    console.error(`[@my-react/react-server] ${id}:`, error);
    return String(error);
  }

  console.error(`[@my-react/react-server] ${id}:`, error);
  return `[@my-react/react-server] An error occurred (${id})`;
}

/**
 * @public
 * Stable public error string for JSON HTTP responses (no internal paths/ids).
 */
export function createPublicErrorMessage(fallback: string, error?: unknown): string {
  if (isDev() && error !== undefined) {
    return error instanceof Error ? error.message : String(error);
  }
  return fallback;
}
