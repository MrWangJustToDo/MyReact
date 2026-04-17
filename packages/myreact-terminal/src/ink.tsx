/* eslint-disable max-lines */
import { ConcurrentRoot } from "@my-react/react-reconciler-compact/constants";
import ansiEscapes from "ansi-escapes";
import autoBind from "auto-bind";
import { throttle } from "es-toolkit/compat";
import isInCi from "is-in-ci";
import process from "node:process";
import patchConsole from "patch-console";
import { type ReactNode } from "react";
import { type FiberRoot } from "react-reconciler";
import * as signalExit from "signal-exit";
import wrapAnsi from "wrap-ansi";
import Yoga from "yoga-layout";

import { accessibilityContext as AccessibilityContext } from "./components/AccessibilityContext.js";
import App from "./components/App.js";
import { type InkOptions } from "./components/AppContext.js";
import * as dom from "./dom.js";
import instances from "./instances.js";
import logUpdate, { type LogUpdate, positionImeCursor } from "./log-update.js";
import { setEnableToStyledCharactersCache, clearToStyledCharactersCache } from "./measure-text.js";
import { type Region } from "./output.js";
import { Reconciler } from "./reconciler.js";
import render from "./renderer.js";
import { measureAndExtractObservers, type default as ResizeObserver, type ResizeObserverEntry } from "./resize-observer.js"; // Removed unused imports
import { calculateScroll } from "./scroll.js";
import { Selection } from "./selection.js";
import { type StyledLine } from "./styled-line.js";
import TerminalBuffer from "./terminal-buffer.js";

const noop = () => {};

/**
Performance metrics for a render operation.
*/
export type RenderMetrics = {
  /**
	Time spent rendering in milliseconds.
	*/
  renderTime: number;

  /**
	Output string for the frame.
	*/
  output: string;

  /**
	Static output string for the frame.
	*/
  staticOutput?: string;
};

export type Options = {
  stdout: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  stderr: NodeJS.WriteStream;
  debug: boolean;
  exitOnCtrlC: boolean;
  patchConsole: boolean;
  onRender?: (metrics: RenderMetrics) => void;
  isScreenReaderEnabled?: boolean;
  waitUntilExit?: () => Promise<void>;
  maxFps?: number;
  alternateBuffer?: boolean;
  alternateBufferAlreadyActive?: boolean;
  isAlternateBufferEnabled?: boolean;
  stickyHeadersInBackbuffer?: boolean;
  incrementalRendering?: boolean;
  debugRainbow?: boolean;
  animatedScroll?: boolean;
  animationInterval?: number;
  backbufferUpdateDelay?: number;
  maxScrollbackLength?: number;
  forceScrollToBottomOnBackbufferRefresh?: boolean;
  selectionStyle?: (line: StyledLine, index: number) => void;
  standardReactLayoutTiming?: boolean;
  renderProcess?: boolean;
  terminalBuffer?: boolean;
  cacheToStyledCharacters?: boolean;
  trackSelection?: boolean;
};

const rainbowColors = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "blackBright",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
];

type RenderModeOptions = {
  output: string;
  outputHeight: number;
  staticOutput: string;
  styledOutput: StyledLine[];
  cursorPosition: { row: number; col: number } | undefined;
  debugRainbowColor: string | undefined;
  hasStaticOutput: boolean;
};

export default class Ink {
  public readonly rootNode: dom.DOMElement;
  private readonly options: Options;
  private readonly log: LogUpdate;
  private readonly throttledLog: LogUpdate;
  private readonly isScreenReaderEnabled: boolean;
  private readonly selection: Selection;
  private readonly terminalBuffer?: TerminalBuffer;
  private optionsState: InkOptions;

  // Ignore last render after unmounting a tree to prevent empty output before exit
  private isUnmounted: boolean;
  private lastOutput: string;
  private lastOutputHeight: number;
  private lastCursorPosition?: { row: number; col: number } | undefined;
  private readonly container: FiberRoot;
  private node: ReactNode;
  // This variable is used only in debug mode to store full static output
  // so that it's rerendered every time, not just new static parts, like in non-debug mode
  private fullStaticOutput: string;
  private exitPromise?: Promise<void>;
  private restoreConsole?: () => void;
  private readonly unsubscribeResize?: () => void;
  private readonly unsubscribeSelection?: () => void;
  private frameIndex = 0;
  private isTerminalResized = false;

  constructor(options: Options) {
    autoBind(this);

    this.options = options;

    if (options.cacheToStyledCharacters === false) {
      setEnableToStyledCharactersCache(false);
    } else if (options.cacheToStyledCharacters === true) {
      setEnableToStyledCharactersCache(true);
    }

    this.optionsState = {
      isAlternateBufferEnabled: options.isAlternateBufferEnabled ?? options.alternateBuffer,
      stickyHeadersInBackbuffer: options.stickyHeadersInBackbuffer,
      animatedScroll: options.animatedScroll,
      animationInterval: options.animationInterval,
      backbufferUpdateDelay: options.backbufferUpdateDelay,
      maxScrollbackLength: options.maxScrollbackLength,
      forceScrollToBottomOnBackbufferRefresh: options.forceScrollToBottomOnBackbufferRefresh,
    };

    this.rootNode = dom.createNode("ink-root");
    this.rootNode.onComputeLayout = this.calculateLayout;

    this.isScreenReaderEnabled = options.isScreenReaderEnabled ?? process.env["INK_SCREEN_READER"] === "true";

    this.selection = new Selection();

    const unthrottled = options.debug || this.isScreenReaderEnabled;
    const maxFps = options.maxFps ?? 30;
    const renderThrottleMs = maxFps > 0 ? Math.max(1, Math.ceil(1000 / maxFps)) : 0;

    const onRender = unthrottled
      ? this.onRender
      : throttle(this.onRender, renderThrottleMs, {
          leading: true,
          trailing: true,
        });
    let isRenderScheduled = false;
    const renderMethod = options.standardReactLayoutTiming
      ? () => {
          if (isRenderScheduled) return;
          isRenderScheduled = true;
          queueMicrotask(() => {
            isRenderScheduled = false;
            void onRender();
          });
        }
      : onRender;
    this.rootNode.onRender = renderMethod;
    this.unsubscribeSelection = this.selection.onChange(renderMethod);

    this.rootNode.onImmediateRender = options.standardReactLayoutTiming ? renderMethod : this.onRender; // Original unthrottled method

    if (options.renderProcess === true || options.terminalBuffer === true) {
      this.terminalBuffer = new TerminalBuffer(options.stdout.columns ?? 80, options.stdout.rows ?? 24, {
        debugRainbowEnabled: options.debugRainbow,
        renderInProcess: !options.renderProcess && options.terminalBuffer,
        stdout: options.stdout,
        isAlternateBufferEnabled: options.isAlternateBufferEnabled,
        stickyHeadersInBackbuffer: options.stickyHeadersInBackbuffer,
        animatedScroll: options.animatedScroll,
        animationInterval: options.animationInterval,
        backbufferUpdateDelay: options.backbufferUpdateDelay,
        maxScrollbackLength: options.maxScrollbackLength,
        forceScrollToBottomOnBackbufferRefresh: options.forceScrollToBottomOnBackbufferRefresh,
        cacheToStyledCharacters: options.cacheToStyledCharacters,
      });
    }

    this.log = logUpdate.create(options.stdout, {
      alternateBuffer: options.alternateBuffer,
      alternateBufferAlreadyActive: options.alternateBufferAlreadyActive,
      getRows: () => options.stdout.rows,
      getColumns: () => options.stdout.columns,
      incremental: options.incrementalRendering,
    });
    this.throttledLog = unthrottled
      ? this.log
      : (throttle(this.log, undefined, {
          leading: true,
          trailing: true,
        }) as unknown as LogUpdate);

    // Ignore last render after unmounting a tree to prevent empty output before exit
    this.isUnmounted = false;

    // Store last output to only rerender when needed
    this.lastOutput = "";
    this.lastOutputHeight = 0;

    // This variable is used only in debug mode to store full static output
    // so that it's rerendered every time, not just new static parts, like in non-debug mode
    this.fullStaticOutput = "";

    this.container = Reconciler.createContainer(
      this.rootNode,
      ConcurrentRoot,
      null,
      false,
      null,
      "id",
      () => {},
      () => {},
      () => {},
      () => {},
      null
    );

    // Unmount when process exits
    this.unsubscribeExit = signalExit.onExit(this.unmount, { alwaysLast: false });

    if (process.env["DEV"] === "true") {
      const injectIntoDevTools = async (url: string, config: any) => {
        const { preloadDevToolRuntimeAuto } = await import("@my-react/react-reconciler-compact/preload");
        // load devtool runtime
        await preloadDevToolRuntimeAuto();
        const { io } = await import("socket.io-client");
        globalThis.io = io;
        const typedReconciler = Reconciler as typeof Reconciler & {
          injectIntoDevToolsAuto: (url: string, config: any) => Promise<void>;
        };
        typedReconciler.injectIntoDevToolsAuto(url, config);
      };

      const DEVTOOL_PATH = process.env["DEVTOOL_PATH"] || "localhost";

      const DEVTOOL_PORT = process.env["DEVTOOL_PORT"] || "3002";

      // TODO: make this configurable
      injectIntoDevTools(`http://${DEVTOOL_PATH}:${DEVTOOL_PORT}`, {
        rendererPackageName: "@my-react/react-terminal",
      });
    }

    if (options.patchConsole) {
      this.patchConsole();
    }

    if (!isInCi) {
      options.stdout.on("resize", this.resized);

      this.unsubscribeResize = () => {
        options.stdout.off("resize", this.resized);
      };
    }
  }

  resized = () => {
    const terminalWidth = this.options.stdout.columns ?? 80;
    const terminalHeight = this.options.stdout.rows ?? 24;

    clearToStyledCharactersCache();
    this.terminalBuffer?.resize(terminalWidth, terminalHeight);
    this.resetScrollbackPadding(this.rootNode);
    this.isTerminalResized = true;
    this.calculateLayout();
    void this.onRender();
  };

  getSelection(): Selection {
    return this.selection;
  }

  resolveExitPromise: () => void = () => {};
  rejectExitPromise: (reason?: Error) => void = () => {};
  unsubscribeExit: () => void = () => {};

  calculateLayout = () => {
    // The 'columns' property can be undefined or 0 when not using a TTY.
    // In that case we fall back to 80.
    const terminalWidth = this.options.stdout.columns ?? 80;

    this.rootNode.yogaNode!.setWidth(terminalWidth);

    this.rootNode.yogaNode!.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);

    const observerEntries = new Map<ResizeObserver, ResizeObserverEntry[]>();
    this.calculateLayoutAndTriggerObservers(this.rootNode, observerEntries, this.isTerminalResized);
    this.isTerminalResized = false;

    for (const [observer, entries] of observerEntries) {
      observer.internalTrigger(entries);
    }
  };

  calculateLayoutAndTriggerObservers(node: dom.DOMElement, observerEntries: Map<ResizeObserver, ResizeObserverEntry[]>, isTerminalResized = false) {
    if (node.nodeName === "ink-box") {
      const { style } = node;
      const overflow = style.overflow ?? "visible";
      const overflowX = style.overflowX ?? overflow;
      const overflowY = style.overflowY ?? overflow;

      if (overflowX === "scroll" || overflowY === "scroll") {
        calculateScroll(node, isTerminalResized);
      } else if (node.internal_scrollState) {
        delete node.internal_scrollState;
      }
    }

    measureAndExtractObservers(node, observerEntries);

    if (node.internal_static || (node.nodeName === "ink-static-render" && node.cachedRender)) {
      return;
    }

    for (const child of node.childNodes) {
      if (child.nodeName !== "#text") {
        this.calculateLayoutAndTriggerObservers(child, observerEntries, isTerminalResized);
      }
    }
  }

  onRender = async (): Promise<void> => {
    if (this.isUnmounted) {
      return;
    }

    const startTime = performance.now();

    let debugRainbowColor: string | undefined;
    if (this.options.debugRainbow) {
      debugRainbowColor = rainbowColors[this.frameIndex % rainbowColors.length];
      this.frameIndex++;
    }

    const { output, outputHeight, staticOutput, styledOutput, cursorPosition, root } = render(this.rootNode, {
      isScreenReaderEnabled: this.isScreenReaderEnabled,
      selection: this.selection,
      selectionStyle: this.options.selectionStyle,
      skipScrollbars: Boolean(this.terminalBuffer),
      terminalBuffer: Boolean(this.terminalBuffer),
    });

    if (this.terminalBuffer && root) {
      await this.renderWithTerminalBuffer(root, cursorPosition);
    } else {
      // If <Static> output isn't empty, it means new children have been added to it
      const hasStaticOutput = Boolean(staticOutput && staticOutput !== "\n");

      const renderOptions: RenderModeOptions = {
        output,
        outputHeight,
        staticOutput,
        styledOutput,
        cursorPosition,
        debugRainbowColor,
        hasStaticOutput,
      };

      if (this.options.debug) {
        this.renderDebug(renderOptions);
      } else if (isInCi) {
        this.renderCi(renderOptions);
      } else if (this.optionsState.isAlternateBufferEnabled) {
        this.renderAlternateBuffer(renderOptions);
      } else if (this.isScreenReaderEnabled) {
        this.renderScreenReader(renderOptions);
      } else if (this.lastOutputHeight >= this.options.stdout.rows) {
        this.renderFullTerminal(renderOptions);
      } else {
        this.renderLegacy(renderOptions);
      }
    }

    this.callOnRender(startTime, output, staticOutput);
  };

  recalculateLayout(): void {
    this.markAllTextNodesDirty(this.rootNode);
    this.calculateLayout();
    void this.onRender();
  }

  onRerender = () => {
    if (this.isUnmounted) {
      return;
    }

    this.log.clear();
    this.lastOutput = "";
    this.resetScrollbackPadding(this.rootNode);
    void this.onRender();
  };

  setOptions = (options: Partial<InkOptions>) => {
    this.optionsState = {
      ...this.optionsState,
      ...options,
    };

    this.terminalBuffer?.updateOptions(this.optionsState);

    this.lastOutput = "";
    if (this.node) {
      this.render(this.node);
    } else {
      this.onRerender();
    }
  };

  render(node: ReactNode): void {
    this.node = node;
    const tree = (
      <AccessibilityContext.Provider value={{ isScreenReaderEnabled: this.isScreenReaderEnabled, instance: this }}>
        <App
          stdin={this.options.stdin}
          stdout={this.options.stdout}
          stderr={this.options.stderr}
          writeToStdout={this.writeToStdout}
          writeToStderr={this.writeToStderr}
          exitOnCtrlC={this.options.exitOnCtrlC}
          selection={this.selection}
          options={this.optionsState}
          setOptions={this.setOptions}
          dumpCurrentFrame={this.dumpCurrentFrame}
          startRecording={this.startRecording}
          stopRecording={this.stopRecording}
          onExit={this.unmount}
          onRerender={this.onRerender}
        >
          {node}
        </App>
      </AccessibilityContext.Provider>
    );

    Reconciler.updateContainer(tree, this.container, null, noop);
  }

  writeToStdout(data: string): void {
    if (this.isUnmounted) {
      return;
    }

    if (this.options.debug) {
      this.options.stdout.write(data + this.fullStaticOutput + this.lastOutput);
      return;
    }

    if (isInCi) {
      this.options.stdout.write(data);
      return;
    }

    this.log.clear();
    this.options.stdout.write(data);
    this.log(this.lastOutput, []);
  }

  writeToStderr(data: string): void {
    if (this.isUnmounted) {
      return;
    }

    if (this.options.debug) {
      this.options.stderr.write(data);
      this.options.stdout.write(this.fullStaticOutput + this.lastOutput);
      return;
    }

    if (isInCi) {
      this.options.stderr.write(data);
      return;
    }

    this.log.clear();
    this.options.stderr.write(data);
    this.log(this.lastOutput, []);
  }

  unmount(error?: Error | number | null): void {
    if (this.isUnmounted) {
      return;
    }

    this.calculateLayout();
    void this.onRender();
    this.unsubscribeExit();

    if (typeof this.restoreConsole === "function") {
      this.restoreConsole();
    }

    if (typeof this.unsubscribeResize === "function") {
      this.unsubscribeResize();
    }

    if (typeof this.unsubscribeSelection === "function") {
      this.unsubscribeSelection();
    }

    // CIs don't handle erasing ansi escapes well, so it's better to
    // only render last frame of non-static output
    if (isInCi) {
      this.options.stdout.write(this.lastOutput + "\n");
    } else if (!this.options.debug) {
      this.log.done();

      if (this.terminalBuffer) {
        this.terminalBuffer.done();
      }
    }

    if (this.terminalBuffer) {
      this.terminalBuffer.destroy();
    }

    this.isUnmounted = true;

    Reconciler.updateContainer(null, this.container, null, noop);

    instances.delete(this.options.stdout);

    if (error instanceof Error) {
      this.rejectExitPromise(error);
    } else {
      this.resolveExitPromise();
    }
  }

  async waitUntilExit(): Promise<void> {
    this.exitPromise ||= new Promise((resolve, reject) => {
      this.resolveExitPromise = resolve;
      this.rejectExitPromise = reject;
    });

    return this.exitPromise;
  }

  dumpCurrentFrame(filename: string): void {
    if (this.terminalBuffer) {
      this.terminalBuffer.dumpCurrentFrame(filename);
    } else {
      console.error("dumpCurrentFrame is only supported when terminalBuffer is true");
    }
  }

  startRecording(filename: string): void {
    if (this.terminalBuffer) {
      this.terminalBuffer.startRecording(filename);
    } else {
      console.error("startRecording is only supported when terminalBuffer is true");
    }
  }

  stopRecording(): void {
    if (this.terminalBuffer) {
      this.terminalBuffer.stopRecording();
    } else {
      console.error("stopRecording is only supported when terminalBuffer is true");
    }
  }

  clear(): void {
    if (!isInCi && !this.options.debug) {
      this.log.clear();
    }
  }

  patchConsole(): void {
    if (this.options.debug) {
      return;
    }

    this.restoreConsole = patchConsole((stream, data) => {
      if (stream === "stdout") {
        this.writeToStdout(data);
      }

      if (stream === "stderr") {
        const isReactMessage = data.startsWith("The above error occurred");

        if (!isReactMessage) {
          this.writeToStderr(data);
        }
      }
    });
  }

  private async renderWithTerminalBuffer(root: Region, cursorPosition: { row: number; col: number } | undefined) {
    const appliedChanges = this.terminalBuffer!.update(0, Number.MAX_SAFE_INTEGER, root, cursorPosition);
    if (appliedChanges) {
      await this.terminalBuffer!.render();
    }
  }

  private renderDebug({ output, staticOutput, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput;
    }

    this.options.stdout.write(this.fullStaticOutput + output);
  }

  private renderCi({ output, outputHeight, staticOutput, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      this.options.stdout.write(staticOutput);
    }

    this.lastOutput = output;
    this.lastOutputHeight = outputHeight;
  }

  private renderAlternateBuffer({ output, styledOutput, staticOutput, cursorPosition, debugRainbowColor, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput;
    }

    this.log(this.fullStaticOutput + output, styledOutput, debugRainbowColor, cursorPosition);
    this.lastOutput = output;
  }

  private renderScreenReader({ output, staticOutput, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      // We need to erase the main output before writing new static output
      const erase = this.lastOutputHeight > 0 ? ansiEscapes.eraseLines(this.lastOutputHeight) : "";
      this.options.stdout.write(erase + staticOutput);
      // After erasing, the last output is gone, so we should reset its height
      this.lastOutputHeight = 0;
    }

    if (output === this.lastOutput && !hasStaticOutput) {
      return;
    }

    const terminalWidth = this.options.stdout.columns ?? 80;

    const wrappedOutput = wrapAnsi(output, terminalWidth, {
      trim: false,
      hard: true,
    });

    // If we haven't erased yet, do it now.
    if (hasStaticOutput) {
      this.options.stdout.write(wrappedOutput);
    } else {
      const erase = this.lastOutputHeight > 0 ? ansiEscapes.eraseLines(this.lastOutputHeight) : "";
      this.options.stdout.write(erase + wrappedOutput);
    }

    this.lastOutput = output;
    this.lastOutputHeight = wrappedOutput === "" ? 0 : wrappedOutput.split("\n").length;
  }

  private renderFullTerminal({ output, outputHeight, staticOutput, cursorPosition, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput;
    }

    // Build a single buffer for all operations
    let buffer = "";

    buffer += ansiEscapes.clearTerminal + this.fullStaticOutput + output;

    // Position cursor after screen clear if requested by a component
    if (cursorPosition) {
      const lineCount = output.split("\n").length;
      buffer += positionImeCursor(lineCount, cursorPosition);
    }

    this.options.stdout.write(buffer);

    this.lastOutput = output;
    this.lastOutputHeight = outputHeight;
    this.lastCursorPosition = cursorPosition;
    this.log.sync(output, cursorPosition);
  }

  /**
   * The goal is to remove this method making terminal buffer required.
   */
  private renderLegacy({ output, outputHeight, styledOutput, staticOutput, cursorPosition, debugRainbowColor, hasStaticOutput }: RenderModeOptions) {
    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput;
    }

    // To ensure static output is cleanly rendered before main output, clear main output first
    if (hasStaticOutput) {
      this.log.clear();
      this.options.stdout.write(staticOutput);
      this.log(output, styledOutput, debugRainbowColor, cursorPosition);
    }

    const outputChanged = output !== this.lastOutput;
    const cursorChanged =
      cursorPosition !== this.lastCursorPosition &&
      (!cursorPosition || !this.lastCursorPosition || cursorPosition.row !== this.lastCursorPosition.row || cursorPosition.col !== this.lastCursorPosition.col);

    if (!hasStaticOutput && (outputChanged || cursorChanged)) {
      this.throttledLog(output, styledOutput, debugRainbowColor, cursorPosition);
    }

    this.lastOutput = output;
    this.lastOutputHeight = outputHeight;
    this.lastCursorPosition = cursorPosition;
  }

  private markAllTextNodesDirty(node: dom.DOMElement) {
    if (node.cachedRender) {
      return;
    }

    if (node.nodeName === "ink-text" && node.yogaNode) {
      node.yogaNode.markDirty();
    }

    for (const child of node.childNodes) {
      if (child.nodeName !== "#text") {
        this.markAllTextNodesDirty(child);
      }
    }
  }

  private resetScrollbackPadding(node: dom.DOMElement) {
    node.internal_maxScrollTop = 0;
    node.internal_isScrollbackDirty = false;
    for (const child of node.childNodes) {
      if (child.nodeName !== "#text") {
        this.resetScrollbackPadding(child);
      }
    }
  }

  private callOnRender(startTime: number, output: string, staticOutput?: string) {
    this.options.onRender?.({
      renderTime: performance.now() - startTime,
      output,
      staticOutput,
    });
  }
}
