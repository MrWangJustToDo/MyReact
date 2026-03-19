/**
 * Type declarations for rsc-html-stream
 */

declare module "rsc-html-stream/server" {
  export interface InjectRSCPayloadOptions {
    nonce?: string;
  }

  /**
   * Create a TransformStream that injects RSC payload into HTML stream
   */
  export function injectRSCPayload(rscStream: ReadableStream<Uint8Array>, options?: InjectRSCPayloadOptions): TransformStream<Uint8Array, Uint8Array>;
}

declare module "rsc-html-stream/client" {
  /**
   * A ReadableStream that contains the RSC payload injected into the HTML
   * by the server. Use this to hydrate the page on the client.
   */
  export const rscStream: ReadableStream<Uint8Array>;
}
