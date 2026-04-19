/**
 * @file RSC Bootstrap Plugin
 * Inject RSC configuration and client-side stream integration into HTML
 *
 * Uses rsc-html-stream pattern for client-side RSC payload consumption
 */

import type { Plugin, ResolvedConfig } from "vite";

export interface BootstrapPluginOptions {
  rscEndpoint: string;
  actionEndpoint: string;
}

/**
 * Create the RSC bootstrap plugin
 * Injects RSC configuration and rsc-html-stream client integration into the HTML head
 * Also automatically injects client-registry import in build mode
 */
export function createBootstrapPlugin(options: BootstrapPluginOptions): Plugin {
  const { rscEndpoint, actionEndpoint } = options;
  let config: ResolvedConfig;

  return {
    name: "vite:my-react-rsc-bootstrap",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // Inject client-registry import at the top of client entry in build mode
    transform(code, id) {
      // Only transform in client environment during build
      if (this.environment?.name !== "client" || config.command !== "build") {
        return null;
      }

      // Check if this is the client entry
      const clientEntry = config.environments?.client?.build?.rollupOptions?.input;
      if (!clientEntry) return null;

      const entryPath = typeof clientEntry === "string" ? clientEntry : (clientEntry as Record<string, string>)?.index;
      if (!entryPath) return null;

      // Normalize paths for comparison
      const normalizedId = id.replace(/\\/g, "/");
      const normalizedEntry = entryPath.replace(/^\.\//, "").replace(/\\/g, "/");

      // Check if this is the entry file
      if (!normalizedId.endsWith(normalizedEntry) && !normalizedId.includes(`/${normalizedEntry}`)) {
        return null;
      }

      // Inject client-registry import at the top
      const importStatement = `import "virtual:my-react-rsc/client-registry";\n`;

      // Don't add if already present
      if (code.includes("virtual:my-react-rsc/client-registry")) {
        return null;
      }

      return {
        code: importStatement + code,
        map: null,
      };
    },

    transformIndexHtml() {
      // Inject bootstrap script for RSC hydration
      // This includes the rsc-html-stream client pattern for reading
      // RSC payload from script tags injected by the server
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: `
// MyReact RSC Bootstrap
window.__MY_REACT_RSC_CONFIG__ = {
  rscEndpoint: ${JSON.stringify(rscEndpoint)},
  actionEndpoint: ${JSON.stringify(actionEndpoint)},
};

// RSC Stream Client (based on rsc-html-stream/client)
// Creates a ReadableStream from RSC payload injected by the server
(function() {
  const encoder = new TextEncoder();
  let streamController;

  window.__MY_REACT_RSC_STREAM__ = new ReadableStream({
    start(controller) {
      if (typeof window === 'undefined') {
        return;
      }
      const handleChunk = (chunk) => {
        if (typeof chunk === 'string') {
          controller.enqueue(encoder.encode(chunk));
        } else {
          controller.enqueue(chunk);
        }
      };
      // Initialize or use existing flight data array
      window.__FLIGHT_DATA = window.__FLIGHT_DATA || [];
      window.__FLIGHT_DATA.forEach(handleChunk);
      // Override push to handle new chunks as they arrive
      window.__FLIGHT_DATA.push = (chunk) => {
        handleChunk(chunk);
      };
      streamController = controller;
    },
  });

  // Close the stream when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      streamController?.close();
    });
  } else {
    streamController?.close();
  }
})();
          `,
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

/**
 * Get the RSC stream on the client
 * This is the ReadableStream containing the RSC payload
 * that was injected by the server
 */
export function getClientRSCStream(): ReadableStream<Uint8Array> | null {
  if (typeof window !== "undefined") {
    return (window as unknown as { __MY_REACT_RSC_STREAM__?: ReadableStream<Uint8Array> }).__MY_REACT_RSC_STREAM__ ?? null;
  }
  return null;
}
