import stringWidth from "string-width";

import { DataLimitedLruMap } from "./data-limited-lru-map.js";
import { type DOMNode } from "./dom.js";
import { StyledLine } from "./styled-line.js";
import { buildStyledLine } from "./tokenize.js";

export type StringWidth = (text: string) => number;

/**
 * Character offset range within a text sequence.
 * Used for mapping DOM nodes to their character positions.
 */
export type CharOffsetRange = { start: number; end: number };

/**
 * Maps DOM nodes to their character offset ranges within squashed text.
 * This is the same character counting method used by getPositionAtOffset(),
 * ensuring consistent cursor position calculations across the codebase.
 */
export type CharOffsetMap = Map<DOMNode, CharOffsetRange>;

const defaultStringWidth: StringWidth = stringWidth;

let currentStringWidth: StringWidth = defaultStringWidth;

// This cache must be cleared each time the string width function is changed.
// The strings passed as input are single characters so there is no need to
// limit the size of the cache as there are only a limited number of valid
// characters.
const widthCache = new Map<string, number>();

// This cache can persist for the lifetime of the application.
// The keys for this cache can be very large so we need to limit the size
// of the data cached as well as the number of keys cached to prevent
// memory issues.
const toStyledCharactersCache = new DataLimitedLruMap<StyledLine>(2000, 100_000);

let toStyledCharactersCacheEnabled = true;

export function setEnableToStyledCharactersCache(enabled: boolean) {
  toStyledCharactersCacheEnabled = enabled;
  if (!enabled) {
    toStyledCharactersCache.clear();
  }
}

export function setStringWidthFunction(fn: StringWidth) {
  currentStringWidth = fn;
  clearStringWidthCache();
}

export function clearStringWidthCache() {
  widthCache.clear();
}

export function clearToStyledCharactersCache() {
  toStyledCharactersCache.clear();
}

export function toStyledCharacters(text: string): StyledLine {
  if (toStyledCharactersCacheEnabled) {
    const cached = toStyledCharactersCache.get(text);
    if (cached !== undefined) {
      return cached;
    }
  }

  const characters = buildStyledLine(text);
  const combinedLine = new StyledLine();

  for (let i = 0; i < characters.length; i++) {
    const value = characters.getValue(i);
    const formatFlags = characters.getFormatFlags(i);
    const fgColor = characters.getFgColor(i);
    const bgColor = characters.getBgColor(i);
    const link = characters.getLink(i);

    if (value === "\t") {
      for (let j = 0; j < 4; j++) {
        combinedLine.pushChar(" ", formatFlags, fgColor, bgColor, link);
      }

      continue;
    }

    if (value === "\b") {
      continue;
    }

    let combinedValue = value;
    let isCombined = false;
    const firstCodePoint = combinedValue.codePointAt(0);

    // 1. Regional Indicators (Flags)
    // These combine in pairs.
    // See: https://en.wikipedia.org/wiki/Regional_indicator_symbol
    if (firstCodePoint && firstCodePoint >= 0x1_f1_e6 && firstCodePoint <= 0x1_f1_ff && i + 1 < characters.length) {
      const nextValue = characters.getValue(i + 1);
      const nextFirstCodePoint = nextValue.codePointAt(0);

      if (nextFirstCodePoint && nextFirstCodePoint >= 0x1_f1_e6 && nextFirstCodePoint <= 0x1_f1_ff) {
        combinedValue += nextValue;
        i++;
        isCombined = true;
      }
    }

    // 2. Other combining characters
    // See: https://en.wikipedia.org/wiki/Combining_character
    if (!isCombined) {
      // 2. Other combining characters
      while (i + 1 < characters.length) {
        const nextValue = characters.getValue(i + 1);
        if (!nextValue) break;

        const nextFirstCodePoint = nextValue.codePointAt(0);
        if (!nextFirstCodePoint) break;

        // Unicode Mark category includes:
        // - Combining Diacritical Marks (U+0300-036F)
        // - Thai combining characters (U+0E31-0E3A, U+0E47-0E4E)
        // - Variation selectors (U+FE00-FE0F)
        // - Combining enclosing keycap (U+20E3)
        // - And many other combining marks across Unicode
        const isUnicodeMark = /\p{Mark}/u.test(nextValue);

        // Skin tone modifiers (emoji modifiers, not in Mark category)
        const isSkinToneModifier = nextFirstCodePoint >= 0x1_f3_fb && nextFirstCodePoint <= 0x1_f3_ff;

        // Zero-width joiner (used in emoji sequences)
        const isZeroWidthJoiner = nextFirstCodePoint === 0x20_0d;

        // Tags block (U+E0000 - U+E007F, used for flag emoji)
        const isTagsBlock = nextFirstCodePoint >= 0xe_00_00 && nextFirstCodePoint <= 0xe_00_7f;

        const isCombining =
          isUnicodeMark ||
          isSkinToneModifier ||
          isZeroWidthJoiner ||
          isTagsBlock ||
          nextFirstCodePoint === 0x0e_33 || // Thai SARA AM
          nextFirstCodePoint === 0x0e_b3; // Lao SARA AM

        if (!isCombining) {
          break;
        }

        // If it was a ZWJ, also consume the character after it.
        combinedValue += nextValue;
        i++;

        if (isZeroWidthJoiner && i + 1 < characters.length) {
          const characterAfterZwj = characters.getValue(i + 1);
          if (characterAfterZwj) {
            combinedValue += characterAfterZwj;
            i++;
          }
        }
      }
    }

    combinedLine.pushChar(combinedValue, formatFlags, fgColor, bgColor, link);
  }

  if (toStyledCharactersCacheEnabled) {
    toStyledCharactersCache.set(text, combinedLine);
  }

  return combinedLine;
}

export function styledCharsWidth(line: StyledLine): number {
  let length = 0;
  for (let i = 0; i < line.length; i++) {
    length += inkCharacterWidth(line.getValue(i));
  }

  return length;
}

export function inkCharacterWidth(text: string): number {
  if (text.length === 1) {
    const code = text.charCodeAt(0);
    if (code >= 32 && code < 127) {
      return 1;
    }
  }

  const width = widthCache.get(text);
  if (width !== undefined) {
    return width;
  }

  let calculatedWidth: number;
  try {
    calculatedWidth = currentStringWidth(text);
  } catch {
    calculatedWidth = 1;
    console.warn(`Failed to calculate string width for ${JSON.stringify(text)}`);
  }

  widthCache.set(text, calculatedWidth);
  return calculatedWidth;
}

export function wordBreakStyledChars(line: StyledLine): StyledLine[] {
  const words: StyledLine[] = [];
  let start = 0;

  for (let i = 0; i < line.length; i++) {
    const val = line.getValue(i);

    if (val === "\n" || val === " ") {
      if (i > start) {
        words.push(line.slice(start, i));
      }

      words.push(line.slice(i, i + 1));
      start = i + 1;
    }
  }

  if (start < line.length) {
    words.push(line.slice(start));
  }

  return words;
}

export function splitStyledCharsByNewline(line: StyledLine): StyledLine[] {
  const lines: StyledLine[] = [];
  let start = 0;

  for (let i = 0; i < line.length; i++) {
    if (line.getValue(i) === "\n") {
      lines.push(line.slice(start, i));
      start = i + 1;
    }
  }

  lines.push(line.slice(start));
  return lines;
}

export function widestLineFromStyledChars(lines: StyledLine[]): number {
  let maxWidth = 0;
  for (const line of lines) {
    maxWidth = Math.max(maxWidth, styledCharsWidth(line));
  }

  return maxWidth;
}

export function styledCharsToString(line: StyledLine): string {
  return line.getText();
}

export function measureStyledChars(line: StyledLine): {
  width: number;
  height: number;
} {
  if (line.length === 0) {
    return { width: 0, height: 0 };
  }

  const lines = splitStyledCharsByNewline(line);
  const width = widestLineFromStyledChars(lines);
  const height = lines.length;
  return { width, height };
}

/**
 * Calculate row and column position at a given character offset.
 * This is the unified cursor position calculation logic used by both
 * render-node-to-output.ts and output.ts.
 *
 * The character offset counting method matches CharOffsetMap used in
 * selection.ts and squash-text-nodes.ts, ensuring consistent behavior
 * between cursor positioning and text selection.
 *
 * Character counting rules:
 * - Each StyledChar counts by its value.length (handles combining marks)
 * - Newlines ('\n') advance row and reset column
 * - Other characters add their visual width to column
 */
export function getPositionAtOffset(line: StyledLine, targetOffset: number): { row: number; col: number } {
  let row = 0;
  let col = 0;
  let charCount = 0;

  for (let i = 0; i < line.length; i++) {
    if (charCount >= targetOffset) {
      break;
    }

    const val = line.getValue(i);
    if (val === "\n") {
      row++;
      col = 0;
    } else {
      col += inkCharacterWidth(val);
    }

    charCount += val.length;
  }

  return { row, col };
}
