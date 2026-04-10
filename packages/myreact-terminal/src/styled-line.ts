/* eslint-disable max-lines */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_WIDTH_MASK, INVERSE_MASK } from "./tokenize.js";

export type StyleSpan = {
  length: number;
  formatFlags: number;
  fgColor?: string;
  bgColor?: string;
  link?: string;
};

const OFFSET_MASK = 0x3f_ff_ff_ff;
const FULL_WIDTH_FLAG = 0x40_00_00_00;

function hasAnyStyles(formatFlags: number, fgColor?: string, bgColor?: string, link?: string): boolean {
  return (formatFlags & ~FULL_WIDTH_MASK) !== 0 || fgColor !== undefined || bgColor !== undefined || link !== undefined;
}

function spanHasStyles(span: StyleSpan): boolean {
  return hasAnyStyles(span.formatFlags, span.fgColor, span.bgColor, span.link);
}

function spansHaveStyles(spans: StyleSpan[] | undefined): boolean {
  if (!spans) return false;
  for (const s of spans) {
    if (spanHasStyles(s)) return true;
  }

  return false;
}

function isDefaultCharData(charData: number[] | undefined, length: number): boolean {
  if (!charData) return true;
  for (let i = 0; i < length; i++) {
    if (charData[i] !== i) return false;
  }

  return true;
}

export class StyledLine {
  static empty(length: number): StyledLine {
    if (length <= 0) {
      return new StyledLine();
    }

    const cached = StyledLine.emptyCache.get(length);
    if (cached) {
      return cached.clone();
    }

    const line = new StyledLine();
    line.length = length;
    line.text = " ".repeat(length);
    line._cachedTrimmedLength = 0;

    if (StyledLine.emptyCache.size > 100) {
      StyledLine.emptyCache.clear();
    }

    Object.freeze(line);

    StyledLine.emptyCache.set(length, line);

    return line.clone();
  }

  static legacyCreateStyledLine(values: string[] = [], spans: StyleSpan[] = []): StyledLine {
    const line = new StyledLine();
    line.applyValuesAndSpans(values, spans);

    return line;
  }

  private static readonly emptyCache = new Map<number, StyledLine>();

  public length: number;
  private text: string | undefined;
  private charData: number[] | undefined;
  private spans: StyleSpan[] | undefined;
  private _cachedTrimmedLength?: number;

  constructor() {
    this.length = 0;
  }

  getValue(index: number): string {
    if (this.text === undefined || index < 0 || index >= this.length) return "";
    if (this.charData === undefined) {
      return this.text[index]!;
    }

    const start = this.charData[index]! & OFFSET_MASK;
    const end = index + 1 < this.length ? this.charData[index + 1]! & OFFSET_MASK : this.text.length;
    return this.text.slice(start, end);
  }

  getSpan(index: number): StyleSpan | undefined {
    if (this.spans === undefined || index < 0 || index >= this.length) return undefined;
    let current = 0;
    for (const span of this.spans) {
      if (index < current + span.length) return span;
      current += span.length;
    }

    return undefined;
  }

  getFullWidth(index: number): boolean {
    if (this.charData === undefined || index < 0 || index >= this.length) return false;
    return (this.charData[index]! & FULL_WIDTH_FLAG) !== 0;
  }

  hasStyles(index: number): boolean {
    if (this.spans === undefined) return false;
    const span = this.getSpan(index);
    if (!span) return false;
    return spanHasStyles(span);
  }

  getFormatFlags(index: number): number {
    let flags = this.getSpan(index)?.formatFlags ?? 0;
    if (this.getFullWidth(index)) {
      flags |= FULL_WIDTH_MASK;
    }

    return flags;
  }

  getFgColor(index: number): string | undefined {
    return this.getSpan(index)?.fgColor;
  }

  getBgColor(index: number): string | undefined {
    return this.getSpan(index)?.bgColor;
  }

  getLink(index: number): string | undefined {
    return this.getSpan(index)?.link;
  }

  setInverted(index: number, inverted: boolean) {
    if (index < 0 || index >= this.length) return;
    this._cachedTrimmedLength = undefined;
    this.ensureInitialized();
    this.ensureSpans();
    this.splitSpansAt(index);
    this.splitSpansAt(index + 1);

    let current = 0;
    for (const span of this.spans!) {
      if (current === index && span.length === 1) {
        if (inverted) {
          span.formatFlags |= INVERSE_MASK;
        } else {
          span.formatFlags &= ~INVERSE_MASK;
        }

        break;
      }

      current += span.length;
    }

    this.mergeSpans();
  }

  setBackgroundColor(index: number, color: string | undefined) {
    if (index < 0 || index >= this.length) return;
    this._cachedTrimmedLength = undefined;
    this.ensureInitialized();
    this.ensureSpans();
    this.splitSpansAt(index);
    this.splitSpansAt(index + 1);

    let current = 0;
    for (const span of this.spans!) {
      if (current === index && span.length === 1) {
        span.bgColor = color;
        break;
      }

      current += span.length;
    }

    this.mergeSpans();
  }

  setForegroundColor(index: number, color: string | undefined) {
    if (index < 0 || index >= this.length) return;
    this._cachedTrimmedLength = undefined;
    this.ensureInitialized();
    this.ensureSpans();
    this.splitSpansAt(index);
    this.splitSpansAt(index + 1);

    let current = 0;
    for (const span of this.spans!) {
      if (current === index && span.length === 1) {
        span.fgColor = color;
        break;
      }

      current += span.length;
    }

    this.mergeSpans();
  }

  setChar(index: number, value: string, formatFlags: number, fgColor?: string, bgColor?: string, link?: string) {
    if (index < 0 || index >= this.length) return;
    this._cachedTrimmedLength = undefined;
    this.ensureInitialized();

    const isFullWidth = (formatFlags & FULL_WIDTH_MASK) !== 0;
    const cleanFormatFlags = formatFlags & ~FULL_WIDTH_MASK;
    const hasStyles = hasAnyStyles(formatFlags, fgColor, bgColor, link);

    const newLen = value.length;

    if (this.charData === undefined) {
      if (newLen === 1 && !isFullWidth) {
        this.text = this.text!.slice(0, index) + value + this.text!.slice(index + 1);
      } else {
        this.ensureCharData();
      }
    }

    if (this.charData !== undefined) {
      const start = this.charData[index]! & OFFSET_MASK;
      const end = index + 1 < this.length ? this.charData[index + 1]! & OFFSET_MASK : this.text!.length;
      const oldLen = end - start;

      if (oldLen === newLen) {
        this.text = this.text!.slice(0, start) + value + this.text!.slice(end);
      } else {
        this.text = this.text!.slice(0, start) + value + this.text!.slice(end);
        const diff = newLen - oldLen;
        for (let i = index + 1; i < this.length; i++) {
          const data = this.charData[i]!;
          const oldOffset = data & OFFSET_MASK;
          const fw = data & FULL_WIDTH_FLAG;
          this.charData[i] = (oldOffset + diff) | fw;
        }
      }

      this.charData[index] = start | (isFullWidth ? FULL_WIDTH_FLAG : 0);
    }

    if (this.spans === undefined) {
      if (!hasStyles) {
        return;
      }

      this.ensureSpans();
    }

    this.splitSpansAt(index);
    this.splitSpansAt(index + 1);

    let current = 0;
    for (let i = 0; i < this.spans!.length; i++) {
      const span = this.spans![i]!;
      if (current === index && span.length === 1) {
        this.spans![i] = {
          length: 1,
          formatFlags: cleanFormatFlags,
          fgColor,
          bgColor,
          link,
        };
        break;
      }

      current += span.length;
    }

    this.mergeSpans();
  }

  pushChar(value: string, formatFlags: number, fgColor?: string, bgColor?: string, link?: string) {
    this._cachedTrimmedLength = undefined;
    this.ensureInitialized();
    const isFullWidth = (formatFlags & FULL_WIDTH_MASK) !== 0;
    const cleanFormatFlags = formatFlags & ~FULL_WIDTH_MASK;
    const hasStyles = hasAnyStyles(formatFlags, fgColor, bgColor, link);

    const newLen = value.length;

    if (this.charData === undefined) {
      if (newLen === 1 && !isFullWidth) {
        this.text += value;
      } else {
        this.ensureCharData();
      }
    }

    if (this.charData !== undefined) {
      const offset = this.text!.length;
      this.text += value;
      this.charData.push(offset | (isFullWidth ? FULL_WIDTH_FLAG : 0));
    }

    if (this.spans === undefined) {
      if (!hasStyles) {
        this.length++;
        return;
      }

      this.ensureSpans();
    }

    const lastSpan = this.spans!.at(-1);

    if (lastSpan && lastSpan.formatFlags === cleanFormatFlags && lastSpan.fgColor === fgColor && lastSpan.bgColor === bgColor && lastSpan.link === link) {
      lastSpan.length++;
    } else {
      this.spans!.push({
        length: 1,
        formatFlags: cleanFormatFlags,
        fgColor,
        bgColor,
        link,
      });
    }

    this.length++;
  }

  clone(): StyledLine {
    const result = new StyledLine();
    result.length = this.length;
    result.text = this.text;
    result.charData = this.charData ? [...this.charData] : undefined;
    result.spans = this.spans ? this.spans.map((span) => ({ ...span })) : undefined;
    result._cachedTrimmedLength = this._cachedTrimmedLength;
    return result;
  }

  slice(start: number, end?: number): StyledLine {
    const actualStart = Math.max(0, start);
    const actualEnd = end === undefined ? this.length : Math.min(this.length, end);
    if (actualStart >= actualEnd) return new StyledLine();

    if (actualStart === 0 && actualEnd === this.length) {
      return this.clone();
    }

    const result = new StyledLine();
    result.length = actualEnd - actualStart;

    if (this.charData === undefined) {
      if (this.text !== undefined) {
        result.text = this.text.slice(actualStart, actualEnd);
      }
    } else {
      result.charData = Array.from({ length: result.length });

      const textStart = this.charData[actualStart]! & OFFSET_MASK;
      const textEnd = actualEnd < this.length ? this.charData[actualEnd]! & OFFSET_MASK : this.text!.length;
      result.text = this.text!.slice(textStart, textEnd);

      for (let i = 0; i < result.length; i++) {
        const oldData = this.charData[actualStart + i]!;
        const oldOffset = oldData & OFFSET_MASK;
        const fw = oldData & FULL_WIDTH_FLAG;
        result.charData[i] = (oldOffset - textStart) | fw;
      }
    }

    if (this.spans !== undefined) {
      const newSpans: StyleSpan[] = [];
      let current = 0;
      for (const span of this.spans) {
        const spanStart = current;
        const spanEnd = current + span.length;

        const intersectStart = Math.max(actualStart, spanStart);
        const intersectEnd = Math.min(actualEnd, spanEnd);

        if (intersectStart < intersectEnd) {
          newSpans.push({
            ...span,
            length: intersectEnd - intersectStart,
          });
        }

        current += span.length;
        if (current >= actualEnd) break;
      }

      result.spans = newSpans;
      result.mergeSpans();
    }

    return result;
  }

  combine(...others: StyledLine[]): StyledLine {
    if (others.length === 0) return this.clone();

    const allLines = [this as StyledLine, ...others].filter((l) => l.length > 0);
    if (allLines.length === 0) return new StyledLine();
    if (allLines.length === 1) return allLines[0]!.clone();

    let totalChars = 0;
    for (const line of allLines) {
      totalChars += line.length;
    }

    const result = new StyledLine();
    result.length = totalChars;
    result.text = allLines.map((l) => l.getText()).join("");

    const anyHasCharData = allLines.some((l) => (l as any).charData !== undefined);

    if (anyHasCharData) {
      result.charData = Array.from({ length: totalChars });
      let currentChar = 0;
      let currentOffset = 0;
      for (const line of allLines) {
        const lineCharData = (line as any).charData as number[] | undefined;
        const lineText = line.getText();
        if (lineCharData) {
          for (let i = 0; i < line.length; i++) {
            const data = lineCharData[i]!;
            const offset = data & OFFSET_MASK;
            const fw = data & FULL_WIDTH_FLAG;
            result.charData[currentChar + i] = (currentOffset + offset) | fw;
          }
        } else {
          for (let i = 0; i < line.length; i++) {
            result.charData[currentChar + i] = currentOffset + i;
          }
        }

        currentChar += line.length;
        currentOffset += lineText.length;
      }
    }

    const anyHasSpans = allLines.some((l) => (l as any).spans !== undefined);

    if (anyHasSpans) {
      result.spans = allLines.flatMap((l) => l.getSpans().map((s) => ({ ...s })));
      result.mergeSpans();
    }

    return result;
  }

  getTrimmedLength(): number {
    if (this.length === 0) return 0;
    if (this.text === undefined) return 0;

    let currentIdx = this.length - 1;

    if (this.spans) {
      for (let s = this.spans.length - 1; s >= 0; s--) {
        const span = this.spans[s]!;
        const hasStyles = spanHasStyles(span);

        if (hasStyles) {
          return currentIdx + 1;
        }

        for (let i = 0; i < span.length; i++) {
          if (this.charData) {
            const start = this.charData[currentIdx]! & OFFSET_MASK;
            const end = currentIdx + 1 < this.length ? this.charData[currentIdx + 1]! & OFFSET_MASK : this.text.length;

            if (end - start !== 1 || this.text[start] !== " ") {
              return currentIdx + 1;
            }
          } else if (this.text[currentIdx] !== " ") {
            return currentIdx + 1;
          }

          currentIdx--;
        }
      }
    } else {
      while (currentIdx >= 0) {
        if (this.charData) {
          const start = this.charData[currentIdx]! & OFFSET_MASK;
          const end = currentIdx + 1 < this.length ? this.charData[currentIdx + 1]! & OFFSET_MASK : this.text.length;

          if (end - start !== 1 || this.text[start] !== " ") {
            return currentIdx + 1;
          }
        } else if (this.text[currentIdx] !== " ") {
          return currentIdx + 1;
        }

        currentIdx--;
      }
    }

    return 0;
  }

  trimEnd(): StyledLine {
    const trimmedLength = this.getTrimmedLength();
    if (trimmedLength === this.length) return this;
    if (trimmedLength === 0) return new StyledLine();
    return this.slice(0, trimmedLength);
  }

  equals(other: StyledLine): boolean {
    if (this.length !== other.length) return false;
    if (this.length === 0) return true;
    if (this.getText() !== other.getText()) return false;

    const thisSpans = this.internalGetSpans();
    const otherSpans = other.internalGetSpans();

    if (thisSpans === undefined && otherSpans !== undefined) {
      if (spansHaveStyles(otherSpans)) return false;
    } else if (thisSpans !== undefined && otherSpans === undefined) {
      if (spansHaveStyles(thisSpans)) return false;
    } else if (thisSpans !== undefined && otherSpans !== undefined) {
      if (thisSpans.length !== otherSpans.length) return false;
      for (let i = 0; i < thisSpans.length; i++) {
        const sp1 = thisSpans[i]!;
        const sp2 = otherSpans[i]!;
        if (
          sp1.length !== sp2.length ||
          sp1.formatFlags !== sp2.formatFlags ||
          sp1.fgColor !== sp2.fgColor ||
          sp1.bgColor !== sp2.bgColor ||
          sp1.link !== sp2.link
        ) {
          return false;
        }
      }
    }

    const thisCharData = this.internalGetCharData();
    const otherCharData = other.internalGetCharData();

    if (thisCharData === undefined && otherCharData !== undefined) {
      if (!isDefaultCharData(otherCharData, this.length)) return false;
    } else if (thisCharData !== undefined && otherCharData === undefined) {
      if (!isDefaultCharData(thisCharData, this.length)) return false;
    } else if (thisCharData !== undefined && otherCharData !== undefined) {
      for (let i = 0; i < this.length; i++) {
        if (thisCharData[i] !== otherCharData[i]) return false;
      }
    }

    return true;
  }

  getText(): string {
    return this.text ?? "";
  }

  getSpans(): StyleSpan[] {
    if (this.spans !== undefined) return this.spans;
    if (this.length > 0) return [{ length: this.length, formatFlags: 0 }];
    return [];
  }

  getValues(): string[] {
    return Array.from({ length: this.length }, (_, i) => this.getValue(i));
  }

  *[Symbol.iterator]() {
    if (this.length === 0) return;
    let currentSpanIdx = 0;
    let currentSpanPos = 0;
    const spans = this.getSpans();

    for (let i = 0; i < this.length; i++) {
      const span = spans[currentSpanIdx];
      const formatFlags = span ? span.formatFlags : 0;
      const isFullWidth = this.getFullWidth(i);

      yield {
        value: this.getValue(i),
        formatFlags: formatFlags | (isFullWidth ? FULL_WIDTH_MASK : 0),
        fgColor: span?.fgColor,
        bgColor: span?.bgColor,
        link: span?.link,
        fullWidth: isFullWidth,
        hasStyles: (formatFlags & ~FULL_WIDTH_MASK) !== 0 || span?.fgColor !== undefined || span?.bgColor !== undefined || span?.link !== undefined,
      };

      if (span) {
        currentSpanPos++;
        if (currentSpanPos >= span.length) {
          currentSpanIdx++;
          currentSpanPos = 0;
        }
      }
    }
  }

  internalGetCharData(): number[] | undefined {
    return this.charData;
  }

  internalGetSpans(): StyleSpan[] | undefined {
    return this.spans;
  }

  private ensureInitialized() {
    if (this.text === undefined) {
      this.text = this.length > 0 ? " ".repeat(this.length) : "";
    }
  }

  private ensureCharData() {
    this.ensureInitialized();
    if (this.charData === undefined) {
      this.charData = Array.from({ length: this.length });
      for (let i = 0; i < this.length; i++) {
        this.charData[i] = i;
      }
    }
  }

  private ensureSpans() {
    if (this.spans === undefined) {
      this.spans = this.length > 0 ? [{ length: this.length, formatFlags: 0 }] : [];
    }
  }

  private applyValuesAndSpans(values: string[], spans: StyleSpan[]) {
    this._cachedTrimmedLength = undefined;
    const visibleChars = values.length;

    this.length = visibleChars;
    this.text = values.join("");

    let needsCharData = false;
    for (let i = 0; i < visibleChars; i++) {
      if (values[i]!.length !== 1) {
        needsCharData = true;
        break;
      }
    }

    if (!needsCharData && spans.length > 0) {
      for (const span of spans) {
        if ((span.formatFlags & FULL_WIDTH_MASK) !== 0) {
          needsCharData = true;
          break;
        }
      }
    }

    if (needsCharData) {
      this.charData = Array.from({ length: this.length });

      let currentOffset = 0;
      let spanIdx = 0;
      let spanPos = 0;

      for (let i = 0; i < visibleChars; i++) {
        const val = values[i]!;
        let isFullWidth = false;

        if (spans.length > 0 && spanIdx < spans.length) {
          const span = spans[spanIdx]!;
          if ((span.formatFlags & FULL_WIDTH_MASK) !== 0) {
            isFullWidth = true;
          }

          spanPos++;
          if (spanPos >= span.length) {
            spanIdx++;
            spanPos = 0;
          }
        }

        this.charData[i] = currentOffset | (isFullWidth ? FULL_WIDTH_FLAG : 0);
        currentOffset += val.length;
      }
    }

    const hasStyles = spansHaveStyles(spans);

    if (hasStyles) {
      this.spans = spans.map((s) => ({
        ...s,
        formatFlags: s.formatFlags & ~FULL_WIDTH_MASK,
      }));
      this.mergeSpans();
    } else {
      this.spans = undefined;
    }
  }

  private splitSpansAt(index: number) {
    if (this.spans === undefined || index <= 0 || index >= this.length) return;
    let current = 0;
    for (let i = 0; i < this.spans.length; i++) {
      const span = this.spans[i]!;
      if (index > current && index < current + span.length) {
        const leftLen = index - current;
        const rightLen = span.length - leftLen;
        this.spans.splice(i, 1, { ...span, length: leftLen }, { ...span, length: rightLen });
        return;
      }

      current += span.length;
    }
  }

  private mergeSpans() {
    if (this.spans === undefined) return;
    const newSpans: StyleSpan[] = [];
    for (const span of this.spans) {
      if (span.length === 0) continue;
      const last = newSpans.at(-1);
      if (last && last.formatFlags === span.formatFlags && last.fgColor === span.fgColor && last.bgColor === span.bgColor && last.link === span.link) {
        last.length += span.length;
      } else {
        newSpans.push({ ...span });
      }
    }

    this.spans = newSpans;
  }
}
