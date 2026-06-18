import render from "../render.js";

import { Readable, Writable } from "./shims/stream.js";

import type { RenderOptions } from "../render.js";
import type { Terminal, ITerminalOptions } from "@xterm/xterm";
import type { ReactNode } from "react";

// Polyfill setImmediate — Ink's unmount() relies on it internally
if (typeof globalThis.setImmediate === "undefined") {
  (globalThis as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(fn, 0, ...args);
}

export type RenderFunction = (
  node: ReactNode,
  options: any
) => {
  rerender: (node: ReactNode) => void;
  unmount: () => void;
  clear: () => void;
};

export type InkWebOptions = {
  container: HTMLElement;
  termOptions?: Partial<ITerminalOptions>;
  focus?: boolean;
  onReady?: (api: InkWebInstance) => void;
  buildInRenderOptions?: RenderOptions;
};

export type InkWebInstance = {
  term: Terminal;
  rerender: (node: ReactNode) => void;
  unmount: () => void;
  clear: () => void;
};

const CLEAR_TERMINAL = "\x1b[2J\x1b[3J\x1b[H";
const CURSOR_HOME = "\x1b[H";

export function filterStdoutChunk(chunk: string): string {
  return chunk.replaceAll(CLEAR_TERMINAL, CURSOR_HOME);
}

export async function mountInkInXterm(element: ReactNode, options: InkWebOptions): Promise<InkWebInstance> {
  const { Terminal: XTerminal } = await import("@xterm/xterm");
  const { FitAddon: XFitAddon } = await import("@xterm/addon-fit");

  const containerWidth = options.container.clientWidth;
  const containerHeight = options.container.clientHeight;
  const charWidth = 9;
  const charHeight = 17;
  const initialCols = Math.floor(containerWidth / charWidth) || 80;
  const initialRows = Math.floor(containerHeight / charHeight) || 24;

  const term = new XTerminal({
    convertEol: true,
    disableStdin: false,
    cols: initialCols,
    rows: initialRows,
    ...options.termOptions,
  });

  const fitAddon = new XFitAddon();

  term.open(options.container);
  term.loadAddon(fitAddon);

  // Hide the native xterm.js cursor — ink components render their own
  term.write("\x1b[?25l");

  if (options.focus !== false) {
    setTimeout(() => {
      try {
        term.focus();
      } catch (e) {
        console.warn("Error focusing terminal:", e);
      }
    }, 100);
  }

  // Create stdout stream that writes into xterm
  const stdoutBase = new Writable((chunk: string) => {
    if (chunk.length > 0) {
      const filtered = filterStdoutChunk(chunk);
      if (filtered.length > 0) {
        term.write(filtered);
      }
    }
  });

  const stdout = Object.assign(stdoutBase, {
    columns: term.cols,
    rows: term.rows,
  }) as typeof stdoutBase & { columns: number; rows: number };

  // Create stdin stream fed by xterm keystrokes
  const stdin = new Readable();
  stdin.setRawMode(true);

  stdin.columns = term.cols;
  stdin.rows = term.rows;

  const inputBuffer: string[] = [];
  stdin.read = () => {
    return inputBuffer.length > 0 ? inputBuffer.shift()! : null;
  };

  term.onData((data: string) => {
    inputBuffer.push(data);
    stdin.emit("readable");
    stdin.emit("data", data);
  });

  const updateStreamsSize = () => {
    const cols = term.cols;
    const rows = term.rows;
    stdout.columns = cols;
    stdout.rows = rows;
    stdin.columns = cols;
    stdin.rows = rows;
    stdout.emit("resize");
  };

  updateStreamsSize();

  // Resolve the render function
  const renderFn = render;

  let instance: ReturnType<RenderFunction> | null = null;
  let pendingElement: ReactNode = element;

  instance = renderFn(pendingElement, {
    ...options.buildInRenderOptions,
    stdout: stdout as unknown as NodeJS.WriteStream,
    stdin: stdin as unknown as NodeJS.ReadStream,
    stderr: stdout as unknown as NodeJS.WriteStream,
  });

  // Resize handling — when xterm narrows, it reflows existing content which
  // garbles box-drawing characters. We clear on SHRINK only. On expand, Ink
  // does NOT reset lastOutput so clearing would leave the screen blank.
  const resize = () => {
    try {
      fitAddon.fit();
      const cols = term.cols;
      const rows = term.rows;
      if (cols !== stdout.columns || rows !== stdout.rows) {
        const isNarrowing = cols < stdout.columns;
        if (isNarrowing && instance) {
          instance.clear();
          term.write(CLEAR_TERMINAL);
        }
        updateStreamsSize();
      }
    } catch {
      // fitAddon.fit() can throw if xterm's renderer isn't ready
    }
  };

  const ro = new ResizeObserver(() => resize());
  ro.observe(options.container);

  const onWindowResize = () => resize();
  window.addEventListener("resize", onWindowResize);

  setTimeout(() => {
    resize();
    options.onReady?.({
      term,
      rerender: (node: ReactNode) => {
        pendingElement = node;
        instance?.rerender(node);
      },
      unmount: cleanup,
      clear: () => instance?.clear(),
    });
  }, 200);

  function cleanup() {
    try {
      instance?.unmount();
    } finally {
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
      term.dispose();
      instance = null;
    }
  }

  const api: InkWebInstance = {
    term,
    rerender: (node: ReactNode) => {
      pendingElement = node;
      instance?.rerender(node);
    },
    unmount: cleanup,
    clear: () => instance?.clear(),
  };

  return api;
}

// Default line height in pixels
const TERMINAL_LINE_HEIGHT = 18;
const TERMINAL_PADDING = 20;

export function getTerminalHeight(rows: number): number {
  return rows * TERMINAL_LINE_HEIGHT + TERMINAL_PADDING;
}
