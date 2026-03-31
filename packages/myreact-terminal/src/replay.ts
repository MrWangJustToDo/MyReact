/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Buffer } from "node:buffer";
import fs from "node:fs";

import { type StickyHeader } from "./dom.js";
import { type RegionNode, type RegionUpdate } from "./output.js";
import { Deserializer } from "./serialization.js";

export type ReplayData = {
  type: "single" | "sequence";
  columns: number;
  rows: number;
  frames: ReplayFrame[];
};

export type ReplayFrame = {
  tree: RegionNode;
  updates: ReplayRegionUpdate[];
  cursorPosition?: { row: number; col: number };
  timestamp: number;
};

export type ReplayRegionUpdate = Omit<RegionUpdate, "lines" | "stickyHeaders"> & {
  lines?: {
    updates: Array<{
      start: number;
      end: number;
      data: string;
      source?: string;
    }>;
    totalLength: number;
  };
  stickyHeaders?: ReplayStickyHeader[];
};

export type ReplayStickyHeader = Omit<StickyHeader, "node" | "anchor" | "lines" | "stuckLines" | "styledOutput"> & {
  lines: string;
  stuckLines?: string;
  styledOutput: string;
};

export function serializeReplayUpdate(update: RegionUpdate): ReplayRegionUpdate {
  const { lines, stickyHeaders, ...rest } = update;
  const result: ReplayRegionUpdate = {
    ...rest,
  };

  if (lines) {
    result.lines = {
      totalLength: lines.totalLength,
      updates: lines.updates.map((u) => ({
        start: u.start,
        end: u.end,
        data: Buffer.from(u.data).toString("base64"),
        source: u.source ? Buffer.from(u.source).toString("base64") : undefined,
      })),
    };
  }

  if (stickyHeaders) {
    result.stickyHeaders = stickyHeaders.map((h) => ({
      ...h,
      lines: Buffer.from(h.lines).toString("base64"),
      stuckLines: h.stuckLines ? Buffer.from(h.stuckLines).toString("base64") : undefined,
      styledOutput: Buffer.from(h.styledOutput).toString("base64"),
    }));
  }

  return result;
}

export function deserializeReplayUpdate(update: ReplayRegionUpdate): RegionUpdate {
  const { lines, stickyHeaders, ...rest } = update;
  const result: RegionUpdate = {
    ...rest,
  };

  if (lines) {
    result.lines = {
      totalLength: lines.totalLength,
      updates: lines.updates.map((u) => ({
        start: u.start,
        end: u.end,
        data: Buffer.from(u.data, "base64"),
        source: u.source ? Buffer.from(u.source, "base64") : undefined,
      })),
    };
  }

  if (stickyHeaders) {
    result.stickyHeaders = stickyHeaders.map((h) => ({
      ...h,
      lines: Buffer.from(h.lines, "base64"),
      stuckLines: h.stuckLines ? Buffer.from(h.stuckLines, "base64") : undefined,
      styledOutput: Buffer.from(h.styledOutput, "base64"),
    }));
  }

  return result;
}

export function saveReplay(data: ReplayData, filename: string): void {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

export type LoadedReplayData = {
  type: "single" | "sequence";
  columns: number;
  rows: number;
  frames: LoadedReplayFrame[];
};

export type LoadedReplayFrame = {
  tree: RegionNode;
  updates: RegionUpdate[];
  cursorPosition?: { row: number; col: number };
  timestamp: number;
};

type RawReplayData = {
  type: "single" | "sequence";
  columns: number;
  rows: number;
  frames: Array<{
    tree: RegionNode;
    updates: ReplayRegionUpdate[];
    cursorPosition?: { row: number; col: number };
    timestamp: number;
  }>;
};

export function loadReplay(jsonStr: string): LoadedReplayData {
  const raw = JSON.parse(jsonStr) as RawReplayData;
  return {
    ...raw,
    frames: raw.frames.map((f) => ({
      ...f,
      updates: f.updates.map((u) => deserializeReplayUpdate(u)),
    })),
  };
}

export function createHumanReadableDump(data: LoadedReplayData): string {
  const dumpData = {
    type: data.type,
    columns: data.columns,
    rows: data.rows,
    frames: data.frames.map((frame) => ({
      tree: frame.tree,
      cursorPosition: frame.cursorPosition,
      updates: frame.updates.map((update) => {
        const dumpUpdate: Record<string, any> = { ...update };

        // Explicitly copy properties that could be undefined if omitted in object spread occasionally
        dumpUpdate["overflowToBackbuffer"] = update.overflowToBackbuffer;
        dumpUpdate["isScrollable"] = update.isScrollable;

        if (update.lines) {
          dumpUpdate["lines"] = {
            totalLength: update.lines.totalLength,
            updates: update.lines.updates.map((u) => {
              const deserializer = new Deserializer(Buffer.from(u.data));
              const lines = deserializer.deserialize();
              return {
                start: u.start,
                end: u.end,
                text: lines.map((line) => line.getText().trimEnd()),
              };
            }),
          };
        }

        if (update.stickyHeaders) {
          dumpUpdate["stickyHeaders"] = update.stickyHeaders.map((h) => ({
            ...h,
            lines: new Deserializer(Buffer.from(h.lines)).deserialize().map((line) => line.getText().trimEnd()),
            stuckLines: h.stuckLines ? new Deserializer(Buffer.from(h.stuckLines)).deserialize().map((line) => line.getText().trimEnd()) : undefined,
            styledOutput: new Deserializer(Buffer.from(h.styledOutput)).deserialize().map((line) => line.getText().trimEnd()),
            node: undefined,
          }));
        }

        return dumpUpdate;
      }),
    })),
  };

  return JSON.stringify(dumpData, null, 2);
}
