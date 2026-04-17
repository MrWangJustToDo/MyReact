/**
 * Data Processor system for MyReact Lynx.
 *
 * Provides types and APIs for registering data processors that preprocess
 * data passed from native side before it reaches the React components.
 */

import type { InitData, InitDataRaw } from "./init-data";

/**
 * The data processors that registered with {@link registerDataProcessors}.
 *
 * @example
 * Extending `DataProcessors` interface for custom processors:
 *
 * ```ts
 * declare module '@my-react/react-lynx' {
 *   interface DataProcessors {
 *     foo(bar: string): number;
 *   }
 * }
 * ```
 *
 * Then you can use `lynx.registerDataProcessors` with types:
 *
 * ```ts
 * lynx.registerDataProcessors({
 *   dataProcessors: {
 *     foo(bar) {
 *       return bar.length;
 *     }
 *   }
 * })
 * ```
 *
 * @public
 */
export interface DataProcessors {
  /**
   * Optional processor to override screen metrics used by the app.
   *
   * @param metrics - The physical screen dimensions in pixels
   * @returns New screen dimensions to be used by the app
   *
   * @example
   * ```ts
   * lynx.registerDataProcessors({
   *   dataProcessors: {
   *     getScreenMetricsOverride: (metrics) => {
   *       // Force a specific aspect ratio
   *       return {
   *         width: metrics.width,
   *         height: metrics.width * (16/9)
   *       };
   *     }
   *   }
   * });
   * ```
   */
  getScreenMetricsOverride?(metrics: { width: number; height: number }): { width: number; height: number };

  /**
   * Custom data processors.
   * You may extend the `DataProcessors` interface for better TypeScript types.
   */
  [processorName: string]: ((...args: unknown[]) => unknown) | undefined;
}

/**
 * Definition of DataProcessor(s).
 *
 * @public
 */
export interface DataProcessorDefinition {
  /**
   * Default data processor that transforms raw initData before it's available
   * to components via `useInitData()`.
   *
   * You can customize input and output types by extending {@link InitDataRaw}
   * and {@link InitData}.
   *
   * @param rawInitData - initData passed from native code
   * @returns Processed initData available to components
   *
   * @example
   * ```ts
   * lynx.registerDataProcessors({
   *   defaultDataProcessor: (rawData) => {
   *     return {
   *       ...rawData,
   *       processedAt: Date.now(),
   *     };
   *   }
   * });
   * ```
   *
   * @public
   */
  defaultDataProcessor?: (rawInitData: InitDataRaw) => InitData;

  /**
   * Named data processors for specific use cases.
   *
   * @public
   */
  dataProcessors?: DataProcessors;
}

/**
 * Register data processors. You MUST call this before `root.render()`.
 *
 * @example
 * ```ts
 * import { root, registerDataProcessors } from '@my-react/react-lynx';
 *
 * // You MUST call this before `root.render()`
 * registerDataProcessors({
 *   defaultDataProcessor: (raw) => ({
 *     ...raw,
 *     timestamp: Date.now(),
 *   }),
 *   dataProcessors: {
 *     getScreenMetricsOverride: (metrics) => ({
 *       width: metrics.width,
 *       height: metrics.height,
 *     }),
 *   },
 * });
 *
 * root.render(<App />);
 * ```
 *
 * @example
 * Using a class component with static data processors:
 *
 * ```ts
 * import { root, Component, registerDataProcessors } from '@my-react/react-lynx';
 *
 * class App extends Component {
 *   static defaultDataProcessor(raw) {
 *     return { ...raw };
 *   }
 *
 *   static dataProcessors = {
 *     getScreenMetricsOverride(metrics) {
 *       return metrics;
 *     }
 *   };
 * }
 *
 * registerDataProcessors(App);
 * root.render(<App />);
 * ```
 *
 * @public
 */
export function registerDataProcessors(definition?: DataProcessorDefinition): void {
  if (typeof lynx !== "undefined" && lynx.registerDataProcessors) {
    // Cast to the lynx interface type which uses Record<string, unknown>
    lynx.registerDataProcessors(definition as Parameters<typeof lynx.registerDataProcessors>[0]);
  } else if (__DEV__) {
    console.warn("[@my-react/react-lynx] lynx.registerDataProcessors is not available in this environment.");
  }
}
