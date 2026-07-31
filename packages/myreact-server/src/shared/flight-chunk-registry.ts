import type { ModuleLoader, ClientReferenceMetadata } from "./types";

export type FlightChunkRegistry = {
  /**
   * Wait until Flight module chunk `id` (from `$L<id>`) has been bound to an export.
   * Resolves with the module export value (usually a component function).
   */
  waitForChunk: (id: number) => Promise<unknown>;
};

type ChunkEntry = {
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  /** True once an I-row was seen and module load started */
  bound: boolean;
};

function normalizeIRowMetadata(raw: unknown): ClientReferenceMetadata {
  if (Array.isArray(raw)) {
    return {
      id: String(raw[0] ?? ""),
      chunks: (raw[1] as string[]) || [],
      name: typeof raw[2] === "string" ? raw[2] : "default",
    };
  }

  const record = (raw || {}) as ClientReferenceMetadata;
  return {
    id: record.id || "",
    chunks: record.chunks || [],
    name: record.name || "default",
  };
}

function pickExport(moduleNamespace: unknown, exportName: string): unknown {
  if (typeof moduleNamespace === "object" && moduleNamespace !== null) {
    const record = moduleNamespace as Record<string, unknown>;
    return record[exportName] ?? record.default ?? moduleNamespace;
  }
  return moduleNamespace;
}

/**
 * Tee the Flight stream: one branch for `@lazarv/rsc`, one lightweight scan of `I` rows
 * so `$L<id>` loaders can await the same module binding without a never-settling Promise.
 */
export function attachFlightChunkRegistry(
  stream: ReadableStream<Uint8Array>,
  moduleLoader: ModuleLoader
): { stream: ReadableStream<Uint8Array>; registry: FlightChunkRegistry } {
  const [forDecode, forScan] = stream.tee();
  const entries = new Map<number, ChunkEntry>();

  const ensure = (id: number): ChunkEntry => {
    let entry = entries.get(id);
    if (!entry) {
      let resolve!: (value: unknown) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<unknown>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      // Avoid unhandled rejection if nobody awaits before reject
      promise.catch(() => undefined);
      entry = { promise, resolve, reject, bound: false };
      entries.set(id, entry);
    }
    return entry;
  };

  const bindModuleChunk = (id: number, metadata: ClientReferenceMetadata) => {
    const entry = ensure(id);
    if (entry.bound) return;
    entry.bound = true;
    Promise.resolve()
      .then(() => moduleLoader.requireModule(metadata))
      .then((mod) => {
        entry.resolve(pickExport(mod, metadata.name || "default"));
      })
      .catch((error) => {
        entry.reject(error);
      });
  };

  const scanIRows = async () => {
    const reader = forScan.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        buffer += decoder.decode(value, { stream: true });

        let newline = buffer.indexOf("\n");
        while (newline !== -1) {
          const line = buffer.slice(0, newline);
          buffer = buffer.slice(newline + 1);
          newline = buffer.indexOf("\n");

          // `3:I["/src/Foo.tsx",[],"default"]` or object metadata
          if (!line || line[0] === ":") continue;
          const colon = line.indexOf(":");
          if (colon <= 0) continue;
          if (line[colon + 1] !== "I") continue;

          const id = Number(line.slice(0, colon));
          if (!Number.isFinite(id)) continue;

          try {
            const metadata = normalizeIRowMetadata(JSON.parse(line.slice(colon + 2)));
            if (metadata.id) {
              bindModuleChunk(id, metadata);
            }
          } catch {
            // ignore malformed debug/partial lines
          }
        }
      }

      // Flush last line without trailing newline
      if (buffer && buffer.includes(":I")) {
        const colon = buffer.indexOf(":");
        if (colon > 0 && buffer[colon + 1] === "I") {
          const id = Number(buffer.slice(0, colon));
          if (Number.isFinite(id)) {
            try {
              const metadata = normalizeIRowMetadata(JSON.parse(buffer.slice(colon + 2)));
              if (metadata.id) {
                bindModuleChunk(id, metadata);
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (error) {
      for (const entry of entries.values()) {
        if (!entry.bound) entry.reject(error);
      }
      return;
    } finally {
      try {
        reader.releaseLock();
      } catch {
        // ignore
      }
    }

    // Stream ended — reject ids that never got an I-row (avoids forever-pending Suspense)
    for (const [id, entry] of entries) {
      if (!entry.bound) {
        entry.reject(new Error(`[@my-react/react-server] Flight stream ended before module chunk $${id} was bound`));
      }
    }
  };

  void scanIRows();

  return {
    stream: forDecode,
    registry: {
      waitForChunk: (id: number) => ensure(id).promise,
    },
  };
}
