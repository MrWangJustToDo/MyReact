/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Region } from "../output.js";

import { type RenderLine } from "./terminal-writer.js";

export type ScrollOperation = {
  start: number;
  end: number;
  linesToScroll: number;
  lines: RenderLine[];
  direction: "up" | "down";
  scrollToBackbuffer: boolean;
  regionId: string | number;
  newMaxPushed?: number;
};

/**
 * Optimized decision-making for terminal hardware scrolling.
 * Tracks what has been scrolled and pushed to the backbuffer.
 */
export class ScrollOptimizer {
  maxRegionScrollTops = new Map<string | number, number>();
  lastRegionScrollTops = new Map<string | number, number>();

  /**
   * Determines if a region scroll can be optimized with hardware scrolling.
   */
  calculateScrollOperations(
    region: Region,
    rows: number,
    columns: number,
    absY: number,
    getLinesForScroll: (scrollStart: number, count: number, start: number, end: number, scrollToBackbuffer: boolean) => RenderLine[],
    calculateStuckTopHeight: (region: Region, absY: number, scrollTop: number) => number,
    calculateStuckBottomHeight: (region: Region, absY: number, scrollTop: number) => number,
    stickyHeadersInBackbuffer: boolean
  ): ScrollOperation[] {
    if (!region.isScrollable) {
      this.lastRegionScrollTops.delete(region.id);
      return [];
    }

    const scrollTop = region.scrollTop ?? 0;

    if (!this.lastRegionScrollTops.has(region.id)) {
      this.lastRegionScrollTops.set(region.id, scrollTop);
      if (region.overflowToBackbuffer) {
        this.updateMaxPushed(region.id, scrollTop);
      }

      return [];
    }

    const lastScrollTop = this.lastRegionScrollTops.get(region.id) ?? 0;

    if (scrollTop === lastScrollTop) {
      return [];
    }

    const start = Math.max(0, absY);
    const regionHeight = Math.round(region.height);
    const end = Math.min(rows, absY + regionHeight);

    const actualStuckTopHeight = calculateStuckTopHeight(region, absY, scrollTop);
    const actualStuckBottomHeight = calculateStuckBottomHeight(region, absY, scrollTop);

    const adjustedStart = Math.round(Math.max(start, absY + (region.overflowToBackbuffer && !stickyHeadersInBackbuffer ? 0 : actualStuckTopHeight)));
    const adjustedEnd = Math.round(Math.min(end, absY + regionHeight - actualStuckBottomHeight));

    if (adjustedEnd < adjustedStart) {
      this.lastRegionScrollTops.set(region.id, scrollTop);
      return [];
    }

    const maxPushed = this.maxRegionScrollTops.get(region.id) ?? 0;
    const direction = scrollTop > lastScrollTop ? "up" : "down";
    const linesToScroll = Math.abs(scrollTop - lastScrollTop);

    const operations: ScrollOperation[] = [];

    if (direction === "up" && region.overflowToBackbuffer && region.width >= columns && region.x === 0) {
      const newLinesToPush = Math.min(linesToScroll, Math.max(0, scrollTop - maxPushed));
      const linesToJustScroll = linesToScroll - newLinesToPush;

      if (newLinesToPush > 0) {
        const pushBase = Math.max(lastScrollTop, maxPushed);
        operations.push({
          start: adjustedStart,
          end: adjustedEnd,
          linesToScroll: newLinesToPush,
          lines: getLinesForScroll(pushBase, newLinesToPush, adjustedStart, adjustedEnd, true),
          direction: "up",
          scrollToBackbuffer: true,
          regionId: region.id,
          newMaxPushed: Math.max(maxPushed, scrollTop),
        });
      }

      if (linesToJustScroll > 0) {
        const visualBase = lastScrollTop + newLinesToPush;
        operations.push({
          start: adjustedStart,
          end: adjustedEnd,
          linesToScroll: linesToJustScroll,
          lines: getLinesForScroll(visualBase, linesToJustScroll, adjustedStart, adjustedEnd, false),
          direction: "up",
          scrollToBackbuffer: false,
          regionId: region.id,
        });
      }
    } else {
      operations.push({
        start: adjustedStart,
        end: adjustedEnd,
        linesToScroll,
        lines: getLinesForScroll(direction === "up" ? lastScrollTop : scrollTop, linesToScroll, adjustedStart, adjustedEnd, false),
        direction,
        scrollToBackbuffer: false,
        regionId: region.id,
      });
    }

    this.lastRegionScrollTops.set(region.id, scrollTop);
    return operations;
  }

  updateMaxPushed(regionId: string | number, maxPushed: number) {
    const current = this.maxRegionScrollTops.get(regionId) ?? 0;
    this.maxRegionScrollTops.set(regionId, Math.max(current, maxPushed));
  }

  setMaxPushed(regionId: string | number, maxPushed: number) {
    this.maxRegionScrollTops.set(regionId, maxPushed);
  }

  resetTracking(regionId: string | number) {
    this.maxRegionScrollTops.delete(regionId);
    this.lastRegionScrollTops.delete(regionId);
  }
}
