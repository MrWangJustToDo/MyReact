/* eslint-disable max-lines */
import { type StickyHeader, type DOMElement } from "./dom.js";
import { type CursorPosition } from "./log-update.js";
import { calculateScrollbarLayout } from "./measure-element.js";
import { toStyledCharacters, inkCharacterWidth, styledCharsWidth } from "./measure-text.js";
import { type OutputTransformer } from "./render-node-to-output.js";
import { renderScrollbar } from "./render-scrollbar.js";
import { StyledLine } from "./styled-line.js";
import { styledLineToString } from "./tokenize.js";
/**
"Virtual" output class

Handles the positioning and saving of the output of each node in the tree. Also responsible for applying transformations to each character of the output.

Used to generate the final output of all nodes before writing it to actual output stream (e.g. stdout)
*/

export function clampCursorColumn(line: StyledLine, col: number): number {
  let currentLineCol = 0;
  let lastContentCol = 0;

  for (let i = 0; i < line.length; i++) {
    const val = line.getValue(i);
    const charWidth = inkCharacterWidth(val);

    if (val !== " " || line.hasStyles(i)) {
      lastContentCol = currentLineCol + charWidth;
    }

    currentLineCol += charWidth;
  }

  return col > lastContentCol ? lastContentCol : col;
}

type Options = {
  width: number;
  height: number;
  node?: DOMElement;
  id?: string | number;
  trackSelection?: boolean;
};

type Clip = {
  x1: number | undefined;
  x2: number | undefined;
  y1: number | undefined;
  y2: number | undefined;
};

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function intersectRect(a: Rect, b: Rect): Rect | undefined {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);

  if (x2 <= x1 || y2 <= y1) {
    return undefined;
  }

  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

export function isRectIntersectingClip(
  rect: { x1: number; y1: number; x2: number; y2: number },
  clip: { x1?: number; y1?: number; x2?: number; y2?: number }
): boolean {
  const clipLeft = clip.x1 ?? -Infinity;
  const clipRight = clip.x2 ?? Infinity;
  const clipTop = clip.y1 ?? -Infinity;
  const clipBottom = clip.y2 ?? Infinity;

  return rect.x2 > clipLeft && rect.x1 < clipRight && rect.y2 > clipTop && rect.y1 < clipBottom;
}

/**
 * Represents a rendered rectangular area in the terminal.
 * You can think of it a bit like a `<div>` element rendered in a web browser.
 * Regions can be nested to support complex layouts, including scrollable areas,
 * clipped views, and floating elements (like sticky headers).
 * Each region contains its own localized buffer of rendered lines and maintains
 * its own coordinates, dimensions, scroll state, borders, background colors, and children.
 */
export type Region = {
  id: number | string;
  x: number; // Position relative to parent region's content start
  y: number; // Position relative to parent region's content start
  width: number;
  height: number;

  // Content buffer for this region.
  // Coordinates in `lines` are relative to (0,0) of this region.
  readonly lines: readonly StyledLine[];
  readonly styledOutput: readonly StyledLine[];

  isScrollable: boolean;
  isVerticallyScrollable?: boolean;
  isHorizontallyScrollable?: boolean;

  // Scroll state (if scrollable)
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;

  scrollbarVisible?: boolean;
  overflowToBackbuffer?: boolean;
  marginRight?: number;
  marginBottom?: number;
  scrollbarThumbColor?: string;
  backgroundColor?: string;
  opaque?: boolean;
  borderTop?: number;
  borderBottom?: number;

  stickyHeaders: StickyHeader[];
  cachedStickyHeaders?: StickyHeader[];
  children: Region[];
  cursorPosition?: CursorPosition;
  stableScrollback?: boolean;
  nodeId?: number;
  node?: DOMElement;
  selectableText?: string;
  selectableSpans: Array<{
    y: number;
    startX: number;
    endX: number;
    text: string;
  }>;
};

export type RegionNode = {
  id: string | number;
  children: RegionNode[];
};

export function treesEqual(a: RegionNode, b: RegionNode): boolean {
  if (a === b) return true;
  if (a.id !== b.id) return false;
  if (a.children.length !== b.children.length) return false;

  for (let i = 0; i < a.children.length; i++) {
    if (!treesEqual(a.children[i]!, b.children[i]!)) return false;
  }

  return true;
}

export type SerializedStickyHeader = Omit<StickyHeader, "lines" | "stuckLines" | "styledOutput" | "node"> & {
  lines: Uint8Array;
  stuckLines?: Uint8Array;
  styledOutput: Uint8Array;
};

export type RegionUpdate = {
  id: string | number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  isScrollable?: boolean;
  isVerticallyScrollable?: boolean;
  isHorizontallyScrollable?: boolean;
  scrollbarVisible?: boolean;
  overflowToBackbuffer?: boolean;
  marginRight?: number;
  marginBottom?: number;
  scrollbarThumbColor?: string;
  backgroundColor?: string;
  opaque?: boolean;
  borderTop?: number;
  borderBottom?: number;
  stickyHeaders?: SerializedStickyHeader[];
  lines?: {
    updates: Array<{
      start: number;
      end: number;
      data: Uint8Array;
      source?: Uint8Array;
    }>;
    totalLength: number;
  };
};

export const regionLayoutProperties = [
  "x",
  "y",
  "width",
  "height",
  "scrollTop",
  "scrollLeft",
  "scrollHeight",
  "scrollWidth",
  "isScrollable",
  "isVerticallyScrollable",
  "isHorizontallyScrollable",
  "scrollbarVisible",
  "overflowToBackbuffer",
  "marginRight",
  "marginBottom",
  "scrollbarThumbColor",
  "backgroundColor",
  "opaque",
  "borderTop",
  "borderBottom",
] as const;

export type RegionLayoutProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  isScrollable?: boolean;
  isVerticallyScrollable?: boolean;
  isHorizontallyScrollable?: boolean;
  scrollbarVisible?: boolean;
  overflowToBackbuffer?: boolean;
  marginRight?: number;
  marginBottom?: number;
  scrollbarThumbColor?: string;
  backgroundColor?: string;
  opaque?: boolean;
  borderTop?: number;
  borderBottom?: number;
};

export function copyRegionProperty<K extends (typeof regionLayoutProperties)[number]>(target: RegionLayoutProps, source: RegionLayoutProps, key: K) {
  const value = source[key];
  if (value !== undefined) {
    target[key] = value;
  }
}

export default class Output {
  width: number;
  height: number;
  trackSelection: boolean;

  // The root region represents the main screen area (non-scrollable background)
  root: Region;

  private readonly activeRegionStack: Region[] = [];
  private readonly clips: Clip[] = [];

  constructor(options: Options) {
    const { width, height, node, id = "root", trackSelection = false } = options;

    this.width = width;
    this.height = height;
    this.trackSelection = trackSelection;

    this.root = {
      id,
      x: 0,
      y: 0,
      width,
      height,
      lines: [],
      styledOutput: [],
      isScrollable: false,
      stickyHeaders: [],
      children: [],
      node,
      selectableSpans: [],
    };

    this.initLines(this.root, width, height);
    this.activeRegionStack.push(this.root);
  }

  getCurrentClip(): Clip | undefined {
    return this.clips.at(-1);
  }

  getActiveRegion(): Region {
    return this.activeRegionStack.at(-1)!;
  }

  getRegionAbsoluteOffset(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    for (const region of this.activeRegionStack) {
      x += region.x - (region.scrollLeft ?? 0);
      y += region.y - (region.scrollTop ?? 0);
    }

    return { x, y };
  }

  startChildRegion(options: {
    id: number | string;
    x: number;
    y: number;
    width: number;
    height: number;
    isScrollable: boolean;
    isVerticallyScrollable?: boolean;
    isHorizontallyScrollable?: boolean;
    scrollState?: {
      scrollTop: number;
      scrollLeft: number;
      scrollHeight: number;
      scrollWidth: number;
    };
    scrollbarVisible?: boolean;
    overflowToBackbuffer?: boolean;
    marginRight?: number;
    marginBottom?: number;
    scrollbarThumbColor?: string;
    backgroundColor?: string;
    opaque?: boolean;
    nodeId?: number;
    stableScrollback?: boolean;
    borderTop?: number;
    borderBottom?: number;
  }) {
    const {
      id,
      x,
      y,
      width,
      height,
      isScrollable,
      isVerticallyScrollable,
      isHorizontallyScrollable,
      scrollState,
      scrollbarVisible,
      overflowToBackbuffer,
      marginRight,
      marginBottom,
      scrollbarThumbColor,
      backgroundColor,
      opaque,
      nodeId,
      stableScrollback,
      borderTop,
      borderBottom,
    } = options;

    // Create new region
    // The buffer size should match scrollDimensions if scrollable, or bounds if not.
    // If scrollable, we want to capture the FULL content.
    const bufferWidth = scrollState?.scrollWidth ?? width;
    const bufferHeight = scrollState?.scrollHeight ?? height;

    const activeRegion = this.getActiveRegion();
    const inheritedOverflowToBackbuffer = isScrollable ? overflowToBackbuffer : (overflowToBackbuffer ?? activeRegion.overflowToBackbuffer);

    const region: Region = {
      id,
      x,
      y,
      width,
      height,
      lines: [],
      styledOutput: [],
      isScrollable,
      isVerticallyScrollable,
      isHorizontallyScrollable,
      scrollTop: scrollState?.scrollTop,
      scrollLeft: scrollState?.scrollLeft,
      scrollHeight: scrollState?.scrollHeight,
      scrollWidth: scrollState?.scrollWidth,
      scrollbarVisible,
      overflowToBackbuffer: inheritedOverflowToBackbuffer,
      marginRight,
      marginBottom,
      scrollbarThumbColor,
      backgroundColor,
      opaque,
      borderTop,
      borderBottom,
      stickyHeaders: [],
      children: [],
      nodeId,
      stableScrollback,
      selectableSpans: [],
    };

    this.initLines(region, bufferWidth, bufferHeight);

    // Add to current active region's children
    this.getActiveRegion().children.push(region);

    // Push to stack
    this.activeRegionStack.push(region);
  }

  endChildRegion() {
    if (this.activeRegionStack.length > 1) {
      this.activeRegionStack.pop();
    }
  }

  addStickyHeader(header: StickyHeader) {
    this.getActiveRegion().stickyHeaders.push(header);
  }

  write(
    x: number,
    y: number,
    items: string | StyledLine,
    options: {
      transformers: OutputTransformer[];
      lineIndex?: number;
      preserveBackgroundColor?: boolean;
      isTerminalCursorFocused?: boolean;
      terminalCursorPosition?: number;
      isSelectable?: boolean;
    }
  ): void {
    const {
      transformers = [],
      lineIndex = 0,
      preserveBackgroundColor = false,
      isTerminalCursorFocused = false,
      terminalCursorPosition,
      isSelectable = false,
    } = options;

    if (items.length === 0 && !isTerminalCursorFocused) {
      return;
    }

    if (isTerminalCursorFocused) {
      const region = this.getActiveRegion();
      let col = 0;
      let row = 0;
      const chars = typeof items === "string" ? toStyledCharacters(items) : items;
      let charOffset = 0;
      const targetOffset = terminalCursorPosition ?? Number.POSITIVE_INFINITY;

      for (let i = 0; i < chars.length; i++) {
        if (charOffset >= targetOffset) {
          break;
        }

        const val = chars.getValue(i);
        if (val === "\n") {
          row++;
          col = 0;
        } else {
          col += inkCharacterWidth(val);
        }

        charOffset += val.length;
      }

      region.cursorPosition = {
        row: y + row,
        col: x + col,
      };
    }

    if (items.length > 0) {
      this.applyWrite(x, y, items, transformers, lineIndex, preserveBackgroundColor, isSelectable);
    }
  }

  clip(clip: Clip) {
    const previousClip = this.clips.at(-1);
    const nextClip = { ...clip };

    if (previousClip) {
      nextClip.x1 = previousClip.x1 === undefined ? nextClip.x1 : nextClip.x1 === undefined ? previousClip.x1 : Math.max(previousClip.x1, nextClip.x1);

      nextClip.x2 = previousClip.x2 === undefined ? nextClip.x2 : nextClip.x2 === undefined ? previousClip.x2 : Math.min(previousClip.x2, nextClip.x2);

      nextClip.y1 = previousClip.y1 === undefined ? nextClip.y1 : nextClip.y1 === undefined ? previousClip.y1 : Math.max(previousClip.y1, nextClip.y1);

      nextClip.y2 = previousClip.y2 === undefined ? nextClip.y2 : nextClip.y2 === undefined ? previousClip.y2 : Math.min(previousClip.y2, nextClip.y2);
    }

    this.clips.push(nextClip);
  }

  unclip() {
    this.clips.pop();
  }

  get(): Region {
    this.clampCursorPosition(this.root);
    this.trimRegionLines(this.root);
    return this.root;
  }

  addRegionTree(region: Region, x: number, y: number) {
    const activeRegion = this.getActiveRegion();
    const overflowToBackbuffer = region.isScrollable ? region.overflowToBackbuffer : (region.overflowToBackbuffer ?? activeRegion.overflowToBackbuffer);

    const regionRef = Object.create(region) as Region;
    regionRef.x = region.x + x;
    regionRef.y = region.y + y;
    regionRef.overflowToBackbuffer = overflowToBackbuffer;

    activeRegion.children.push(regionRef);
  }

  private trimRegionLines(region: Region) {
    for (let y = 0; y < region.lines.length; y++) {
      const line = region.lines[y]!;
      const trimmedLength = line.getTrimmedLength();

      if (region.styledOutput[y]?.length !== trimmedLength) {
        (region.styledOutput as StyledLine[])[y] = trimmedLength === line.length ? line : line.slice(0, trimmedLength);
      }
    }

    for (const child of region.children) {
      this.trimRegionLines(child);
    }
  }

  private clampCursorPosition(region: Region) {
    if (region.cursorPosition) {
      const { row, col } = region.cursorPosition;
      const line = region.lines[row];

      if (line) {
        region.cursorPosition.col = clampCursorColumn(line, col);
      }
    }

    for (const child of region.children) {
      this.clampCursorPosition(child);
    }
  }

  private initLines(region: Region, width: number, height: number) {
    if (height <= 0) return;
    const baseRow = StyledLine.empty(width);
    for (let y = 0; y < height; y++) {
      const row = y === 0 ? baseRow : baseRow.clone();
      (region.lines as StyledLine[]).push(row);
      (region.styledOutput as StyledLine[]).push(row);
    }
  }

  private applyWrite(
    x: number,
    y: number,
    items: string | StyledLine,
    transformers: OutputTransformer[],
    lineIndex: number,
    _preserveBackgroundColor: boolean,
    isSelectable: boolean
  ) {
    const region = this.getActiveRegion();
    const { lines } = region;
    const bufferWidth = lines[0]?.length ?? 0;

    let chars: StyledLine = typeof items === "string" ? toStyledCharacters(items) : items;

    const clip = this.getCurrentClip();
    let fromX: number | undefined;
    let toX: number | undefined;

    if (clip) {
      const regionOffset = this.getRegionAbsoluteOffset();
      const clipResult = this.clipChars(chars, x + regionOffset.x, y + regionOffset.y, clip);

      if (!clipResult) {
        return;
      }

      let absoluteX: number;
      let absoluteY: number;

      ({ chars, x: absoluteX, y: absoluteY, fromX, toX } = clipResult);
      x = absoluteX - regionOffset.x;
      y = absoluteY - regionOffset.y;
    }

    const currentLine = lines[y]!;
    if (!currentLine) {
      return;
    }

    if (transformers.length > 0) {
      let line = styledLineToString(chars);
      for (const transformer of transformers) {
        line = transformer(line, lineIndex);
      }

      chars = toStyledCharacters(line);
    }

    let offsetX = x;
    let relativeX = 0;
    let spanStartX = -1;
    let spanText = "";

    for (let i = 0; i < chars.length; i++) {
      const val = chars.getValue(i);
      const characterWidth = inkCharacterWidth(val);

      if (toX !== undefined && relativeX >= toX) {
        break;
      }

      if (fromX === undefined || relativeX >= fromX) {
        if (offsetX >= bufferWidth) {
          break;
        }

        currentLine.setChar(offsetX, val, chars.getFormatFlags(i), chars.getFgColor(i), chars.getBgColor(i), chars.getLink(i));

        if (isSelectable) {
          if (spanStartX === -1) spanStartX = offsetX;
          spanText += val;
        }

        if (characterWidth > 1) {
          this.clearRange(currentLine, { start: offsetX + 1, end: offsetX + characterWidth }, "", bufferWidth, chars.getBgColor(i));
        }

        offsetX += characterWidth;
      } else if (characterWidth > 1 && fromX !== undefined && relativeX < fromX && relativeX + characterWidth > fromX) {
        const clearLength = relativeX + characterWidth - fromX;
        this.clearRange(currentLine, { start: offsetX, end: offsetX + clearLength }, " ", bufferWidth);

        offsetX += clearLength;
      }

      relativeX += characterWidth;
    }

    if (this.trackSelection && isSelectable && spanStartX !== -1) {
      region.selectableSpans.push({
        y,
        startX: spanStartX,
        endX: offsetX,
        text: spanText,
      });
    }

    if (toX !== undefined) {
      const absoluteToX = x - (fromX ?? 0) + toX;

      this.clearRange(currentLine, { start: offsetX, end: absoluteToX }, " ", bufferWidth);
    }
  }

  private clearRange(currentLine: StyledLine, range: { start: number; end: number }, value: string, maxWidth: number, bgColor?: string) {
    for (let offset = range.start; offset < range.end; offset++) {
      if (offset >= 0 && offset < maxWidth) {
        currentLine.setChar(offset, value, 0, undefined, bgColor);
      }
    }
  }

  private clipChars(
    chars: StyledLine,
    x: number,
    y: number,
    clip: Clip
  ):
    | {
        chars: StyledLine;
        x: number;
        y: number;
        fromX: number | undefined;
        toX: number | undefined;
      }
    | undefined {
    const { x1, x2 } = clip;
    const clipHorizontally = typeof x1 === "number" && typeof x2 === "number";

    const width = styledCharsWidth(chars);
    const effectiveY1 = this.getActiveRegion().overflowToBackbuffer ? -Infinity : (clip.y1 ?? -Infinity);

    if (!isRectIntersectingClip({ x1: x, y1: y, x2: x + width, y2: y + 1 }, { ...clip, y1: effectiveY1 })) {
      return undefined;
    }

    let fromX: number | undefined;
    let toX: number | undefined;

    if (clipHorizontally) {
      fromX = x < clip.x1! ? clip.x1! - x : 0;
      const width = styledCharsWidth(chars);
      toX = x + width > clip.x2! ? clip.x2! - x : width;

      if (x < clip.x1!) {
        x = clip.x1!;
      }
    }

    return { chars, x, y, fromX, toX };
  }
}

/**
 * Flattens a hierarchy of nested regions into a single 2D array of styled characters
 * that represents the final visual output to be written to the terminal.
 * This effectively renders the nested region tree (much like compositing layers
 * in a web browser) into a single screen buffer.
 */
export function flattenRegion(
  root: Region,
  options?: {
    context?: { cursorPosition?: { row: number; col: number } };
    skipScrollbars?: boolean;
    skipStickyHeaders?: boolean;
  }
): StyledLine[] {
  const { width, height } = root;

  const lines: StyledLine[] = [];
  for (let i = 0; i < height; i++) {
    lines.push(StyledLine.empty(width));
  }

  composeRegion(
    root,
    lines,
    {
      clip: { x: 0, y: 0, w: width, h: height },
    },
    options
  );
  return lines;
}

/**
 * Recursively traverses a Region and its children, drawing its content
 * into the given `targetLines` buffer while applying coordinate offsets
 * and clipping boundaries. Handles scroll offsets, scrollbars, and floating
 * elements like sticky headers.
 */
function composeRegion(
  region: Region,
  targetLines: StyledLine[],
  {
    clip,
    offsetX = 0,
    offsetY = 0,
  }: {
    clip: { x: number; y: number; w: number; h: number };
    offsetX?: number;
    offsetY?: number;
  },
  options?: {
    context?: { cursorPosition?: { row: number; col: number } };
    skipScrollbars?: boolean;
    skipStickyHeaders?: boolean;
  }
) {
  const {
    x,
    y,
    width,
    height,
    lines,
    children,
    stickyHeaders,
    scrollTop: regionScrollTop,
    scrollLeft: regionScrollLeft,
    cursorPosition: regionCursorPosition,
  } = region;
  const absX = x + offsetX;
  const absY = y + offsetY;

  const myClip = intersectRect(clip, { x: absX, y: absY, w: width, h: height });

  if (!myClip) {
    return;
  }

  const scrollTop = regionScrollTop ?? 0;
  const scrollLeft = regionScrollLeft ?? 0;

  if (regionCursorPosition && options?.context) {
    const cursorX = absX + regionCursorPosition.col - scrollLeft;
    const cursorY = absY + regionCursorPosition.row - scrollTop;

    if (cursorX >= myClip.x && cursorX <= myClip.x + myClip.w && cursorY >= myClip.y && cursorY <= myClip.y + myClip.h) {
      options.context.cursorPosition = { row: cursorY, col: cursorX };
    }
  }

  const { x: myClipX, y: myClipY, w: myClipW, h: myClipH } = myClip;

  for (let sy = myClipY; sy < myClipY + myClipH; sy++) {
    const row = targetLines[sy];
    if (!row) {
      continue;
    }

    const localY = sy - absY + scrollTop;
    const sourceLine = lines[localY];
    if (!sourceLine) {
      continue;
    }

    for (let sx = myClipX; sx < myClipX + myClipW; sx++) {
      const localX = sx - absX + scrollLeft;
      if (localX < sourceLine.length) {
        row.setChar(
          sx,
          sourceLine.getValue(localX),
          sourceLine.getFormatFlags(localX),
          sourceLine.getFgColor(localX),
          sourceLine.getBgColor(localX),
          sourceLine.getLink(localX)
        );
      }
    }
  }

  for (const child of children) {
    composeRegion(
      child,
      targetLines,
      {
        clip: myClip,
        offsetX: absX - scrollLeft,
        offsetY: absY - scrollTop,
      },
      options
    );
  }

  if (!options?.skipStickyHeaders) {
    for (const header of stickyHeaders) {
      const headerY = header.y + absY;
      const headerH = header.styledOutput.length;

      for (let i = 0; i < headerH; i++) {
        const sy = headerY + i;
        if (sy < myClipY || sy >= myClipY + myClipH) {
          continue;
        }

        const row = targetLines[sy];
        if (!row) {
          continue;
        }

        const line = header.styledOutput[i];
        if (!line) {
          continue;
        }

        const headerX = header.x + absX;
        const headerW = line.length;

        const hx1 = Math.max(headerX, myClipX);
        const hx2 = Math.min(headerX + headerW, myClipX + myClipW);

        for (let sx = hx1; sx < hx2; sx++) {
          const cx = sx - headerX;
          if (cx < line.length) {
            row.setChar(sx, line.getValue(cx), line.getFormatFlags(cx), line.getFgColor(cx), line.getBgColor(cx), line.getLink(cx));
          }
        }
      }
    }
  }

  if (!options?.skipScrollbars && region.isScrollable && (region.scrollbarVisible ?? true)) {
    const scrollHeight = region.scrollHeight ?? 0;
    const scrollWidth = region.scrollWidth ?? 0;
    const isVerticalScrollbarVisible = (region.isVerticallyScrollable ?? false) && scrollHeight > region.height;
    const isHorizontalScrollbarVisible = (region.isHorizontallyScrollable ?? false) && scrollWidth > region.width;

    if (isVerticalScrollbarVisible) {
      const verticalLayout = calculateScrollbarLayout({
        x: absX,
        y: absY,
        width: region.width,
        height: region.height,
        marginRight: region.marginRight ?? 0,
        marginBottom: region.marginBottom ?? 0,
        clientDimension: region.height,
        scrollDimension: scrollHeight,
        scrollPosition: scrollTop,
        hasOppositeScrollbar: false,
        axis: "vertical",
      });

      if (verticalLayout) {
        renderScrollbar({
          layout: verticalLayout,
          clip: myClip,
          axis: "vertical",
          color: region.scrollbarThumbColor,
          setChar(x, y, value, formatFlags, fgColor, bgColor, link) {
            if (y >= 0 && y < targetLines.length && x >= 0 && x < (targetLines[0]?.length ?? 0)) {
              targetLines[y]!.setChar(x, value, formatFlags, fgColor, bgColor, link);
            }
          },
        });
      }
    }

    if (isHorizontalScrollbarVisible) {
      const horizontalLayout = calculateScrollbarLayout({
        x: absX,
        y: absY,
        width: region.width,
        height: region.height,
        marginRight: region.marginRight ?? 0,
        marginBottom: region.marginBottom ?? 0,
        clientDimension: region.width,
        scrollDimension: scrollWidth,
        scrollPosition: scrollLeft,
        hasOppositeScrollbar: isVerticalScrollbarVisible,
        axis: "horizontal",
      });

      if (horizontalLayout) {
        renderScrollbar({
          layout: horizontalLayout,
          clip: myClip,
          axis: "horizontal",
          color: region.scrollbarThumbColor,
          setChar(x, y, value, formatFlags, fgColor, bgColor, link) {
            if (y >= 0 && y < targetLines.length && x >= 0 && x < (targetLines[0]?.length ?? 0)) {
              targetLines[y]!.setChar(x, value, formatFlags, fgColor, bgColor, link);
            }
          },
        });
      }
    }
  }
}

export const extractSelectableText = (spans: Array<{ y: number; startX: number; endX: number; text: string }>): string => {
  if (spans.length === 0) {
    return "";
  }

  const sortedSpans = [...spans].sort((a, b) => (a.y === b.y ? a.startX - b.startX : a.y - b.y));
  let selectableText = "";
  let currentY = sortedSpans[0]?.y ?? 0;
  let currentX = sortedSpans[0]?.startX ?? 0;

  for (const span of sortedSpans) {
    if (span.y > currentY) {
      selectableText += "\n".repeat(span.y - currentY);
      currentX = 0;
      currentY = span.y;
    }

    if (span.startX > currentX) {
      selectableText += " ".repeat(span.startX - currentX);
    }

    selectableText += span.text;
    currentX = span.endX;
  }

  return selectableText;
};
