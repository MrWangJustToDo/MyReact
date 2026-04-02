/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ansiEscapes from "ansi-escapes";

export const enterSynchronizedOutput = "\u001B[?2026h";
export const exitSynchronizedOutput = "\u001B[?2026l";
export const resetScrollRegion = "\u001B[r";

export const ris = "\u001Bc";
export const clearScrollbackStandard = "\u001B[3J";
export const homeEraseDown = "\u001B[H\u001B[J";

export const getMoveCursorDownCode = (skippedLines: number): string => {
  if (skippedLines > 0) {
    if (skippedLines === 1) {
      return ansiEscapes.cursorNextLine;
    }

    return ansiEscapes.cursorDown(skippedLines);
  }

  return "";
};

export const getMoveCursorUpCode = (skippedLines: number): string => {
  if (skippedLines > 0) {
    if (skippedLines === 1) {
      return ansiEscapes.cursorPrevLine;
    }

    return ansiEscapes.cursorUp(skippedLines);
  }

  return "";
};

export const getDeleteLinesCode = (count: number): string => {
  return `\u001B[${count}M`;
};

export const getInsertLinesCode = (count: number): string => {
  return `\u001B[${count}L`;
};

export const getSetScrollRegionCode = (top: number, bottom: number): string => {
  return `\u001B[${top + 1};${bottom}r`;
};
