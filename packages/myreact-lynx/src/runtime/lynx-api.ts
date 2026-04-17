/**
 * Additional Lynx API extensions for MyReact Lynx.
 *
 * These are helper functions that wrap Lynx's native APIs for easier use
 * in React components.
 */

import type { DataProcessorDefinition } from "./data-processor";

/**
 * APIs under `lynx` global variable that are added by ReactLynx.
 *
 * @example
 * ```ts
 * lynx.registerDataProcessors(...);
 * lynx.querySelector(...);
 * lynx.querySelectorAll(...);
 * ```
 *
 * @public
 */
export interface LynxAPI {
  /**
   * An alias of `lynx.getJSModule("GlobalEventEmitter").trigger(eventName, params)` only in Lepus.
   *
   * @public
   */
  triggerGlobalEventFromLepus: (eventName: string, params: unknown) => void;

  /**
   * Register DataProcessors. You MUST call this before `root.render()`.
   *
   * @see {@link DataProcessorDefinition} for usage examples.
   *
   * @public
   */
  registerDataProcessors: (dataProcessorDefinition?: DataProcessorDefinition) => void;

  /**
   * Query a single element by selector.
   *
   * @param selector - CSS selector string
   * @returns The first matching element or null
   *
   * @public
   */
  querySelector: (selector: string) => unknown | null;

  /**
   * Query all elements matching a selector.
   *
   * @param selector - CSS selector string
   * @returns Array of matching elements
   *
   * @public
   */
  querySelectorAll: (selector: string) => unknown[];
}

/**
 * Trigger a global event from Lepus (main thread).
 * This is an alias for `lynx.getJSModule("GlobalEventEmitter").trigger(eventName, params)`.
 *
 * @param eventName - The name of the event to trigger
 * @param params - The parameters to pass to the event handler
 *
 * @example
 * ```ts
 * triggerGlobalEventFromLepus('customEvent', { data: 'value' });
 * ```
 *
 * @public
 */
export function triggerGlobalEventFromLepus(eventName: string, params: unknown): void {
  if (typeof lynx !== "undefined" && lynx.getJSModule) {
    lynx.getJSModule("GlobalEventEmitter").trigger(eventName, params);
  }
}

/**
 * Query a single element by selector.
 *
 * @param selector - CSS selector string
 * @returns The first matching element or null
 *
 * @example
 * ```ts
 * const element = querySelector('#my-element');
 * if (element) {
 *   // do something with element
 * }
 * ```
 *
 * @public
 */
export function querySelector(selector: string): unknown | null {
  if (typeof lynx !== "undefined" && "querySelector" in lynx) {
    return (lynx as unknown as LynxAPI).querySelector(selector);
  }
  return null;
}

/**
 * Query all elements matching a selector.
 *
 * @param selector - CSS selector string
 * @returns Array of matching elements
 *
 * @example
 * ```ts
 * const elements = querySelectorAll('.my-class');
 * elements.forEach(el => {
 *   // do something with each element
 * });
 * ```
 *
 * @public
 */
export function querySelectorAll(selector: string): unknown[] {
  if (typeof lynx !== "undefined" && "querySelectorAll" in lynx) {
    return (lynx as unknown as LynxAPI).querySelectorAll(selector);
  }
  return [];
}
