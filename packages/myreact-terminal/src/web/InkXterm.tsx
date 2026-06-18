import { useEffect, useMemo, useRef } from "react";

import { mountInkInXterm, type InkWebInstance, type InkWebOptions } from "./xterm-ink.js";

import type { RenderOptions } from "../render.js";
import type { ITerminalOptions } from "@xterm/xterm";
import type { CSSProperties, ReactElement, ReactNode } from "react";

export type InkXtermProps = {
  /** The Ink JSX element to render inside the terminal */
  children: ReactNode;
  /** xterm.js terminal options */
  termOptions?: Partial<ITerminalOptions>;
  /** Whether to focus the terminal on mount */
  focus?: boolean;
  /** Callback when the terminal is ready */
  onReady?: (api: InkWebInstance) => void;
  /** CSS class name for the container div */
  className?: string;
  /** Inline styles for the container div */
  style?: CSSProperties;
  /** Build render options */
  inkRenderOptions?: RenderOptions;
};

export function InkXterm({ children, termOptions, focus, onReady, className, style, inkRenderOptions }: InkXtermProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);
  const rerenderRef = useRef<((node: ReactNode) => void) | null>(null);
  const initializedRef = useRef(false);
  const childrenRef = useRef(children);
  childrenRef.current = children;

  // Stabilize termOptions by value so callers don't need to memoize
  const termOptionsKey = JSON.stringify(termOptions);
  const stableTermOptions = useMemo(() => termOptions, [termOptionsKey]);

  // Create/destroy terminal — only depends on stable options, not children
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const initialize = () => {
      if (initializedRef.current || !container) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) return;

      initializedRef.current = true;

      const opts: InkWebOptions = {
        container,
        termOptions: stableTermOptions,
        focus,
        onReady,
        inkRenderOptions,
      };

      mountInkInXterm(childrenRef.current, opts).then((api) => {
        if (!initializedRef.current) {
          api.unmount();
          return;
        }
        unmountRef.current = api.unmount;
        rerenderRef.current = api.rerender;
      });
    };

    // Use requestAnimationFrame to ensure container has dimensions
    const rafId = requestAnimationFrame(() => {
      initialize();

      // If still not initialized (no dimensions yet), observe for changes
      if (!initializedRef.current) {
        ro = new ResizeObserver(() => {
          initialize();
          if (initializedRef.current && ro) {
            ro.disconnect();
          }
        });
        ro.observe(container);
      }
    });

    let ro: ResizeObserver | null = null;

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      initializedRef.current = false;
      rerenderRef.current = null;
      if (unmountRef.current) {
        unmountRef.current();
        unmountRef.current = null;
      }
    };
  }, [focus, stableTermOptions, onReady]);

  // Re-render Ink element when children change (without recreating the terminal)
  useEffect(() => {
    if (rerenderRef.current) {
      rerenderRef.current(children);
    }
  }, [children]);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
}
