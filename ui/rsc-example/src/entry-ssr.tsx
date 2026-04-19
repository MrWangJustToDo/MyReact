import { createFlightServer } from "@my-react/react-server/server";

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    loadModule?: (id: string) => Promise<unknown>;
  }
) {
  // Simple module loading - just load and cache
  const loadedModules = new Map<string, unknown>();

  const moduleLoader = {
    async preloadModule(metadata: { id: string }) {
      if (loadedModules.has(metadata.id)) return;

      const mod = options?.loadModule ? await options.loadModule(metadata.id) : await import(/* @vite-ignore */ metadata.id);
      loadedModules.set(metadata.id, mod);
    },
    async requireModule(metadata: { id: string; name: string }) {
      if (loadedModules.has(metadata.id)) {
        return loadedModules.get(metadata.id);
      }

      const mod = options?.loadModule ? await options.loadModule(metadata.id) : await import(/* @vite-ignore */ metadata.id);
      loadedModules.set(metadata.id, mod);
      return mod;
    },
  };

  const server = await createFlightServer({ moduleLoader });

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
