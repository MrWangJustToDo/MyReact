/* eslint-disable max-lines */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ansiEscapes from "ansi-escapes";
import process from "node:process";

import colorize from "../colorize.js";
import { debugLog } from "../debug-log.js";
import { StyledLine } from "../styled-line.js";
import { styledLineToString } from "../tokenize.js";

import {
  enterSynchronizedOutput,
  exitSynchronizedOutput,
  resetScrollRegion,
  ris,
  clearScrollbackStandard,
  homeEraseDown,
  getMoveCursorDownCode,
  getMoveCursorUpCode,
  getDeleteLinesCode,
  getInsertLinesCode,
  getSetScrollRegionCode,
} from "./ansi-utils.js";
import { platform } from "./platform.js";
import { debugWorker } from "./render-worker.js";

const synchronizeOutput = true;
export const rainbowColors = [
  "ansi256(17)",
  "ansi256(18)",
  "ansi256(19)",
  "ansi256(20)",
  "ansi256(21)",
  "ansi256(25)",
  "ansi256(26)",
  "ansi256(27)",
  "ansi256(31)",
  "ansi256(32)",
  "ansi256(33)",
  "ansi256(39)",
  "ansi256(63)",
  "ansi256(69)",
  "ansi256(75)",
];

export type RenderLine = {
  styledChars: StyledLine;
  text: string;
  length: number;
  tainted: boolean;
};

export function linesEqual(lineA: StyledLine | undefined, lineB: StyledLine | undefined): boolean {
  if (lineA === lineB) return true;
  if (!lineA || !lineB) return false;
  return lineA.equals(lineB);
}

/**
 * Low level terminal renderer.
 *
 * This class makes it robust and simple to perform efficient incremental updates to the
 * terminal, scroll regions, and inject content into the backbuffer.
 * It handles caching what content was previously rendered and operations
 * such as syncing individual lines without generating flicker, adding
 * lines to the backbuffer, and scrolling content onto the backbuffer.
 */
export class TerminalWriter {
  public isTainted = false;
  public debugRainbowColor?: string;
  public backbufferDirty = false;
  public backbufferScrolledIncorrectly = false;
  public backbufferDirtyCurrentFrame = false;
  public fullRenderTimeout?: NodeJS.Timeout;
  public maxScrollbackLength = 1000;
  public forceScrollToBottomOnBackbufferRefresh = false;
  private linesUpdated = 0;
  private screen: RenderLine[] = [];
  private backbuffer: RenderLine[] = [];
  private cursorX = -1;
  private cursorY = -1;
  private targetCursorX = -1;
  private targetCursorY = -1;
  private scrollRegionTop = -1;
  private scrollRegionBottom = -1;
  private firstRender = true;
  private readonly enableSynchronizedOutput = synchronizeOutput;
  private cancelSlowFlush: (() => void) | undefined;
  private isDone = false;

  private outputBuffer: string[] = [];
  private currentChunkBuffer: string[] = [];

  constructor(
    private columns: number,
    private rows: number,
    public readonly stdout: NodeJS.WriteStream
  ) {}

  getLinesUpdated(): number {
    return this.linesUpdated;
  }

  resetLinesUpdated() {
    this.linesUpdated = 0;
  }

  unkownCursorLocation() {
    this.cursorX = -1;
    this.cursorY = -1;
  }

  writeRaw(text: string) {
    this.writeHelper(text);
  }

  taintScreen() {
    for (const line of this.screen) {
      if (line) {
        line.tainted = true;
      }
    }
  }

  getBackbufferLength(): number {
    return this.backbuffer.length;
  }

  getBackbufferEntry(index: number): RenderLine | undefined {
    return this.backbuffer[index];
  }

  getScreenLine(y: number): RenderLine | undefined {
    return this.screen[y];
  }

  setBackbuffer(lines: RenderLine[]) {
    this.backbuffer = lines;
  }

  get isFirstRender(): boolean {
    return this.firstRender;
  }

  appendLinesBackbuffer(lines: RenderLine[]) {
    this.startSynchronizedOutput();
    try {
      for (const line of lines) {
        // 1. Replace the top line with the clean version
        this.syncLine(line, 0);

        // 2. Scroll the terminal up, which pushes row 0 (the clean line) to history
        this.applyScrollUpBackbuffer(0, this.rows);
      }
    } finally {
      this.endSynchronizedOutput();
    }
  }

  updateBackbuffer(start: number, deleteCount: number, newLines: RenderLine[]) {
    const backbufferLength = this.backbuffer.length;
    const screenStart = Math.max(0, backbufferLength - this.rows);

    // Case 1: Append at the very end
    if (start === backbufferLength && deleteCount === 0) {
      this.appendLinesBackbuffer(newLines);
      return;
    }

    // Case 2: Within the screen
    if (start >= screenStart) {
      this.backbuffer.splice(start, deleteCount, ...newLines);
      return;
    }

    // Case 3: Other cases (outside screen, not append)
    this.isTainted = true;
  }

  syncLines(lines: RenderLine[]) {
    const backBufferLength = Math.max(0, lines.length - this.rows);

    for (const [i, line] of lines.entries()) {
      if (i < backBufferLength) {
        const clampedLine = this.clampLine(line.styledChars, this.columns);
        this.backbuffer.push(clampedLine);

        if (this.backbuffer.length > this.maxScrollbackLength) {
          this.backbuffer.shift();
        }
      } else {
        const screenRow = i - backBufferLength;
        this.syncLine(line, screenRow);
      }
    }

    this.firstRender = false;
  }

  writeLines(lines: RenderLine[]) {
    if (this.backbuffer.length > 0 || this.screen.length > 0) {
      throw new Error(`writeLines can only be called on an empty terminal. Sizes = ${this.backbuffer.length}, ${this.screen.length}`);
    }

    const backBufferLength = Math.max(0, lines.length - this.rows);

    for (const [i, line] of lines.entries()) {
      const clampedLine = this.clampLine(line.styledChars, this.columns);
      let textToWrite = clampedLine.text;

      if (this.debugRainbowColor) {
        textToWrite = colorize(textToWrite, this.debugRainbowColor, "background");
      }

      this.writeHelper(textToWrite);
      this.linesUpdated++;

      if (i >= backBufferLength && i < backBufferLength + this.rows && this.isFirstRender && clampedLine.length < this.columns) {
        // Need to clear any text we might be rendering on top of.
        this.writeHelper(ansiEscapes.eraseEndLine);
      }

      if (i + 1 < lines.length) {
        this.writeHelper("\n");
      }

      if (i < backBufferLength) {
        this.backbuffer.push(clampedLine);

        if (this.backbuffer.length > this.maxScrollbackLength) {
          this.backbuffer.shift();
        }
      } else {
        this.screen.push(clampedLine);
      }
    }

    if (this.isFirstRender) {
      /// Clean up lines at the bottom of the screen if we
      // rendered at less than the terminal height.
      for (let row = lines.length; row < this.rows; row++) {
        this.writeHelper("\n" + ansiEscapes.eraseEndLine);
      }
    }

    this.cursorX = -1;
    this.cursorY = -1;

    this.firstRender = false;

    this.finishChunkAndUpdateCursor();
  }

  setTargetCursorPosition(row: number, col: number) {
    if (this.targetCursorY === row && this.targetCursorX === col) {
      return;
    }

    this.targetCursorY = row;
    this.targetCursorX = col;
  }

  getExpectedState() {
    return {
      backbuffer: [...this.backbuffer],
      screen: [...this.screen],
      cursorX: this.cursorX,
      cursorY: this.cursorY,
    };
  }

  finish() {
    this.finishChunkAndUpdateCursor();
    this.targetCursorY = -1;
    this.targetCursorX = -1;
  }

  done() {
    this.finishChunkAndUpdateCursor();
    this.unkownCursorLocation();
    this.resetScrollRegion();

    if (this.screen.length > 0) {
      this.moveCursor(this.rows - 1, 0);
      this.writeHelper("\n");
      this.cursorX = 0;
      this.cursorY = this.rows;
    }

    this.finishChunkAndUpdateCursor();
    this.flush();
    this.isDone = true;
  }

  moveCursor(x: number, y: number) {
    if (x === this.cursorY && y === this.cursorX) {
      return;
    }

    const diff = x - this.cursorY;

    if (this.cursorY < 0 || this.cursorX < 0 || x !== this.cursorY || y !== this.cursorX) {
      this.writeHelper(ansiEscapes.cursorTo(y, x));
      this.cursorY = x;
      this.cursorX = y;
      return;
    }

    if (diff > 0) {
      this.writeHelper(getMoveCursorDownCode(diff));
    } else if (diff < 0) {
      this.writeHelper(getMoveCursorUpCode(-diff));
    }

    this.cursorY = x;

    if (y !== this.cursorX) {
      if (y === 0) {
        this.writeHelper(ansiEscapes.cursorLeft);
      } else {
        this.writeHelper(ansiEscapes.cursorTo(y));
      }

      this.cursorX = y;
    }
  }

  clampLine(line: StyledLine | undefined, width: number): RenderLine {
    if (width <= 0 || !line) {
      return {
        styledChars: new StyledLine(),
        text: "",
        length: 0,
        tainted: false,
      };
    }

    let i = line.length - 1;
    while (i >= 0 && line.getValue(i) === " " && !line.hasStyles(i)) {
      i--;
    }

    const trimmedLength = i + 1;

    let visualWidth = 0;

    for (let k = 0; k < trimmedLength; k++) {
      const val = line.getValue(k);
      if (val === "") continue;
      visualWidth += line.getFullWidth(k) ? 2 : 1;
    }

    if (visualWidth <= width) {
      const styledChars = trimmedLength === line.length ? line : line.slice(0, trimmedLength);
      return {
        styledChars,
        text: styledLineToString(styledChars),
        length: visualWidth,
        tainted: false,
      };
    }

    // Truncate logic
    const lastVal = line.getValue(i);
    const lastFullWidth = line.getFullWidth(i);
    const hasBoxChar = lastVal === "╮" || lastVal === "│" || lastVal === "╯";

    let targetVisualWidth = width;

    if (hasBoxChar) {
      targetVisualWidth -= lastFullWidth ? 2 : 1;
    }

    let currentWidth = 0;
    let sliceIndex = 0;

    for (let k = 0; k < trimmedLength; k++) {
      const charWidth = line.getFullWidth(k) ? 2 : 1;

      if (currentWidth + charWidth > targetVisualWidth) {
        break;
      }

      currentWidth += charWidth;
      sliceIndex++;
    }

    if (hasBoxChar) {
      const boxWidth = lastFullWidth ? 2 : 1;
      const lastCharLine = new StyledLine();
      lastCharLine.pushChar(lastVal, line.getFormatFlags(i), line.getFgColor(i), line.getBgColor(i), line.getLink(i));
      const styledChars = line.slice(0, sliceIndex).combine(lastCharLine);

      return {
        styledChars,
        text: styledLineToString(styledChars),
        length: currentWidth + boxWidth,
        tainted: false,
      };
    }

    const styledChars = line.slice(0, sliceIndex);
    return {
      styledChars,
      text: styledLineToString(styledChars),
      length: currentWidth,
      tainted: false,
    };
  }

  syncLine(line: RenderLine, y: number) {
    if (y < 0 || y >= this.rows) {
      return;
    }

    const clampedLine = this.clampLine(line.styledChars, this.columns);
    const currentLine = this.screen[y];

    if (currentLine && !currentLine.tainted && currentLine.text === clampedLine.text) {
      // Content matches, no update needed
      return;
    }

    this.moveCursor(y, 0);
    this.linesUpdated++;

    let textToWrite = clampedLine.text;
    if (this.debugRainbowColor) {
      textToWrite = colorize(textToWrite, this.debugRainbowColor, "background");
    }

    this.writeHelper(textToWrite);

    if (clampedLine.length < this.columns) {
      this.writeHelper(ansiEscapes.eraseEndLine);
    }

    if (y !== this.rows - 1 && y !== this.scrollRegionBottom - 1) {
      this.writeHelper("\n");
      this.cursorY = y + 1;
      this.cursorX = -1;
    } else {
      this.cursorY = y;
      this.cursorX = clampedLine.length;
    }

    clampedLine.tainted = false;
    this.screen[y] = clampedLine;
  }

  scrollLines(options: { start: number; end: number; linesToScroll: number; lines: RenderLine[]; direction: "up" | "down"; scrollToBackbuffer: boolean }) {
    try {
      this.performScroll(options);
    } finally {
      this.resetScrollRegion();
    }
  }

  resize(columns: number, rows: number) {
    if (this.columns === columns && this.rows === rows) {
      return;
    }

    this.columns = columns;
    this.rows = rows;

    const startIndex = Math.max(0, this.backbuffer.length - this.rows);

    for (let i = startIndex; i < this.backbuffer.length; i++) {
      const line = this.backbuffer[i];

      if (line && line.length >= this.columns) {
        line.tainted = true;
      }
    }

    for (const line of this.screen) {
      if (line) {
        line.tainted = true;
      }
    }
  }

  clear(_options?: { readonly keepTrackingMaps?: boolean }) {
    if (process.env["TERM_PROGRAM"] === "vscode" && this.forceScrollToBottomOnBackbufferRefresh) {
      this.writeHelper(ris);
    } else if (process.env["TERM_PROGRAM"] === "iTerm.app") {
      this.writeHelper(ansiEscapes.clearTerminal);
    } else {
      this.writeHelper(clearScrollbackStandard);
      this.writeHelper(homeEraseDown);
    }

    // Tmux does not reset the scroll region reliably on clear so we
    // reset it manually.
    this.writeHelper(resetScrollRegion);
    this.scrollRegionTop = -1;
    this.scrollRegionBottom = -1;
    this.screen = [];
    this.backbuffer = [];
    this.firstRender = true;
    this.backbufferDirty = false;
    this.backbufferDirtyCurrentFrame = false;

    if (this.fullRenderTimeout) {
      clearTimeout(this.fullRenderTimeout);
      this.fullRenderTimeout = undefined;
    }

    // Set the cursor to an unknown location as tmux
    // Does not appear to always reset it to 0,0 on clear
    // While in mouse mode.
    this.cursorX = -1;
    this.cursorY = -1;
  }

  startSynchronizedOutput() {
    this.writeHelper(enterSynchronizedOutput);
  }

  endSynchronizedOutput() {
    this.writeHelper(exitSynchronizedOutput);
    this.finishChunkAndUpdateCursor();
  }

  flush() {
    if (this.isDone) return;
    if (this.cancelSlowFlush) {
      this.cancelSlowFlush();
    }

    this.finishChunkAndUpdateCursor();

    if (this.outputBuffer.length > 0) {
      this.synchronizedWrite(this.outputBuffer.join(""));
    }

    this.firstRender = false;

    this.outputBuffer = [];
  }

  /**
   * Testing only method that flushes content slowly to simplify debugging
   * hard to diagnose issues.
   *
   * If there are bugs in terminal-writer a good way to debug is to call
   * slowFlush instead of flush() so you can see the incremental states the
   * terminal goes through applying the changes.
   */
  async slowFlush() {
    if (this.isDone) return;

    if (this.cancelSlowFlush) {
      this.cancelSlowFlush();
    }

    this.finishChunkAndUpdateCursor();

    if (this.outputBuffer.length === 0) {
      return;
    }

    this.firstRender = false;

    while (this.outputBuffer.length > 0) {
      const chunk = this.outputBuffer.shift();

      if (chunk) {
        this.synchronizedWrite(chunk);
      }

      await new Promise<void>((resolve) => {
        let finished = false;
        const timer = setTimeout(() => {
          finished = true;
          this.cancelSlowFlush = undefined;
          resolve();
        }, 50);

        this.cancelSlowFlush = () => {
          if (!finished) {
            clearTimeout(timer);
            finished = true;

            if (this.outputBuffer.length > 0) {
              this.synchronizedWrite(this.outputBuffer.join(""));
              this.outputBuffer = [];
            }

            this.cancelSlowFlush = undefined;
            resolve();
          }
        };
      });
    }
  }

  validateLinesConsistent(lines: RenderLine[]) {
    if (this.isTainted) {
      return;
    }

    for (let r = 0; r < this.rows; r++) {
      const index = lines.length + r - this.rows;

      if (index < 0) {
        continue;
      }

      if (!linesEqual(this.screen[r]?.styledChars, lines[index]?.styledChars) && debugWorker) {
        debugLog(
          `Line ${r} on screen inconsistent between terminalWriter and ground truth. Expected "${styledLineToString(
            lines[index]?.styledChars ?? new StyledLine()
          )}", got "${styledLineToString(this.screen[r]?.styledChars ?? new StyledLine())}"`
        );
      }
    }

    // Validated the backbuffer matches for lines 0 -> this.lines.length - this.rows
    const backbufferLimit = lines.length - this.rows;

    for (let i = 0; i < backbufferLimit; i++) {
      if (!linesEqual(this.backbuffer[i]?.styledChars, lines[i]?.styledChars) && debugWorker) {
        debugLog(
          `Line ${i} in backbuffer inconsistent. Expected "${styledLineToString(
            lines[i]?.styledChars ?? new StyledLine()
          )}", got "${styledLineToString(this.backbuffer[i]?.styledChars ?? new StyledLine())}"`
        );
      }
    }
  }

  private shiftScreenUp(start: number, bottom: number) {
    for (let i = start; i < bottom - 1; i++) {
      this.screen[i] = this.screen[i + 1]!;
    }

    this.screen[bottom - 1] = {
      styledChars: new StyledLine(),
      text: "",
      length: 0,
      tainted: false,
    };
  }

  /**
   * Trigger a scroll up of content into the backbuffer.
   */
  private applyScrollUpBackbuffer(start: number, bottom: number) {
    // Simulate the effect of adding a linebreak at the bottom of the scroll region.

    this.moveCursor(bottom - 1, 0);
    this.writeHelper("\n");
    this.cursorX = -1;
    this.cursorY = bottom - 1;

    if (start === 0) {
      this.backbuffer.push(this.screen[0]!);

      if (this.backbuffer.length > this.maxScrollbackLength) {
        this.backbuffer.shift();
      }
    }

    this.shiftScreenUp(start, bottom);
  }

  private applyScrollUp(start: number, bottom: number) {
    if (start === 0 && platform.isAppleTerminal() && bottom > 1) {
      // Terminal.app doesn't respect scroll regions starting at line 0.
      // Workaround: set scroll region to exclude line 0, do hardware scroll
      // on lines 1+, then manually rewrite line 0.
      const line0Content = this.screen[1];

      // Set scroll region to lines 1 through bottom (excluding line 0)
      this.writeHelper(getSetScrollRegionCode(1, bottom)); // 1-indexed: line 2 = index 1
      this.scrollRegionTop = 1;
      this.scrollRegionBottom = bottom;

      // Now delete a line at line 1 (this will scroll within the region)
      this.moveCursor(1, 0);
      this.writeHelper(getDeleteLinesCode(1));

      // Update screen state for lines 1 through bottom-1
      this.shiftScreenUp(1, bottom);

      // Mark line 0 as tainted so it gets redrawn with what was line 1
      if (line0Content) {
        this.screen[0] = { ...line0Content, tainted: true };
      } else {
        this.screen[0] = {
          styledChars: new StyledLine(),
          text: "",
          length: 0,
          tainted: true,
        };
      }

      return;
    }

    this.moveCursor(start, 0);
    this.writeHelper(getDeleteLinesCode(1));
    // Simulate the effect of the ansi escape for scroll up
    this.shiftScreenUp(start, bottom);
  }

  private applyScrollDown(start: number, bottom: number) {
    this.moveCursor(start, 0);
    this.writeHelper(getInsertLinesCode(1));
    // Simulate the effect of the ansi escape for scroll up
    for (let i = bottom - 1; i > start; i--) {
      this.screen[i] = this.screen[i - 1]!;
    }

    this.screen[start] = {
      styledChars: new StyledLine(),
      text: "",
      length: 0,
      tainted: false,
    };
  }

  private performScroll(options: {
    start: number;
    end: number;
    linesToScroll: number;
    lines: RenderLine[];
    direction: "up" | "down";
    scrollToBackbuffer: boolean;
  }) {
    const { start, end, linesToScroll, lines, direction, scrollToBackbuffer } = options;
    if (debugWorker) {
      debugLog(`[terminal-writer] SCROLLING LINES ${start}-${end} by ${linesToScroll} ${direction}`);
    }

    this.setScrollRegion(start, end);
    const scrollAreaHeight = end - start;

    if (lines.length !== end - start + linesToScroll) {
      throw new Error(`Mismatch in scrollLines: expected ${end - start + linesToScroll} lines, got ${lines.length}`);
    }

    if (scrollToBackbuffer && direction !== "up") {
      throw new Error(`scrollToBackbuffer is only supported for direction "up"`);
    }

    // Make sure the content on screen before scrolling really matches what is in lines.
    // For 'up', existing content is at the start of 'lines'.
    // For 'down', existing content is at the end of 'lines'.
    const existingContentOffset = direction === "up" ? 0 : linesToScroll;
    for (let i = start; i < end; i++) {
      this.syncLine(lines[existingContentOffset + i - start]!, i);
    }

    if (direction === "up") {
      for (let i = 0; i < linesToScroll; i++) {
        if (scrollToBackbuffer) {
          if (start > 0) {
            // Case: Scrolling a region that doesn't start at row 0.
            // To push row 0 to history, we MUST scroll the whole screen.
            this.setScrollRegion(0, this.rows);
            const savedHeader = this.screen.slice(0, start);
            const savedFooter = this.screen.slice(end, this.rows);

            this.syncLine(lines[i]!, 0);
            this.applyScrollUpBackbuffer(0, this.rows);

            for (const [k, element] of savedHeader.entries()) {
              this.syncLine(element, k);
            }

            for (const [k, element] of savedFooter.entries()) {
              this.syncLine(element, end + k);
            }
          } else {
            // Case: start === 0.
            // We can push to history by scrolling the region from 0 to 'end'.
            // This preserves everything below 'end' (e.g. the footer).
            this.setScrollRegion(0, end);

            // 1. Use the provided 'clean' line to replace the top row
            this.syncLine(lines[i]!, 0);
            this.applyScrollUpBackbuffer(0, end);
          }
        } else {
          this.applyScrollUp(start, end);
        }
        // Add the new line at the end after scrolling up the other lines

        this.unkownCursorLocation();
        this.syncLine(lines[i + scrollAreaHeight]!, end - 1);
      }

      this.finishChunkAndUpdateCursor();
    } else if (direction === "down") {
      for (let i = 0; i < linesToScroll; i++) {
        const line = lines[linesToScroll - 1 - i]!;
        this.applyScrollDown(start, end);
        // Add the new line at the end after scrolling up the other lines
        this.unkownCursorLocation();
        this.syncLine(line, start);
      }

      this.finishChunkAndUpdateCursor();
    }
  }

  private synchronizedWrite(text: string) {
    if (this.enableSynchronizedOutput) {
      this.stdout.write(enterSynchronizedOutput + text + exitSynchronizedOutput);
    } else {
      this.stdout.write(text);
    }
  }

  private resetScrollRegion() {
    if (this.scrollRegionTop !== -1 || this.scrollRegionBottom !== -1) {
      this.writeHelper(resetScrollRegion);
      this.unkownCursorLocation();
      this.scrollRegionTop = -1;
      this.scrollRegionBottom = -1;
    }
  }

  private setScrollRegion(top: number, bottom: number) {
    if (this.scrollRegionTop !== top || this.scrollRegionBottom !== bottom) {
      this.writeHelper(getSetScrollRegionCode(top, bottom));
      this.unkownCursorLocation();
      this.scrollRegionTop = top;
      this.scrollRegionBottom = bottom;
    }
  }

  private writeHelper(text: string) {
    if (this.isDone) {
      return;
    }

    this.currentChunkBuffer.push(text);
  }

  private finishChunkAndUpdateCursor() {
    if (this.targetCursorY >= 0 && this.targetCursorX >= 0) {
      this.moveCursor(this.targetCursorY, this.targetCursorX);
    }

    if (this.currentChunkBuffer.length > 0) {
      this.outputBuffer.push(this.currentChunkBuffer.join(""));
      this.currentChunkBuffer = [];
    }
  }
}
