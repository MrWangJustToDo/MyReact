import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the HTML document shell used for SSR responses.
 *
 * Dev: Vite middleware sets `__MY_REACT_RSC_GET_HTML_TEMPLATE__` (transformIndexHtml).
 * Prod: read the built `dist/client/index.html` next to `dist/rsc`.
 */
export async function getHtmlShell(requestUrl: string): Promise<string> {
  const getter = (globalThis as unknown as { __MY_REACT_RSC_GET_HTML_TEMPLATE__?: (url: string) => Promise<string> }).__MY_REACT_RSC_GET_HTML_TEMPLATE__;

  if (typeof getter === "function") {
    return getter(requestUrl);
  }

  const htmlPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../client/index.html");
  return readFile(htmlPath, "utf-8");
}
