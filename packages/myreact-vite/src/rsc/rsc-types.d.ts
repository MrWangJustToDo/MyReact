/**
 * Type declarations for @lazarv/rsc
 * These are minimal declarations for the RSC plugin functionality
 */

declare module "@lazarv/rsc/server" {
  export interface RenderOptions {
    moduleResolver?: {
      resolveClientReference?: (reference: unknown) => unknown;
      resolveServerReference?: (reference: unknown) => unknown;
    };
    onError?: (error: unknown) => string | undefined;
    signal?: AbortSignal;
    identifierPrefix?: string;
  }

  export function renderToReadableStream(element: unknown, options?: RenderOptions): ReadableStream<Uint8Array>;

  export function decodeReply(body: string | FormData): Promise<unknown>;

  export function decodeAction(body: FormData): Promise<() => Promise<unknown>>;

  export function encodeReply(value: unknown): Promise<string>;
}

declare module "@lazarv/rsc/client" {
  export interface CreateFromOptions {
    moduleLoader?: {
      requireModule?: (metadata: unknown) => unknown;
      preloadModule?: (metadata: unknown) => Promise<void>;
    };
    callServer?: (actionId: string, args: unknown) => Promise<unknown>;
    ssrManifest?: unknown;
  }

  export function createFromReadableStream(stream: ReadableStream<Uint8Array>, options?: CreateFromOptions): Promise<unknown>;

  export function createFromFetch(responsePromise: Promise<Response>, options?: CreateFromOptions): Promise<unknown>;

  export function encodeReply(value: unknown): Promise<string>;
}
