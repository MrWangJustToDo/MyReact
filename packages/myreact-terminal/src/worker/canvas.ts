/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { StyledLine } from "../styled-line.js";

import { type RenderLine } from "./terminal-writer.js";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * A 2D drawing surface for terminal characters.
 * Handles clipping and bounds checking.
 */
export class Canvas {
  /**
   * Creates a new Canvas from a set of lines.
   */
  static fromLines(width: number, height: number, lines: RenderLine[]): Canvas {
    return new Canvas(width, height, lines);
  }

  /**
   * Creates an empty Canvas with the given dimensions.
   */
  static create(width: number, height: number, tainted = false): Canvas {
    const lines: RenderLine[] = [];
    for (let i = 0; i < height; i++) {
      lines.push({
        styledChars: new StyledLine(),
        text: "",
        length: 0,
        tainted,
      });
    }

    return new Canvas(width, height, lines);
  }

  constructor(
    public readonly width: number,
    public readonly height: number,
    private readonly lines: RenderLine[]
  ) {}

  /**
   * Returns the character at the given coordinates.
   */
  getChar(x: number, y: number): { bgColor?: string } | undefined {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return undefined;
    }

    const line = this.lines[y];
    if (!line || x >= line.styledChars.length) {
      return undefined;
    }

    return { bgColor: line.styledChars.getBgColor(x) };
  }

  /**
   * Sets a character at the given coordinates, respecting clipping.
   */

  setChar(x: number, y: number, value: string, formatFlags: number, fgColor?: string, bgColor?: string, link?: string, clip?: Rect) {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return;
    }

    if (clip && (x < clip.x || x >= clip.x + clip.w || y < clip.y || y >= clip.y + clip.h)) {
      return;
    }

    const line = this.lines[y];
    if (!line) {
      return;
    }

    while (line.styledChars.length <= x) {
      line.styledChars.pushChar(" ", 0);
    }

    line.styledChars.setChar(x, value, formatFlags, fgColor, bgColor, link);
  }

  /**
   * Draws a sequence of characters starting at (x, y).
   */
  drawStyledChars(x: number, y: number, chars: StyledLine, clip?: Rect) {
    for (let i = 0; i < chars.length; i++) {
      this.setChar(x + i, y, chars.getValue(i), chars.getFormatFlags(i), chars.getFgColor(i), chars.getBgColor(i), chars.getLink(i), clip);
    }
  }

  /**
   * Returns the underlying lines.
   */
  getLines(): RenderLine[] {
    return this.lines;
  }
}
