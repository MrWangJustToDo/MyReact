export { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "@my-react/react-shared";
/**
 * @public
 * Metadata for a client component reference
 */
export interface ClientReferenceMetadata {
  /** Module ID or file path */
  id: string;
  /** Export name (e.g., "default" or named export) */
  name: string;
  /** Optional chunk IDs for preloading */
  chunks?: string[];
  /** Optional css dependencies */
  css?: string[];
}

/**
 * @public
 * Client manifest entry for RSC module resolution
 */
export interface ClientManifestEntry {
  /** Resolved module id (typically chunk path in production) */
  id: string;
  /** Export name */
  name: string;
  /** Optional chunk IDs for preloading */
  chunks?: string[];
  /** Optional css dependencies */
  css?: string[];
}

/**
 * @public
 * Client manifest mapping reference id to entry
 */
export type ClientManifest = Record<string, ClientManifestEntry>;

/**
 * @public
 * Server action manifest entry
 */
export interface ServerActionManifestEntry {
  /** Action id */
  id: string;
  /** Export name */
  name: string;
  /** Module id containing the action */
  moduleId: string;
}

/**
 * @public
 * Server action manifest mapping action id to entry
 */
export type ServerActionManifest = Record<string, ServerActionManifestEntry>;

/**
 * @public
 * Metadata for a server action reference
 */
export interface ServerReferenceMetadata {
  /** Action ID (e.g., "module#functionName") */
  id: string;
  /** Export name */
  name: string;
  /** Whether the action has bound arguments */
  bound?: boolean;
}

/**
 * @public
 * Module resolver interface for @lazarv/rsc server-side serialization
 */
export interface ModuleResolver {
  /**
   * Resolve a client reference to metadata for Flight serialization
   */
  resolveClientReference?(reference: ClientReference): ClientReferenceMetadata | null;

  /**
   * Resolve a server reference to metadata for Flight serialization
   */
  resolveServerReference?(reference: ServerReference): ServerReferenceMetadata | null;
}

/**
 * @public
 * Module loader interface for @lazarv/rsc client-side deserialization
 */
export interface ModuleLoader {
  /**
   * Synchronously load a module export
   */
  requireModule(metadata: ClientReferenceMetadata): unknown | Promise<unknown>;

  /**
   * Optionally preload module chunks
   */
  preloadModule?(metadata: ClientReferenceMetadata): Promise<void> | void;

  /**
   * Load a server action by ID (for decoding replies)
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  loadServerAction?(id: string): Promise<Function> | Function;
}

/**
 * @public
 * Client reference marker object
 */
export interface ClientReference {
  $$typeof: symbol;
  $$id: string;
  $$name: string;
}

/**
 * @public
 * Server reference marker object
 */
export interface ServerReference {
  $$typeof: symbol;
  $$id: string;
  $$name: string;
  $$bound?: unknown[];
}

/**
 * @public
 * Options for renderToFlightStream
 */
export interface RenderToFlightStreamOptions {
  /** Module resolver for client/server references */
  moduleResolver?: ModuleResolver;

  /** Optional client manifest for client reference resolution */
  clientManifest?: ClientManifest;

  /** Error handler - return digest string for client */
  onError?: (error: unknown) => string | void;

  /** Abort signal for cancellation */
  signal?: AbortSignal;

  /** Identifier prefix for generated IDs */
  identifierPrefix?: string;
}

/**
 * @public
 * Options for createFlightClient
 */
export interface FlightClientOptions {
  /** Module loader for client components */
  moduleLoader?: ModuleLoader;

  /** Optional client manifest for module resolution */
  clientManifest?: ClientManifest;

  /** Server action endpoint URL */
  actionEndpoint?: string;

  /** Custom fetch implementation */
  fetch?: typeof globalThis.fetch;
}

/**
 * @public
 * Options for createFlightServer
 */
export interface FlightServerOptions {
  /** Module loader for resolving client references on the server */
  moduleLoader?: ModuleLoader;

  /**
   * Optional mapper to resolve real module id for SSR
   * e.g. append query to bypass RSC transforms
   */
  resolveModuleId?: (id: string) => string;
}

/**
 * @public
 * Server action handler request
 */
export interface ServerActionRequest {
  /** Action ID from header */
  actionId: string;

  /** Request body (FormData or string) */
  body: FormData | string;

  /** Original request for context */
  request: Request;
}

/**
 * @public
 * Server action handler response
 */
export interface ServerActionResponse {
  /** Flight stream with result */
  stream: ReadableStream<Uint8Array>;

  /** HTTP status code */
  status: number;

  /** Response headers */
  headers: Headers;
}
