import { CliRenderEvents, createCliRenderer, engine } from "@opentui/core";
import React, { type ReactNode } from "react";

import { AppContext } from "../components/App";
import { ErrorBoundary } from "../components/ErrorBoundary";

import { _render, reconciler } from "./reconciler";

import type { CliRenderer, CliRendererConfig } from "@opentui/core";
import type { OpaqueRoot } from "react-reconciler";

export async function render(node: ReactNode, rendererConfig: CliRendererConfig = {}): Promise<void> {
  const renderer = await createCliRenderer(rendererConfig);

  engine.attach(renderer);

  _render(
    React.createElement(AppContext.Provider, { value: { keyHandler: renderer.keyInput, renderer } }, React.createElement(ErrorBoundary, null, node)),
    renderer.root
  );
}

export type Root = {
  render: (node: ReactNode) => void;
  unmount: () => void;
};

const createPortal = reconciler.createPortal;

const flushSync = reconciler.flushSync;

/**
 * Creates a root for rendering a React tree with the given CLI renderer.
 * @param renderer The CLI renderer to use
 * @returns A root object with a `render` method
 * @example
 * ```tsx
 * const renderer = await createCliRenderer()
 * createRoot(renderer).render(<App />)
 * ```
 */
export function createRoot(renderer: CliRenderer): Root {
  let container: OpaqueRoot | null = null;

  const cleanup = () => {
    if (container) {
      reconciler.updateContainer(null, container, null, () => {});

      container = null;
    }
  };

  renderer.once(CliRenderEvents.DESTROY, cleanup);

  return {
    render: (node: ReactNode) => {
      engine.attach(renderer);

      container = _render(
        React.createElement(AppContext.Provider, { value: { keyHandler: renderer.keyInput, renderer } }, React.createElement(ErrorBoundary, null, node)),
        renderer.root
      );
    },

    unmount: cleanup,
  };
}

export { createPortal, flushSync };
