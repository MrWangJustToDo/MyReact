/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getBackgroundColorEscape } from "../colorize.js";
import { type StickyHeader } from "../dom.js";
import { calculateScrollbarThumb } from "../measure-element.js";
import { type Region } from "../output.js";
import { renderScrollbar } from "../render-scrollbar.js";

import { type Canvas, type Rect } from "./canvas.js";

export type CompositionOptions = {
  skipStickyHeaders?: boolean;
  skipScrollbars?: boolean;
  stickyHeadersInBackbuffer?: boolean;
  animatedScroll?: boolean;
  targetScrollTops: ReadonlyMap<string | number, number>;
  regionWasAtEnd: Map<string | number, boolean>;
  canvasHeight: number;
};

/**
 * Handles rendering of various UI elements onto a Canvas.
 */
export class Compositor {
  private static lastBackgroundColor?: string;
  private static lastBackgroundStyles: string | undefined;

  constructor(private readonly options: CompositionOptions) {}

  drawContent(canvas: Canvas, region: Region, absX: number, absY: number, clip: Rect) {
    const scrollTop = region.scrollTop ?? 0;
    const scrollLeft = region.scrollLeft ?? 0;

    const isOpaque = Boolean(region.opaque) || Boolean(region.backgroundColor);

    for (let sy = clip.y; sy < clip.y + clip.h; sy++) {
      if (sy < 0 || sy >= canvas.height) {
        continue;
      }

      const dy = sy - absY;
      const contentY = Math.round(scrollTop + dy);
      const lineIndex = contentY - (region.linesOffsetY ?? 0);

      const line = region.lines[lineIndex];
      if (!line) {
        continue;
      }

      const startSx = Math.round(clip.x);
      const endSx = Math.round(clip.x + clip.w);

      for (let sx = startSx; sx < endSx; sx++) {
        if (sx < 0 || sx >= canvas.width) {
          continue;
        }

        const dx = sx - absX;
        const contentX = scrollLeft + dx;

        if (contentX < line.length) {
          const val = line.getValue(contentX);
          const isEmpty = val === " " && !line.hasStyles(contentX);

          if (isEmpty) {
            if (!isOpaque) {
              continue;
            }

            if (region.backgroundColor) {
              const bgColor = this.getBackgroundStyles(region.backgroundColor);
              if (bgColor) {
                canvas.setChar(sx, sy, val, line.getFormatFlags(contentX), line.getFgColor(contentX), bgColor, line.getLink(contentX));
                continue;
              }
            }
          }

          canvas.setChar(sx, sy, val, line.getFormatFlags(contentX), line.getFgColor(contentX), line.getBgColor(contentX), line.getLink(contentX));
        }
      }
    }
  }

  drawStickyHeaders(canvas: Canvas, region: Region, absX: number, absY: number, clip: Rect) {
    if (this.options.skipStickyHeaders) {
      return;
    }

    const scrollTop = region.scrollTop ?? 0;

    for (const header of region.stickyHeaders) {
      const useStuckPosition = this.isHeaderStuck(header, absY, scrollTop, region);

      // ONLY draw if stuck. Natural versions are already in the background buffer.
      if (!useStuckPosition) {
        continue;
      }

      const linesToRender = header.stuckLines ?? header.lines;

      let headerY = absY + header.y;
      const headerH = linesToRender.length;

      if (this.options.stickyHeadersInBackbuffer && region.overflowToBackbuffer) {
        if (header.type === "top") {
          if (headerY < 0 && absY + region.height > 0) {
            const maxStuckYAbs = header.maxStuckY === undefined ? 0 : absY + header.maxStuckY;
            headerY = Math.max(headerY, Math.min(0, maxStuckYAbs));
          }
        } else if (header.type === "bottom") {
          const stuckPos = this.options.canvasHeight - (header.stuckLines ?? header.lines).length;
          if (headerY > stuckPos && absY < stuckPos + headerH) {
            const minStuckYAbs = header.minStuckY === undefined ? stuckPos : absY + header.minStuckY;
            headerY = Math.min(headerY, Math.max(stuckPos, minStuckYAbs));
          }
        }
      }

      // Clamp to maxStuckY / minStuckY
      if (header.type === "top" && header.maxStuckY !== undefined) {
        const absoluteMaxStuckY = absY + header.maxStuckY;
        if (headerY > absoluteMaxStuckY) {
          headerY = absoluteMaxStuckY;
        }
      } else if (header.type === "bottom" && header.minStuckY !== undefined) {
        const absoluteMinStuckY = absY + header.minStuckY;
        if (headerY < absoluteMinStuckY) {
          headerY = absoluteMinStuckY;
        }
      }

      for (let i = 0; i < headerH; i++) {
        const sy = Math.round(headerY + i);

        // If header is within the region's clip (standard behavior)
        const withinRegionClip = sy >= clip.y && sy < clip.y + clip.h;

        // If header is above/below the region and we want sticky headers there
        const aboveRegionAndStickyEnabled =
          header.type === "top" &&
          absY < 0 &&
          this.options.stickyHeadersInBackbuffer &&
          region.overflowToBackbuffer &&
          sy >= 0 &&
          sy < Math.min(canvas.height, absY + region.height);

        const belowRegionAndStickyEnabled =
          header.type === "bottom" &&
          absY + region.height > this.options.canvasHeight &&
          this.options.stickyHeadersInBackbuffer &&
          region.overflowToBackbuffer &&
          sy >= Math.max(0, absY) &&
          sy < this.options.canvasHeight;

        if (!withinRegionClip && !aboveRegionAndStickyEnabled && !belowRegionAndStickyEnabled) {
          continue;
        }

        if (sy < 0 || sy >= canvas.height) {
          continue;
        }

        const line = linesToRender[i];
        if (!line) {
          continue;
        }

        const headerX = Math.round(header.x + absX);
        const headerW = Math.round(line.length);

        const hx1 = Math.max(headerX, clip.x);
        const hx2 = Math.min(headerX + headerW, clip.x + clip.w);

        for (let sx = hx1; sx < hx2; sx++) {
          const cx = sx - headerX;
          if (cx < line.length) {
            canvas.setChar(sx, sy, line.getValue(cx), line.getFormatFlags(cx), line.getFgColor(cx), line.getBgColor(cx), line.getLink(cx));
          }
        }
      }
    }
  }

  drawScrollbars(canvas: Canvas, region: Region, absX: number, absY: number, clip: Rect) {
    if (Boolean(this.options.skipScrollbars && region.overflowToBackbuffer) || !region.isScrollable || region.scrollbarVisible === false) {
      return;
    }

    const scrollTop = region.scrollTop ?? 0;
    const scrollLeft = region.scrollLeft ?? 0;
    const scrollHeight = region.scrollHeight ?? 0;
    const scrollWidth = region.scrollWidth ?? 0;

    const isVerticalScrollbarVisible = (region.isVerticallyScrollable ?? false) && scrollHeight > region.height;
    const isHorizontalScrollbarVisible = (region.isHorizontallyScrollable ?? false) && scrollWidth > region.width;

    if (isVerticalScrollbarVisible) {
      let scrollPosition = scrollTop;
      const targetScrollTop = this.options.targetScrollTops.get(region.id);
      if (this.options.animatedScroll && targetScrollTop !== undefined && targetScrollTop !== scrollTop) {
        const wasAtEnd = this.options.regionWasAtEnd.get(region.id);
        const isTargetAtEnd = targetScrollTop >= scrollHeight - region.height;
        if (wasAtEnd && isTargetAtEnd) {
          scrollPosition = targetScrollTop;
        }
      }

      const { startIndex, endIndex, thumbStartHalf, thumbEndHalf } = calculateScrollbarThumb({
        scrollbarDimension: region.height,
        clientDimension: region.height,
        scrollDimension: scrollHeight,
        scrollPosition,
        axis: "vertical",
      });

      const barX = absX + region.width - 1 - (region.marginRight ?? 0);

      renderScrollbar({
        layout: {
          x: barX,
          y: absY,
          width: 1,
          height: region.height,
          thumb: {
            x: barX,
            y: absY + startIndex,
            width: 1,
            height: endIndex - startIndex,
            start: startIndex,
            end: endIndex,
            startHalf: thumbStartHalf,
            endHalf: thumbEndHalf,
          },
        },
        clip,
        axis: "vertical",
        color: region.scrollbarThumbColor,
        setChar(x, y, value, formatFlags, fgColor, bgColor, link) {
          canvas.setChar(x, y, value, formatFlags, fgColor, bgColor, link);
        },
        getExistingChar(x, y) {
          return canvas.getChar(x, y);
        },
      });
    }

    if (isHorizontalScrollbarVisible) {
      const scrollbarWidth = region.width - (isVerticalScrollbarVisible ? 1 : 0);

      const { startIndex, endIndex, thumbStartHalf, thumbEndHalf } = calculateScrollbarThumb({
        scrollbarDimension: scrollbarWidth,
        clientDimension: region.width,
        scrollDimension: scrollWidth,
        scrollPosition: scrollLeft,
        axis: "horizontal",
      });

      const barY = absY + region.height - 1 - (region.marginBottom ?? 0);

      renderScrollbar({
        layout: {
          x: absX,
          y: barY,
          width: scrollbarWidth,
          height: 1,
          thumb: {
            x: absX + startIndex,
            y: barY,
            width: endIndex - startIndex,
            height: 1,
            start: startIndex,
            end: endIndex,
            startHalf: thumbStartHalf,
            endHalf: thumbEndHalf,
          },
        },
        clip,
        axis: "horizontal",
        color: region.scrollbarThumbColor,
        setChar(x, y, value, formatFlags, fgColor, bgColor, link) {
          canvas.setChar(x, y, value, formatFlags, fgColor, bgColor, link);
        },
        getExistingChar(x, y) {
          return canvas.getChar(x, y);
        },
      });
    }
  }

  isHeaderStuck(header: StickyHeader, absY: number, scrollTop: number, region: Region): boolean {
    const isStuckState =
      header.type === "bottom"
        ? Math.round(header.naturalRow - scrollTop + header.lines.length) >= Math.round(header.y + (header.stuckLines ?? header.lines).length)
        : Math.round(header.naturalRow - scrollTop) <= Math.round(header.y);

    if (!isStuckState) {
      return false;
    }

    if (header.type === "top") {
      if (region.overflowToBackbuffer && absY + header.y <= 0 && !(this.options.stickyHeadersInBackbuffer ?? false)) {
        return false;
      }

      return true;
    }

    return true;
  }

  calculateActualStuckTopHeight(region: Region, absY: number, scrollTop: number): number {
    let stuckHeight = 0;
    const topHeaders = [...region.stickyHeaders].filter((h) => h.type === "top").sort((a, b) => a.y - b.y);

    for (const header of topHeaders) {
      if (this.isHeaderStuck(header, absY, scrollTop, region) && Math.abs(Math.round(header.y) - stuckHeight) < 0.5) {
        const linesToRender = header.stuckLines ?? header.lines;
        stuckHeight += linesToRender.length;
      } else if (this.isHeaderStuck(header, absY, scrollTop, region)) {
        break;
      }
    }

    return stuckHeight;
  }

  calculateActualStuckBottomHeight(region: Region, absY: number, scrollTop: number): number {
    let stuckHeight = 0;
    const bottomHeaders = [...region.stickyHeaders].filter((h) => h.type === "bottom").sort((a, b) => b.y - a.y);

    for (const header of bottomHeaders) {
      if (this.isHeaderStuck(header, absY, scrollTop, region)) {
        const linesToRender = header.stuckLines ?? header.lines;
        const footerRowInRegion = region.height - linesToRender.length - stuckHeight;
        if (Math.round(header.y) === Math.round(footerRowInRegion)) {
          stuckHeight += linesToRender.length;
        } else {
          break;
        }
      }
    }

    return stuckHeight;
  }

  private getBackgroundStyles(color: string): string | undefined {
    if (color === Compositor.lastBackgroundColor) {
      return Compositor.lastBackgroundStyles;
    }

    const styles = getBackgroundColorEscape(color);

    Compositor.lastBackgroundColor = color;
    Compositor.lastBackgroundStyles = styles;

    return styles;
  }
}
