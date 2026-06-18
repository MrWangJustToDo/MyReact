/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useCallback } from "react";

import { InkXterm, type InkXtermProps } from "./InkXterm.js";
import { getTerminalHeight, type InkWebInstance } from "./xterm-ink.js";

import type { CSSProperties, ReactElement, ReactNode } from "react";

export type InkTerminalBoxProps = Omit<InkXtermProps, "onReady"> & {
  /** Number of rows to display (determines terminal height) */
  rows?: number;
  /** Padding around the terminal content in pixels */
  padding?: number;
  /** Show a loading placeholder while initializing */
  loading?: boolean;
  /** Custom loading content */
  loadingContent?: ReactNode;
  /** Callback when terminal is ready */
  onReady?: (api: InkWebInstance) => void;
};

export function InkTerminalBox({
  rows = 24,
  padding = 10,
  loading: showLoading = true,
  loadingContent,
  className,
  style,
  onReady,
  ...xtermProps
}: InkTerminalBoxProps): ReactElement {
  const [ready, setReady] = useState(!showLoading);

  const handleReady = useCallback(
    (api: InkWebInstance) => {
      setReady(true);
      onReady?.(api);
    },
    [onReady]
  );

  const height = getTerminalHeight(rows);

  const containerStyle: CSSProperties = {
    height: `${height}px`,
    position: "relative",
    padding: `${padding}px`,
    ...style,
  };

  return (
    // @ts-ignore
    <div className={`ink-terminal-box ${className ?? ""}`.trim()} style={containerStyle}>
      {showLoading && !ready && (
        // @ts-ignore
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c7086",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          {loadingContent ?? "Initializing terminal..."}
          {/* @ts-ignore */}
        </div>
      )}
      {/* @ts-ignore */}
      <div className="ink-terminal-reset" style={showLoading ? { visibility: ready ? "visible" : "hidden" } : undefined}>
        <InkXterm {...xtermProps} termOptions={{ ...xtermProps.termOptions }} onReady={handleReady} />
        {/* @ts-ignore */}
      </div>
      {/* @ts-ignore */}
    </div>
  );
}
