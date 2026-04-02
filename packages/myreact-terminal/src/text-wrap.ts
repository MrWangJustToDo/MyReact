/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { inkCharacterWidth, styledCharsWidth } from "./measure-text.js";
import { StyledLine } from "./styled-line.js";

export const sliceStyledChars = (line: StyledLine, begin: number, end?: number): StyledLine => {
  let width = 0;
  let startIndex = -1;
  let endIndex = line.length;

  for (let i = 0; i < line.length; i++) {
    const charWidth = inkCharacterWidth(line.getValue(i));
    const charStart = width;
    const charEnd = width + charWidth;

    if (end !== undefined && charEnd > end) {
      endIndex = i;
      break;
    }

    if (charStart >= begin && startIndex === -1) {
      startIndex = i;
    }

    width += charWidth;
  }

  if (startIndex === -1) return new StyledLine();
  return line.slice(startIndex, endIndex);
};

export const truncateStyledChars = (line: StyledLine, columns: number, options: { position?: "start" | "middle" | "end" } = {}): StyledLine => {
  const { position = "end" } = options;
  const truncationCharacter = "…";
  const truncationStyledLine = new StyledLine();
  truncationStyledLine.pushChar(truncationCharacter, 0);

  if (columns < 1) {
    return new StyledLine();
  }

  if (columns === 1) {
    return truncationStyledLine;
  }

  const textWidth = styledCharsWidth(line);

  if (textWidth <= columns) {
    return line;
  }

  const truncationWidth = inkCharacterWidth(truncationCharacter);

  if (position === "start") {
    const right = sliceStyledChars(line, textWidth - columns + truncationWidth, textWidth);
    return truncationStyledLine.combine(right);
  }

  if (position === "middle") {
    const leftWidth = Math.ceil(columns / 2);
    const rightWidth = columns - leftWidth;
    const left = sliceStyledChars(line, 0, leftWidth - truncationWidth);
    const right = sliceStyledChars(line, textWidth - rightWidth, textWidth);
    return left.combine(truncationStyledLine).combine(right);
  }

  const left = sliceStyledChars(line, 0, columns - truncationWidth);
  return left.combine(truncationStyledLine);
};

export const wrapStyledChars = (line: StyledLine, columns: number): StyledLine[] => {
  const rows: StyledLine[] = [];
  let currentRowStart = 0;
  let currentRowWidth = 0;
  let isAtStartOfLogicalLine = true;

  let i = 0;
  while (i < line.length) {
    const firstVal = line.getValue(i);

    if (firstVal === "\n") {
      rows.push(line.slice(currentRowStart, i));
      currentRowStart = i + 1;
      currentRowWidth = 0;
      isAtStartOfLogicalLine = true;
      i++;
      continue;
    }

    // Find word/delimiter boundary
    let j = i;
    let wordWidth = 0;
    if (firstVal === " ") {
      wordWidth = inkCharacterWidth(" ");
      j = i + 1;
    } else {
      while (j < line.length && line.getValue(j) !== " " && line.getValue(j) !== "\n") {
        wordWidth += inkCharacterWidth(line.getValue(j));
        j++;
      }
    }

    // Word/space is [i, j)
    if (currentRowWidth + wordWidth > columns && currentRowWidth > 0) {
      if (firstVal === " " && !isAtStartOfLogicalLine) {
        // Drop space that causes wrap
        i = j;
        continue;
      }

      // Wrap: finish previous row
      let trimEnd = i;
      while (trimEnd > currentRowStart && line.getValue(trimEnd - 1) === " ") {
        trimEnd--;
      }

      rows.push(line.slice(currentRowStart, trimEnd));

      currentRowStart = i;
      currentRowWidth = 0;
      // Note: isAtStartOfLogicalLine remains unchanged as we just wrapped.
      // It ensures that subsequent spaces on the new row are also dropped if needed.
      continue;
    }

    if (currentRowWidth === 0 && wordWidth > columns) {
      // Hard wrap long word
      let k = i;
      let chunkWidth = 0;
      while (k < j) {
        const cw = inkCharacterWidth(line.getValue(k));
        if (chunkWidth + cw > columns && chunkWidth > 0) {
          rows.push(line.slice(currentRowStart, k));
          currentRowStart = k;
          chunkWidth = 0;
        }

        chunkWidth += cw;
        k++;
      }

      currentRowWidth = chunkWidth;
      i = j;
      isAtStartOfLogicalLine = false;
    } else {
      // Fit
      currentRowWidth += wordWidth;
      i = j;
      if (firstVal !== " ") {
        isAtStartOfLogicalLine = false;
      }
    }
  }

  if (currentRowStart < line.length || rows.length === 0) {
    rows.push(line.slice(currentRowStart));
  }

  return rows;
};

export const wrapOrTruncateStyledChars = (line: StyledLine, maxWidth: number, textWrap = "wrap"): StyledLine[] => {
  if (textWrap.startsWith("truncate")) {
    let position: "start" | "middle" | "end" = "end";
    if (textWrap === "truncate-middle") {
      position = "middle";
    } else if (textWrap === "truncate-start") {
      position = "start";
    }

    return [truncateStyledChars(line, maxWidth, { position })];
  }

  return wrapStyledChars(line, maxWidth);
};
