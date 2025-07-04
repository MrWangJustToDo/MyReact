import type { SocketUrlParts } from "./getSocketUrlParts";
import type { WDSMetaObj } from "./getWDSMetadata";

/**
 * Create a valid URL from parsed URL parts.
 * @param urlParts The parsed URL parts.
 * @param metadata The parsed WDS metadata object.
 * @returns The generated URL.
 */
export default function urlFromParts(urlParts: SocketUrlParts, metadata: WDSMetaObj = {}): string {
  let fullProtocol = "http:";
  if (urlParts.protocol) {
    fullProtocol = urlParts.protocol;
  }
  if (metadata.enforceWs) {
    fullProtocol = fullProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
  }

  fullProtocol = `${fullProtocol}//`;

  let fullHost = urlParts.hostname;
  if (urlParts.auth) {
    const fullAuth = `${urlParts.auth.split(":").map(encodeURIComponent).join(":")}@`;
    fullHost = fullAuth + fullHost;
  }
  if (urlParts.port) {
    fullHost = `${fullHost}:${urlParts.port}`;
  }

  const url = new URL(urlParts.pathname, fullProtocol + fullHost);
  return url.href;
}
