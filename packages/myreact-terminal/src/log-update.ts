/* eslint-disable max-lines */
import { type StyledChar } from "@alcalzone/ansi-tokenize";
import ansiEscapes from "ansi-escapes";
import cliCursor from "cli-cursor";
import process from "node:process";
import { type Writable } from "node:stream";

import colorize from "./colorize";

// Debugging option to simulate flicker if for terminals that do not support enableSynchronizedOutput.
const enableSynchronizedOutput = true;

const enterSynchronizedOutput = "\u001B[?2026h";
const exitSynchronizedOutput = "\u001B[?2026l";

export type CursorPosition = {
  row: number;
  col: number;
};

/**
 * Build cursor movement sequence to move from currentRow to targetRow and targetCol.
 * Uses safe pattern: go to line start → move rows → set column
 * This avoids issues with intermediate lines being shorter than cursor position.
 */
function buildCursorMovement(currentRow: number, targetRow: number, targetCol: number): string {
  let buffer = "";
  buffer += ansiEscapes.cursorTo(0);
  const rowDiff = targetRow - currentRow;
  if (rowDiff > 0) {
    buffer += ansiEscapes.cursorDown(rowDiff);
  } else if (rowDiff < 0) {
    buffer += ansiEscapes.cursorUp(-rowDiff);
  }

  buffer += ansiEscapes.cursorTo(targetCol);
  return buffer;
}

/**
 * Position terminal cursor for IME support.
 * Calculates relative distance from the end of output to the cursor position.
 */
export function positionImeCursor(lineCount: number, cursorPosition: CursorPosition): string {
  let buffer = "";
  const moveUp = lineCount - 1 - cursorPosition.row;

  if (moveUp > 0) {
    buffer += ansiEscapes.cursorUp(moveUp);
  }

  buffer += ansiEscapes.cursorTo(cursorPosition.col);
  return buffer;
}

export type LogUpdate = {
  clear: () => void;
  done: () => void;
  sync: (str: string, cursorPosition?: CursorPosition) => void;
  (str: string, styledOutput: StyledChar[][], debugRainbowColor?: string, cursorPosition?: CursorPosition): void;
};

const enterAlternateBuffer = (stream: Writable, alreadyActive: boolean): void => {
  if (!alreadyActive) {
    stream.write(ansiEscapes.enterAlternativeScreen);
  }

  stream.write("\u001B[?7l");
};

const exitAlternateBuffer = (stream: Writable, lastFrame: string): void => {
  stream.write("\u001B[?7h");
  stream.write(ansiEscapes.exitAlternativeScreen);
  // The last frame was rendered to the alternate buffer.
  // We need to render it again to the main buffer. If apps do not
  // want this behavior, they can make sure the last frame is empty
  // before unmounting.
  stream.write(lastFrame);
};

const clearAlternateBuffer = (stream: Writable): void => {
  const eraseOperation = process.env["TERM_PROGRAM"] === "iTerm.app" ? ansiEscapes.clearTerminal : ansiEscapes.eraseScreen;
  stream.write(eraseOperation);
};

const ensureCursorHidden = (showCursor: boolean, hasHiddenCursor: boolean, stream: Writable): boolean => {
  if (!showCursor && !hasHiddenCursor) {
    cliCursor.hide(stream);
    return true;
  }

  return hasHiddenCursor;
};

const ensureCursorShown = (showCursor: boolean, stream: Writable): void => {
  if (!showCursor) {
    cliCursor.show(stream);
  }
};

const isCursorPositionEqual = (a: CursorPosition | undefined, b: CursorPosition | undefined): boolean => {
  const posA = a ?? { row: 0, col: 0 };
  const posB = b ?? { row: 0, col: 0 };
  return posA.row === posB.row && posA.col === posB.col;
};

/**
 * Get cursor position sequence for Alternate Buffer.
 * Alternate Buffer has no scroll, so we can use absolute coordinates directly.
 */
const getAlternateBufferCursorSequence = (cursorPosition: CursorPosition | undefined): string => {
  if (!cursorPosition) {
    return "";
  }

  return ansiEscapes.cursorTo(cursorPosition.col, cursorPosition.row);
};

const moveCursorDown = (buffer: string[], skippedLines: number): number => {
  if (skippedLines > 0) {
    if (skippedLines === 1) {
      buffer.push(ansiEscapes.cursorNextLine);
    } else {
      buffer.push(ansiEscapes.cursorDown(skippedLines));
    }
  }

  return 0;
};

const getLineLength = (styledChars: StyledChar[] | undefined): number => {
  if (styledChars === undefined) {
    return 0;
  }

  for (let j = styledChars.length - 1; j >= 0; j--) {
    const char = styledChars[j];
    if (char === undefined) {
      continue;
    }

    if ((char.value !== " " && char.value !== "") || char.styles.length > 0) {
      return j + (char.fullWidth ? 2 : 1);
    }
  }

  return 0;
};

const createStandard = (
  stream: Writable,
  {
    showCursor = false,
    alternateBuffer = false,
    alternateBufferAlreadyActive = false,
    getRows = () => 0,
    getColumns = () => 0,
  }: {
    showCursor?: boolean;
    alternateBuffer?: boolean;
    alternateBufferAlreadyActive?: boolean;
    getRows?: () => number;
    getColumns?: () => number;
  } = {}
): LogUpdate => {
  let previousLineCount = 0;
  let previousOutput = "";
  // Keep track of the actual previous output rendered to the alternate buffer
  // which may be truncated to the terminal height.
  let previousOutputAlternateBuffer = "";
  let previousRows = 0;
  let previousColumns = 0;
  let hasHiddenCursor = false;
  let isFirstRender = true;
  let previousCursorPosition: CursorPosition | undefined;

  if (alternateBuffer) {
    enterAlternateBuffer(stream, alternateBufferAlreadyActive);
  }

  const render = (str: string, _styledOutput: StyledChar[][], debugRainbowColor?: string, cursorPosition?: CursorPosition) => {
    if (!showCursor) {
      hasHiddenCursor = ensureCursorHidden(showCursor, hasHiddenCursor, stream);
    }

    const output = str + "\n";

    if (alternateBuffer) {
      let alternateBufferOutput = output;
      const rows = getRows() ?? 0;
      const columns = getColumns() ?? 0;

      if (rows > 0) {
        const lines = str.split("\n");
        const lineCount = lines.length;
        // Only write the first	`rows` lines as the alternate buffer
        // will not scroll so all we accomplish by writing more
        // content is risking flicker and confusing the terminal about
        // the cursor position.
        if (lineCount > rows) {
          alternateBufferOutput = lines.slice(0, rows).join("\n");
        }
      }

      // In alternate buffer mode we need to re-render based on whether content
      // visible within the clipped alternate output buffer has changed even
      // if the entire output string has not changed.
      if (
        alternateBufferOutput !== previousOutputAlternateBuffer ||
        rows !== previousRows ||
        columns !== previousColumns ||
        !isCursorPositionEqual(cursorPosition, previousCursorPosition)
      ) {
        // Unfortunately, eraseScreen does not work correctly in iTerm2 so we
        // have to use clearTerminal instead.
        const eraseOperation = process.env["TERM_PROGRAM"] === "iTerm.app" ? ansiEscapes.clearTerminal : ansiEscapes.eraseScreen;

        let outputToWrite = alternateBufferOutput;
        outputToWrite = debugRainbowColor ? colorize(outputToWrite, debugRainbowColor, "background") : outputToWrite;

        const cursorSequence = getAlternateBufferCursorSequence(cursorPosition);

        stream.write(
          (enableSynchronizedOutput ? enterSynchronizedOutput : "") +
            ansiEscapes.cursorTo(0, 0) +
            eraseOperation +
            outputToWrite +
            cursorSequence +
            (enableSynchronizedOutput ? exitSynchronizedOutput : "")
        );

        previousOutputAlternateBuffer = alternateBufferOutput;
        previousRows = rows;
        previousColumns = columns;
        previousCursorPosition = cursorPosition ?? { row: 0, col: 0 };
      }

      previousOutput = output;
      return;
    }

    const cursorChanged = !isCursorPositionEqual(cursorPosition, previousCursorPosition);

    if (output === previousOutput) {
      // Output is the same, but cursor position may have changed
      if (cursorChanged && cursorPosition && previousCursorPosition) {
        const buffer = buildCursorMovement(previousCursorPosition.row, cursorPosition.row, cursorPosition.col);
        previousCursorPosition = cursorPosition;
        stream.write(buffer);
      }

      return;
    }

    const lineCount = output.split("\n").length;
    let buffer = "";

    // Move cursor to end of previous output before erasing (only if we have previous cursor position)
    if (!isFirstRender && previousCursorPosition) {
      const moveDown = previousLineCount - 1 - previousCursorPosition.row;
      if (moveDown > 0) {
        buffer += ansiEscapes.cursorDown(moveDown);
      }
    }

    // Always erase previous lines
    buffer += ansiEscapes.eraseLines(previousLineCount);

    buffer += output;
    isFirstRender = false;

    if (cursorPosition) {
      buffer += positionImeCursor(lineCount, cursorPosition);
    }

    previousCursorPosition = cursorPosition;

    previousOutput = output;
    previousLineCount = lineCount;
    let outputToWrite = buffer;

    if (debugRainbowColor) {
      outputToWrite = ansiEscapes.eraseLines(previousLineCount) + colorize(output, debugRainbowColor, "background");
    }

    stream.write(outputToWrite);
  };

  render.clear = () => {
    hasHiddenCursor = false;

    if (alternateBuffer) {
      clearAlternateBuffer(stream);
      previousOutput = "";
      previousOutputAlternateBuffer = "";
      return;
    }

    let buffer = "";
    if (previousCursorPosition) {
      const moveDown = previousLineCount - 1 - previousCursorPosition.row;
      if (moveDown > 0) {
        buffer += ansiEscapes.cursorDown(moveDown);
      }
    }

    stream.write(buffer + ansiEscapes.eraseLines(previousLineCount));
    previousOutput = "";
    previousLineCount = 0;
  };

  render.done = () => {
    const lastFrame = previousOutput;
    previousOutput = "";
    previousLineCount = 0;

    if (!showCursor) {
      ensureCursorShown(showCursor, stream);
      hasHiddenCursor = false;
    }

    if (alternateBuffer) {
      exitAlternateBuffer(stream, lastFrame);
    }
  };

  render.sync = (str: string, _cursorPosition?: CursorPosition) => {
    if (alternateBuffer) {
      previousOutput = str;
      return;
    }

    const output = str + "\n";
    previousOutput = output;
    previousLineCount = output.split("\n").length;
  };

  return render;
};

const createIncremental = (
  stream: Writable,
  {
    showCursor = false,
    alternateBuffer = false,
    alternateBufferAlreadyActive = false,
    getRows = () => 0,
    getColumns = () => 0,
  }: {
    showCursor?: boolean;
    alternateBuffer?: boolean;
    alternateBufferAlreadyActive?: boolean;
    getRows?: () => number;
    getColumns?: () => number;
  } = {}
): LogUpdate => {
  let previousLines: string[] = [];
  let previousOutput = "";
  let previousOutputAlternateBuffer = "";
  let previousRows = 0;
  let previousColumns = 0;
  let hasHiddenCursor = false;
  let alternateBufferStyledOutput: StyledChar[][] = [];
  let previousCursorPosition: CursorPosition | undefined;

  if (alternateBuffer) {
    enterAlternateBuffer(stream, alternateBufferAlreadyActive);
  }

  const render = (str: string, styledOutput: StyledChar[][], debugRainbowColor?: string, cursorPosition?: CursorPosition) => {
    if (!showCursor) {
      hasHiddenCursor = ensureCursorHidden(showCursor, hasHiddenCursor, stream);
    }

    const output = str + "\n";

    if (alternateBuffer) {
      let alternateBufferOutput = output;
      const rows = getRows() ?? 0;
      const columns = getColumns() ?? 0;

      if (rows > 0) {
        const lines = str.split("\n");
        const lineCount = lines.length;
        // Only write the first `rows` lines as the alternate buffer
        // will not scroll so all we accomplish by writing more
        // content is risking flicker and confusion about the terminal about
        // the cursor position.
        if (lineCount > rows) {
          alternateBufferOutput = lines.slice(0, rows).join("\n");
          alternateBufferStyledOutput = styledOutput.slice(0, rows);
        } else {
          alternateBufferOutput = lines.join("\n");
          alternateBufferStyledOutput = styledOutput;
        }
      }

      // In alternate buffer mode we need to re-render based on whether content
      // visible within the clipped alternate output buffer has changed even
      // if the entire output string has not changed.
      if (
        alternateBufferOutput !== previousOutputAlternateBuffer ||
        rows !== previousRows ||
        columns !== previousColumns ||
        !isCursorPositionEqual(cursorPosition, previousCursorPosition)
      ) {
        const nextLines = alternateBufferOutput.split("\n");

        const cursorSequence = getAlternateBufferCursorSequence(cursorPosition);

        if (rows === previousRows && columns === previousColumns) {
          const buffer: string[] = [];
          if (enableSynchronizedOutput) {
            buffer.push(enterSynchronizedOutput);
          }

          buffer.push(ansiEscapes.cursorTo(0, 0));

          let skippedLines = 0;
          for (let i = 0; i < nextLines.length; i++) {
            if (nextLines[i] === previousLines[i]) {
              skippedLines++;
              continue;
            }

            skippedLines = moveCursorDown(buffer, skippedLines);

            let lineToWrite = nextLines[i] ?? "";

            const lineLength = getLineLength(alternateBufferStyledOutput[i]);

            lineToWrite = debugRainbowColor ? colorize(lineToWrite, debugRainbowColor, "background") : lineToWrite;

            buffer.push(lineToWrite);
            if (columns > lineLength) {
              // Clear the rest of the line without introducing flicker.
              // We could optimize this further by only writing spaces up to the last line length
              // but this is safer.
              // The one failure mode for this is that if we add too many spaces and there was a
              // non space character at the very end of the line
              buffer.push(" ".repeat(columns - lineLength));
            }

            if (i < nextLines.length - 1) {
              buffer.push("\n");
            }
          }

          skippedLines = moveCursorDown(buffer, skippedLines);

          if (previousLines.length > nextLines.length) {
            const linesToClear = previousLines.length - nextLines.length;
            for (let i = 0; i < linesToClear; i++) {
              buffer.push(ansiEscapes.eraseLine + ansiEscapes.cursorNextLine);
            }
          }

          buffer.push(cursorSequence);

          if (enableSynchronizedOutput) {
            buffer.push(exitSynchronizedOutput);
          }

          stream.write(buffer.join(""));
        } else {
          // Unfortunately, eraseScreen does not work correctly in iTerm2 so we
          // have to use clearTerminal instead.
          const eraseOperation = process.env["TERM_PROGRAM"] === "iTerm.app" ? ansiEscapes.clearTerminal : ansiEscapes.eraseScreen;

          let outputToWrite = alternateBufferOutput;

          outputToWrite = debugRainbowColor ? colorize(outputToWrite, debugRainbowColor, "background") : outputToWrite;

          stream.write(
            (enableSynchronizedOutput ? enterSynchronizedOutput : "") +
              ansiEscapes.cursorTo(0, 0) +
              eraseOperation +
              outputToWrite +
              cursorSequence +
              (enableSynchronizedOutput ? exitSynchronizedOutput : "")
          );
          previousRows = rows;
          previousColumns = columns;
        }

        previousOutputAlternateBuffer = alternateBufferOutput;
        previousLines = nextLines;
        previousCursorPosition = cursorPosition ?? { row: 0, col: 0 };
      }

      previousOutput = output;
      return;
    }

    if (output === previousOutput) {
      if (!isCursorPositionEqual(cursorPosition, previousCursorPosition) && cursorPosition && previousCursorPosition) {
        const buffer = buildCursorMovement(previousCursorPosition.row, cursorPosition.row, cursorPosition.col);
        previousCursorPosition = cursorPosition;
        stream.write(buffer);
      }

      return;
    }

    const previousCount = previousLines.length;
    const nextLines = output.split("\n");
    const nextCount = nextLines.length;
    const visibleCount = nextCount - 1;

    if (cursorPosition !== undefined || previousCursorPosition !== undefined) {
      let buffer = "";

      if (output === "\n" || previousOutput.length === 0) {
        // First rendering
        buffer += output;
        buffer += ansiEscapes.cursorSavePosition;
      } else {
        // Incremental rendering after cursor restore
        buffer += ansiEscapes.cursorRestorePosition;

        if (nextCount < previousCount) {
          buffer += ansiEscapes.eraseLines(previousCount - nextCount + 1);
          buffer += ansiEscapes.cursorUp(visibleCount);
        } else {
          buffer += ansiEscapes.cursorUp(previousCount - 1);
        }

        for (let i = 0; i < visibleCount; i++) {
          if (nextLines[i] === previousLines[i]) {
            buffer += ansiEscapes.cursorNextLine;
            continue;
          }

          buffer += ansiEscapes.eraseLine + nextLines[i] + "\n";
        }

        buffer += ansiEscapes.cursorSavePosition;
      }

      if (cursorPosition) {
        // Move cursor to specified position
        buffer += buildCursorMovement(visibleCount, cursorPosition.row, cursorPosition.col);
      }

      stream.write(buffer);
      previousOutput = output;
      previousLines = nextLines;
      previousCursorPosition = cursorPosition;
      return;
    }

    if (output === "\n" || previousOutput.length === 0) {
      let outputToWrite = output;

      outputToWrite = debugRainbowColor ? colorize(outputToWrite, debugRainbowColor, "background") : outputToWrite;

      stream.write(ansiEscapes.eraseLines(previousCount) + outputToWrite);
      previousOutput = output;
      previousLines = nextLines;
      return;
    }

    // We aggregate all chunks for incremental rendering into a buffer, and then write them to stdout at the end.
    const buffer: string[] = [];

    // Clear extra lines if the current content's line count is lower than the previous.
    if (nextCount < previousCount) {
      buffer.push(
        // Erases the trailing lines and the final newline slot.
        ansiEscapes.eraseLines(previousCount - nextCount + 1),
        // Positions cursor to the top of the rendered output.
        ansiEscapes.cursorUp(visibleCount)
      );
    } else {
      buffer.push(ansiEscapes.cursorUp(previousCount - 1));
    }

    let skippedLines = 0;
    for (let i = 0; i < visibleCount; i++) {
      // We do not write lines if the contents are the same. This prevents flickering during renders.
      if (nextLines[i] === previousLines[i]) {
        skippedLines++;
        continue;
      }

      skippedLines = moveCursorDown(buffer, skippedLines);

      let lineToWrite = nextLines[i] ?? "";

      lineToWrite = debugRainbowColor ? colorize(lineToWrite, debugRainbowColor, "background") : lineToWrite;

      buffer.push(ansiEscapes.eraseLine + lineToWrite + "\n");
    }

    skippedLines = moveCursorDown(buffer, skippedLines);

    stream.write(buffer.join(""));

    previousOutput = output;
    previousLines = nextLines;
  };

  render.clear = () => {
    hasHiddenCursor = false;

    if (alternateBuffer) {
      clearAlternateBuffer(stream);
      previousOutput = "";
      previousOutputAlternateBuffer = "";
      previousLines = [];
      return;
    }

    let buffer = "";
    if (previousCursorPosition) {
      const moveDown = previousLines.length - 1 - previousCursorPosition.row;
      if (moveDown > 0) {
        buffer += ansiEscapes.cursorDown(moveDown);
      }
    }

    stream.write(buffer + ansiEscapes.eraseLines(previousLines.length));
    previousOutput = "";
    previousLines = [];
  };

  render.done = () => {
    const lastFrame = previousOutput;
    previousOutput = "";
    previousLines = [];

    if (!showCursor) {
      ensureCursorShown(showCursor, stream);
      hasHiddenCursor = false;
    }

    if (alternateBuffer) {
      exitAlternateBuffer(stream, lastFrame);
    }
  };

  render.sync = (str: string, _cursorPosition?: CursorPosition) => {
    if (alternateBuffer) {
      previousOutput = str;
      return;
    }

    const output = str + "\n";
    previousOutput = output;
    previousLines = output.split("\n");
  };

  return render;
};

const create = (
  stream: Writable,
  {
    showCursor = false,
    alternateBuffer = false,
    alternateBufferAlreadyActive = false,
    incremental = false,
    getRows,
    getColumns,
  }: {
    showCursor?: boolean;
    alternateBuffer?: boolean;
    alternateBufferAlreadyActive?: boolean;
    incremental?: boolean;
    getRows?: () => number;
    getColumns?: () => number;
  } = {}
): LogUpdate => {
  if (incremental) {
    return createIncremental(stream, {
      showCursor,
      alternateBuffer,
      alternateBufferAlreadyActive,
      getRows,
      getColumns,
    });
  }

  return createStandard(stream, {
    showCursor,
    alternateBuffer,
    alternateBufferAlreadyActive,
    getRows,
    getColumns,
  });
};

const logUpdate = { create };
export default logUpdate;
