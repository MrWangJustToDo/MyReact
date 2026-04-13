import { createFlightServer } from "@my-react/react-server/server";

import type { FlightServerOptions } from "@my-react/react-server/server";

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    loadModule?: (id: string) => Promise<unknown>;
  }
) {
  const moduleLoader = {
    async preloadModule(metadata: { id: string }) {
      if (options?.loadModule) {
        await options.loadModule(metadata.id);
        return;
      }
      await import(/* @vite-ignore */ metadata.id);
    },
    async requireModule(metadata: { id: string; name: string }) {
      if (options?.loadModule) {
        return await options.loadModule(metadata.id);
      }
      return await import(/* @vite-ignore */ metadata.id);
    },
  };

  const server = await createFlightServer({
    moduleLoader,
    resolveModuleId: (id: string) => `${id}?rsc-original`,
  } as FlightServerOptions);
  const htmlStream = await server.renderToStream(rscStream);

  const html = await readStreamToString(htmlStream);

  return { html };
}

async function readStreamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode();
  return result;
}
