/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Buffer } from "node:buffer";

import { type RegionNode, type RegionUpdate, type Region, regionLayoutProperties, copyRegionProperty } from "../output.js";
import { Deserializer } from "../serialization.js";
import { StyledLine } from "../styled-line.js";

/**
 * Manages the scene tree of regions.
 * Handles updates from the main thread and maintains the current state of all regions.
 */
export class SceneManager {
  regions = new Map<string | number, Region>();
  root?: RegionNode;
  regionWasAtEnd = new Map<string | number, boolean>();

  /**
   * Updates the scene tree and regions with new data.
   * Returns true if the scene was updated in a way that likely requires a re-render.
   */
  update(
    tree: RegionNode,
    updates: RegionUpdate[],
    options: {
      animatedScroll: boolean;
      onScrollUpdate: (regionId: string | number, scrollTop: number, isNew: boolean) => void;
      onRegionDeleted?: (regionId: string | number) => void;
    }
  ): boolean {
    this.root = tree;

    const activeIds = new Set<string | number>();
    const traverse = (node: RegionNode) => {
      activeIds.add(node.id);
      for (const child of node.children) {
        traverse(child);
      }
    };

    traverse(tree);

    for (const id of this.regions.keys()) {
      if (!activeIds.has(id)) {
        this.regions.delete(id);
        this.regionWasAtEnd.delete(id);
        options.onRegionDeleted?.(id);
      }
    }

    for (const update of updates) {
      let region = this.regions.get(update.id);
      const isNew = !region;

      if (!region) {
        // Initialize new region
        const newRegion: Region = {
          id: update.id,
          selectableSpans: [],
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          bufferWidth: 0,
          lines: [],
          styledOutput: [],
          isScrollable: false,
          stickyHeaders: [],
          children: [],
        };
        region = newRegion;
        this.regions.set(update.id, region);
        this.regionWasAtEnd.set(update.id, true);
      }

      const oldOffsetY = region.linesOffsetY ?? 0;

      // Apply properties
      const r = region;
      for (const key of regionLayoutProperties) {
        if (update[key] !== undefined) {
          if (key === "scrollTop") {
            options.onScrollUpdate(r.id, update.scrollTop!, isNew);
          } else {
            copyRegionProperty(r, update, key);
          }
        }
      }

      if (update.stickyHeaders !== undefined) {
        r.stickyHeaders = update.stickyHeaders.map((header) => ({
          ...header,
          lines: new Deserializer(Buffer.from(header.lines)).deserialize(),
          stuckLines: header.stuckLines ? new Deserializer(Buffer.from(header.stuckLines)).deserialize() : undefined,
          styledOutput: new Deserializer(Buffer.from(header.styledOutput)).deserialize(),
        }));
      }

      // Apply line updates
      if (update.linesOffsetY !== undefined) {
        r.linesOffsetY = update.linesOffsetY;
      }

      if (update.lines) {
        const sparseLines: StyledLine[] = [];
        for (let i = 0; i < r.lines.length; i++) {
          sparseLines[oldOffsetY + i] = r.lines[i]!;
        }

        for (const chunk of update.lines.updates) {
          const deserializer = new Deserializer(Buffer.from(chunk.data));
          const chunkLines = deserializer.deserialize();

          for (const [i, line] of chunkLines.entries()) {
            if (line && line.length > 0) {
              sparseLines[chunk.start + i] = line;
            } else {
              sparseLines[chunk.start + i] = undefined as unknown as StyledLine;
            }
          }
        }

        const newOffsetY = r.linesOffsetY ?? 0;
        const newLines: StyledLine[] = [];
        const newLength = update.lines.totalLength ?? 0;
        for (let i = 0; i < newLength; i++) {
          newLines.push(sparseLines[newOffsetY + i] || new StyledLine());
        }

        (r.lines as StyledLine[]) = newLines;
      }
    }

    return updates.length > 0;
  }

  getRegion(id: string | number): Region | undefined {
    return this.regions.get(id);
  }

  getRootRegion(): Region | undefined {
    return this.root ? this.regions.get(this.root.id) : undefined;
  }
}
