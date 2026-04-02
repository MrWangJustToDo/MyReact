import { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "../shared/types";

import type { ClientReferenceMetadata, ServerReferenceMetadata, ModuleResolver, ClientReference, ServerReference } from "../shared/types";
import type { MyReactElementNode } from "@my-react/react";

/**
 * @internal
 * Server Component Dispatch for RSC rendering
 *
 * This is a lightweight dispatch that handles server component resolution
 * without full DOM rendering capabilities. It's used to process the component
 * tree and prepare it for Flight serialization.
 */
export class ServerComponentDispatch {
  /**
   * Map of client references by module ID
   */
  private clientReferenceMap: Map<string, ClientReferenceMetadata> = new Map();

  /**
   * Map of server actions by action ID
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private serverReferenceMap: Map<string, Function> = new Map();

  /**
   * Register a client reference for Flight serialization
   */
  registerClientReference(moduleId: string, exportName: string, metadata?: Partial<ClientReferenceMetadata>): void {
    const key = `${moduleId}#${exportName}`;
    this.clientReferenceMap.set(key, {
      id: moduleId,
      name: exportName,
      chunks: metadata?.chunks || [],
    });
  }

  /**
   * Register a server action for Flight serialization
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  registerServerReference(actionId: string, fn: Function): void {
    this.serverReferenceMap.set(actionId, fn);
  }

  /**
   * Get a registered server action by ID
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  getServerAction(actionId: string): Function | undefined {
    return this.serverReferenceMap.get(actionId);
  }

  /**
   * Get the module resolver interface for @lazarv/rsc
   */
  getModuleResolver(): ModuleResolver {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const dispatch = this;

    return {
      resolveClientReference(reference: ClientReference): ClientReferenceMetadata | null {
        if (reference.$$typeof !== CLIENT_REFERENCE_SYMBOL) {
          return null;
        }

        const key = `${reference.$$id}#${reference.$$name}`;
        const cached = dispatch.clientReferenceMap.get(key);

        if (cached) {
          return cached;
        }

        // Return basic metadata if not explicitly registered
        return {
          id: reference.$$id,
          name: reference.$$name,
          chunks: [],
        };
      },

      resolveServerReference(reference: ServerReference): ServerReferenceMetadata | null {
        if (reference.$$typeof !== SERVER_REFERENCE_SYMBOL) {
          return null;
        }

        return {
          id: reference.$$id,
          name: reference.$$name,
          bound: reference.$$bound !== undefined,
        };
      },
    };
  }

  /**
   * Process a server component (async function component)
   *
   * This method executes the async component and returns its result
   * for child reconciliation.
   */
  async processServerComponent(
    component: (props: Record<string, unknown>) => Promise<MyReactElementNode>,
    props: Record<string, unknown>
  ): Promise<MyReactElementNode> {
    const result = await component(props);
    return result;
  }

  /**
   * Check if an element type is a client reference
   */
  isClientReference(elementType: unknown): elementType is ClientReference {
    return typeof elementType === "object" && elementType !== null && (elementType as ClientReference).$$typeof === CLIENT_REFERENCE_SYMBOL;
  }

  /**
   * Check if an element type is a server reference (action)
   */
  isServerReference(elementType: unknown): elementType is ServerReference {
    return typeof elementType === "object" && elementType !== null && (elementType as ServerReference).$$typeof === SERVER_REFERENCE_SYMBOL;
  }

  /**
   * Check if a function is an async function (potential server component)
   */
  isAsyncFunction(fn: unknown): fn is (...args: unknown[]) => Promise<unknown> {
    return typeof fn === "function" && fn.constructor.name === "AsyncFunction";
  }
}
