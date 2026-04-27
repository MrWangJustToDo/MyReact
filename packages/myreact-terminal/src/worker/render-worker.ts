/* eslint-disable max-lines */
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ansiEscapes from "ansi-escapes";
import fs from "node:fs";
import process from "node:process";

import { type InkOptions } from "../components/AppContext.js";
import { debugLog, clearDebugLog } from "../debug-log.js";
import { type RegionNode, type RegionUpdate, type Region, regionLayoutProperties, copyRegionProperty, treesEqual } from "../output.js";
import { saveReplay, createHumanReadableDump, type ReplayData, type LoadedReplayData, serializeReplayUpdate, type ReplayFrame } from "../replay.js";
import { Serializer } from "../serialization.js";

import { AnimationController } from "./animation-controller.js";
import { Canvas } from "./canvas.js";
import { Compositor } from "./compositor.js";
import { SceneManager } from "./scene-manager.js";
import { ScrollOptimizer } from "./scroll-optimizer.js";
import { type RenderLine, TerminalWriter, rainbowColors } from "./terminal-writer.js";

const defaultAnimationInterval = 1;
const defaultMaxScrollbackLength = 1000;

export const debugWorker = false;
const clearDebugLogPerFrame = false;
/**
 * Core renderer that composes together scrollable blocks of styled content.
 */
export class TerminalBufferWorker {
  frameIndex = 0;
  debugRainbowEnabled = false;
  isAlternateBufferEnabled = false;
  stickyHeadersInBackbuffer = false;
  animatedScroll = false;
  animationInterval = defaultAnimationInterval;
  backbufferUpdateDelay = 1000;
  maxScrollbackLength = defaultMaxScrollbackLength;
  forceScrollToBottomOnBackbufferRefresh = false;
  resized = false;
  cursorPosition?: { row: number; col: number };
  forceNextRender = false;

  isRecording = false;
  recordingFilename = "";
  recordedFrames: ReplayFrame[] = [];
  recordingStartTime = 0;

  // Ground truth on what lines should be rendered (composed frame)
  screen: RenderLine[] = [];
  backbuffer: RenderLine[] = [];

  /**
   * Visible for testing.
   */
  readonly sceneManager = new SceneManager();

  /**
   * Visible for testing.
   */
  readonly scrollOptimizer = new ScrollOptimizer();

  private renderPromise?: Promise<void>;
  private readonly animationController: AnimationController;
  private readonly primaryTerminalWriter: TerminalWriter;
  private readonly alternateTerminalWriter: TerminalWriter;

  /**
   * Visible for testing.
   */
  get terminalWriter(): TerminalWriter {
    return this.isAlternateBufferEnabled ? this.alternateTerminalWriter : this.primaryTerminalWriter;
  }

  get backbufferDirty(): boolean {
    return this.terminalWriter.backbufferDirty;
  }

  set backbufferDirty(value: boolean) {
    this.terminalWriter.backbufferDirty = value;
  }

  get backbufferDirtyCurrentFrame(): boolean {
    return this.terminalWriter.backbufferDirtyCurrentFrame;
  }

  set backbufferDirtyCurrentFrame(value: boolean) {
    this.terminalWriter.backbufferDirtyCurrentFrame = value;
  }

  constructor(
    public columns: number,
    public rows: number,
    options?: {
      debugRainbowEnabled?: boolean;
      stdout?: NodeJS.WriteStream;
      isAlternateBufferEnabled?: boolean;
      stickyHeadersInBackbuffer?: boolean;
      animatedScroll?: boolean;
      animationInterval?: number;
      backbufferUpdateDelay?: number;
      maxScrollbackLength?: number;
      forceScrollToBottomOnBackbufferRefresh?: boolean;
    }
  ) {
    const stdout = options?.stdout ?? process.stdout;
    this.primaryTerminalWriter = new TerminalWriter(columns, rows, stdout);
    this.alternateTerminalWriter = new TerminalWriter(columns, rows, stdout);

    this.primaryTerminalWriter.writeRaw(ansiEscapes.cursorHide);
    this.alternateTerminalWriter.writeRaw(ansiEscapes.cursorHide);

    this.debugRainbowEnabled = options?.debugRainbowEnabled ?? this.debugRainbowEnabled;
    this.isAlternateBufferEnabled = options?.isAlternateBufferEnabled ?? this.isAlternateBufferEnabled;
    this.stickyHeadersInBackbuffer = options?.stickyHeadersInBackbuffer ?? this.stickyHeadersInBackbuffer;
    this.animatedScroll = options?.animatedScroll ?? this.animatedScroll;
    this.animationInterval = options?.animationInterval ?? this.animationInterval;
    this.backbufferUpdateDelay = options?.backbufferUpdateDelay ?? this.backbufferUpdateDelay;
    this.maxScrollbackLength = options?.maxScrollbackLength ?? this.maxScrollbackLength;
    this.forceScrollToBottomOnBackbufferRefresh = options?.forceScrollToBottomOnBackbufferRefresh ?? this.forceScrollToBottomOnBackbufferRefresh;

    this.primaryTerminalWriter.maxScrollbackLength = this.maxScrollbackLength;
    this.alternateTerminalWriter.maxScrollbackLength = this.maxScrollbackLength;

    this.primaryTerminalWriter.forceScrollToBottomOnBackbufferRefresh = this.forceScrollToBottomOnBackbufferRefresh;
    this.alternateTerminalWriter.forceScrollToBottomOnBackbufferRefresh = this.forceScrollToBottomOnBackbufferRefresh;

    if (this.isAlternateBufferEnabled) {
      this.alternateTerminalWriter.writeRaw(ansiEscapes.enterAlternativeScreen);
    }

    this.animationController = new AnimationController({
      interval: this.animationInterval,
      onTick: () => {
        this.tickAnimation();
      },
    });
  }

  async waitForIdle() {
    await this.flushPendingRender();

    if (this.animatedScroll) {
      await this.animationController.waitForIdle();
    }

    if (this.renderPromise) {
      await this.renderPromise;
    }
  }

  getExpectedState() {
    return this.terminalWriter.getExpectedState();
  }

  getSceneManager() {
    return this.sceneManager;
  }

  public startRecording(filename: string) {
    this.isRecording = true;
    this.recordingFilename = filename;
    this.recordedFrames = [];
    this.recordingStartTime = Date.now();

    const { root } = this.sceneManager;
    if (root) {
      const serializer = new Serializer();
      const updates = this.serializeCurrentRegions(serializer);

      this.recordedFrames.push({
        tree: structuredClone(root),
        updates: updates.map((u) => serializeReplayUpdate(u)),
        cursorPosition: this.cursorPosition,
        timestamp: 0,
      });
    }
  }

  public stopRecording() {
    if (!this.isRecording) return;

    const data: ReplayData = {
      type: "sequence",
      columns: this.columns,
      rows: this.rows,
      frames: this.recordedFrames,
    };

    saveReplay(data, this.recordingFilename);

    this.isRecording = false;
    this.recordedFrames = [];
  }

  public dumpCurrentFrame(filename: string) {
    const { root } = this.sceneManager;
    if (!root) return;

    const serializer = new Serializer();
    const updates = this.serializeCurrentRegions(serializer);

    const data: ReplayData = {
      type: "single",
      columns: this.columns,
      rows: this.rows,
      frames: [
        {
          tree: root,
          updates: updates.map((u) => serializeReplayUpdate(u)),
          cursorPosition: this.cursorPosition,
          timestamp: 0,
        },
      ],
    };

    saveReplay(data, filename);

    const loadedData: LoadedReplayData = {
      type: "single",
      columns: this.columns,
      rows: this.rows,
      frames: [
        {
          tree: root,
          updates,
          cursorPosition: this.cursorPosition,
          timestamp: 0,
        },
      ],
    };

    const dumpText = createHumanReadableDump(loadedData);
    fs.writeFileSync(filename + ".dump.txt", dumpText);
  }

  updateOptions(options: InkOptions) {
    if (options.isAlternateBufferEnabled !== undefined && this.isAlternateBufferEnabled !== options.isAlternateBufferEnabled) {
      // Flush current writer before switching
      this.terminalWriter.flush();

      if (this.terminalWriter.fullRenderTimeout) {
        clearTimeout(this.terminalWriter.fullRenderTimeout);
        this.terminalWriter.fullRenderTimeout = undefined;
      }

      if (options.isAlternateBufferEnabled) {
        this.primaryTerminalWriter.stdout.write(ansiEscapes.enterAlternativeScreen);
        this.isAlternateBufferEnabled = true;

        // The newly active alternate buffer is effectively blank
        this.terminalWriter.clear();
      } else {
        this.alternateTerminalWriter.stdout.write(ansiEscapes.exitAlternativeScreen);
        this.isAlternateBufferEnabled = false;

        // When returning to the primary buffer, we don't clear it (to preserve history/static output)
        // but we mark it as potentially having an unknown cursor position and tainted lines.
        this.terminalWriter.unkownCursorLocation();
        this.terminalWriter.taintScreen();
        this.terminalWriter.isTainted = true;
      }

      this.forceNextRender = true;
    }

    if (options.stickyHeadersInBackbuffer !== undefined && this.stickyHeadersInBackbuffer !== options.stickyHeadersInBackbuffer) {
      this.stickyHeadersInBackbuffer = options.stickyHeadersInBackbuffer;
      this.forceNextRender = true;
    }

    if (options.animatedScroll !== undefined && this.animatedScroll !== options.animatedScroll) {
      this.animatedScroll = options.animatedScroll;
      if (this.animatedScroll) {
        this.animationController.start();
      } else {
        this.animationController.stop();
      }
    }

    if (options.animationInterval !== undefined && this.animationInterval !== options.animationInterval) {
      this.animationInterval = options.animationInterval;
      this.animationController.stop();
      this.animationController.updateInterval(this.animationInterval);
      if (this.animatedScroll) {
        this.animationController.start();
      }
    }

    if (options.backbufferUpdateDelay !== undefined) {
      this.backbufferUpdateDelay = options.backbufferUpdateDelay;
    }

    if (options.maxScrollbackLength !== undefined) {
      this.maxScrollbackLength = options.maxScrollbackLength;
      this.primaryTerminalWriter.maxScrollbackLength = this.maxScrollbackLength;
      this.alternateTerminalWriter.maxScrollbackLength = this.maxScrollbackLength;
    }

    if (
      options.forceScrollToBottomOnBackbufferRefresh !== undefined &&
      this.forceScrollToBottomOnBackbufferRefresh !== options.forceScrollToBottomOnBackbufferRefresh
    ) {
      this.forceScrollToBottomOnBackbufferRefresh = options.forceScrollToBottomOnBackbufferRefresh;
      this.primaryTerminalWriter.forceScrollToBottomOnBackbufferRefresh = this.forceScrollToBottomOnBackbufferRefresh;
      this.alternateTerminalWriter.forceScrollToBottomOnBackbufferRefresh = this.forceScrollToBottomOnBackbufferRefresh;
    }
  }

  update(tree: RegionNode, updates: RegionUpdate[], cursorPosition?: { row: number; col: number }): boolean {
    const previousCursorPosition = this.cursorPosition;
    this.cursorPosition = cursorPosition;

    const treeChanged = !this.sceneManager.root || !treesEqual(this.sceneManager.root, tree);

    if (this.isRecording) {
      this.recordedFrames.push({
        tree,
        updates: updates.map((u) => serializeReplayUpdate(u)),
        cursorPosition,
        timestamp: Date.now() - this.recordingStartTime,
      });
    }

    if (this.animatedScroll) {
      if (updates.length > 0) {
        if (debugWorker) {
          debugLog(`[RENDER-WORKER] Interrupting animation for jump\n`);
        }

        this.animationController.jumpToTargets(this.sceneManager.regions);
      }

      this.animationController.start();
    }

    this.sceneManager.update(tree, updates, {
      animatedScroll: this.animatedScroll,
      onScrollUpdate: (id, scrollTop, isNew) => {
        if (this.animatedScroll && !isNew) {
          this.animationController.setTargetScrollTop(id, scrollTop);
        } else {
          const region = this.sceneManager.getRegion(id);
          if (region) {
            region.scrollTop = scrollTop;

            if (this.animatedScroll) {
              this.animationController.setTargetScrollTop(id, scrollTop);
            }
          }
        }
      },
      onRegionDeleted: (id) => {
        this.animationController.deleteTargetScrollTop(id);
        this.scrollOptimizer.resetTracking(id);
      },
    });

    // Track regionWasAtEnd for scrollbars
    for (const update of updates) {
      const region = this.sceneManager.getRegion(update.id);
      if (region) {
        const currentEffectiveScrollTop = this.animationController.getTargetScrollTop(region.id) ?? region.scrollTop ?? 0;
        const wasAtEnd = currentEffectiveScrollTop >= (region.scrollHeight ?? 0) - (region.height ?? 0);
        this.sceneManager.regionWasAtEnd.set(region.id, wasAtEnd);
      }
    }

    // Check backbuffer dirty
    const rootRegion = this.sceneManager.getRootRegion();
    if (rootRegion) {
      const cameraY = Math.max(0, rootRegion.height - this.rows);

      for (const update of updates) {
        const region = this.sceneManager.getRegion(update.id);

        if (region && update.lines) {
          const scrollTop = region.scrollTop ?? 0;
          for (const chunk of update.lines.updates) {
            if (region.overflowToBackbuffer && chunk.start < scrollTop) {
              this.terminalWriter.backbufferDirty = true;
              this.terminalWriter.backbufferDirtyCurrentFrame = true;
            }

            const absStart = region.y + chunk.start;
            if (absStart < cameraY) {
              this.terminalWriter.backbufferDirty = true;
              this.terminalWriter.backbufferDirtyCurrentFrame = true;
            }
          }
        }
      }
    }

    const cursorChanged =
      cursorPosition !== previousCursorPosition &&
      (!cursorPosition || !previousCursorPosition || cursorPosition.row !== previousCursorPosition.row || cursorPosition.col !== previousCursorPosition.col);

    const shouldRender = updates.length > 0 || cursorChanged || treeChanged || this.terminalWriter.backbufferDirty || this.forceNextRender;

    return shouldRender;
  }

  resize(columns: number, rows: number) {
    if (this.columns === columns && this.rows === rows) {
      return;
    }

    this.columns = columns;
    this.rows = rows;

    if (debugWorker) {
      debugLog(`XXXXX [RENDER-WORKER] Resize to ${columns}x${rows}\n`);
    }

    this.primaryTerminalWriter.resize(columns, rows);
    this.alternateTerminalWriter.resize(columns, rows);
    this.terminalWriter.backbufferDirtyCurrentFrame = true;
    this.resized = true;
    void this.render();
  }

  async fullRender() {
    if (clearDebugLogPerFrame) {
      clearDebugLog();
    }

    if (this.terminalWriter.fullRenderTimeout) {
      clearTimeout(this.terminalWriter.fullRenderTimeout);
      this.terminalWriter.fullRenderTimeout = undefined;
    }

    if (!this.terminalWriter.backbufferDirty) {
      await this.render();
      return;
    }

    if (debugWorker) {
      debugLog(`XXXXX [RENDER-WORKER] True full render triggered\n`);
    }

    this.terminalWriter.backbufferDirty = false;
    this.terminalWriter.backbufferDirtyCurrentFrame = false;

    this.composeScene(true);

    const rootRegion = this.sceneManager.getRootRegion();
    const cameraY = rootRegion ? this.getCameraY(rootRegion) : 0;

    this.syncCursor(cameraY);

    this.terminalWriter.clear();

    this.terminalWriter.writeLines([...this.backbuffer, ...this.screen]);

    this.updateTrackingMaps(rootRegion, cameraY, true);

    this.terminalWriter.finish();
    this.terminalWriter.flush();
    this.terminalWriter.validateLinesConsistent(this.screen);

    this.logScene();
  }

  async render() {
    const renderTask = this._render();
    this.renderPromise = renderTask;
    try {
      await renderTask;
    } finally {
      if (this.renderPromise === renderTask) {
        this.renderPromise = undefined;
      }
    }
  }

  async flushPendingRender() {
    if (this.terminalWriter.fullRenderTimeout) {
      clearTimeout(this.terminalWriter.fullRenderTimeout);
      this.terminalWriter.fullRenderTimeout = undefined;
      await this.fullRender();
    }
  }

  done() {
    if (this.isRecording) {
      this.stopRecording();
    }

    this.animationController.stop();
    this.terminalWriter.done();

    this.terminalWriter.stdout.write(ansiEscapes.cursorShow);

    if (this.isAlternateBufferEnabled) {
      this.terminalWriter.stdout.write(ansiEscapes.exitAlternativeScreen);
    }
  }

  getLinesUpdated(): number {
    return this.terminalWriter.getLinesUpdated();
  }

  resetLinesUpdated() {
    this.terminalWriter.resetLinesUpdated();
  }

  clear() {
    this.animationController.stop();
    this.sceneManager.regions.clear();
    this.sceneManager.root = undefined;
    this.sceneManager.regionWasAtEnd.clear();

    this.scrollOptimizer.maxRegionScrollTops.clear();
    this.scrollOptimizer.lastRegionScrollTops.clear();

    this.screen = [];
    this.backbuffer = [];
    this.forceNextRender = false;
    this.cursorPosition = undefined;

    this.primaryTerminalWriter.clear();
    this.alternateTerminalWriter.clear();
    this.terminalWriter.flush();
  }

  private serializeCurrentRegions(serializer: Serializer): RegionUpdate[] {
    const updates: RegionUpdate[] = [];
    for (const region of this.sceneManager.regions.values()) {
      const update: RegionUpdate = {
        id: region.id,
        stickyHeaders: region.stickyHeaders.map((h) => {
          const { node: _node, ...rest } = h;
          return {
            ...rest,
            lines: serializer.serialize(h.lines),
            stuckLines: h.stuckLines ? serializer.serialize(h.stuckLines) : undefined,
            styledOutput: serializer.serialize(h.styledOutput),
          };
        }),
      };

      for (const key of regionLayoutProperties) {
        copyRegionProperty(update, region, key);
      }

      if (region.lines.length > 0) {
        const offsetY = region.linesOffsetY ?? 0;
        update.lines = {
          updates: [
            {
              start: offsetY,
              end: offsetY + region.lines.length,
              data: serializer.serialize(region.lines) as unknown as Uint8Array,
            },
          ],
          totalLength: region.lines.length,
        };
      }

      updates.push(update);
    }

    return updates;
  }

  private async _render() {
    if (clearDebugLogPerFrame) {
      clearDebugLog();
    }

    const rootRegion = this.sceneManager.getRootRegion();
    if (!rootRegion) {
      return;
    }

    if (rootRegion.width === 0) {
      rootRegion.width = this.columns;
    }

    if (rootRegion.height === 0) {
      rootRegion.height = this.rows;
    }

    this.forceNextRender = false;

    if (this.debugRainbowEnabled) {
      this.frameIndex++;
      this.terminalWriter.debugRainbowColor = rainbowColors[this.frameIndex % rainbowColors.length];
    }

    const cameraY = this.getCameraY(rootRegion);
    this.syncCursor(cameraY);

    const scrolledToBackbuffer = new Map<string | number, number>();

    if (!this.terminalWriter.isFirstRender) {
      // 0. Handle Global Scroll (Backbuffer growth)
      const maxPushed = this.scrollOptimizer.maxRegionScrollTops.get(rootRegion.id) ?? 0;
      const linesToScroll = cameraY - maxPushed;

      if (linesToScroll > 0) {
        if (debugWorker) {
          debugLog(`[RENDER-WORKER] Root region ${rootRegion.id} pushing ${linesToScroll} lines to backbuffer (cameraY: ${cameraY}, maxPushed: ${maxPushed})`);
        }

        scrolledToBackbuffer.set(rootRegion.id, linesToScroll);
        this.appendToBackbuffer(maxPushed, linesToScroll);
        this.scrollOptimizer.updateMaxPushed(rootRegion.id, cameraY);
      }

      // 0.5 Handle Local Region Scrolls
      const compositor = this.createCompositor({
        skipStickyHeaders: true,
        skipScrollbars: false,
      });

      this.processRegionForScroll(this.sceneManager.root!, 0, -cameraY, cameraY, scrolledToBackbuffer, compositor);
    }

    // 2. Compose Frame
    if (this.terminalWriter.isFirstRender) {
      for (const region of this.sceneManager.regions.values()) {
        if (region.overflowToBackbuffer) {
          this.scrollOptimizer.updateMaxPushed(region.id, region.scrollTop ?? 0);
        }
      }

      if (rootRegion.overflowToBackbuffer) {
        this.scrollOptimizer.updateMaxPushed(rootRegion.id, cameraY);
      }
    }

    this.composeScene(this.terminalWriter.isFirstRender);

    if (this.terminalWriter.isFirstRender) {
      this.terminalWriter.writeLines([...this.backbuffer, ...this.screen]);
    } else {
      // 3. Sync
      for (let row = 0; row < this.rows; row++) {
        this.terminalWriter.syncLine(this.screen[row]!, row);
      }
    }

    this.terminalWriter.finish();
    this.terminalWriter.flush();

    if (!this.isAlternateBufferEnabled) {
      const maxPushedRoot = this.scrollOptimizer.maxRegionScrollTops.get(rootRegion.id) ?? 0;
      if (cameraY < maxPushedRoot) {
        this.terminalWriter.backbufferDirtyCurrentFrame = true;
      }

      for (const region of this.sceneManager.regions.values()) {
        if (region.overflowToBackbuffer) {
          const maxPushed = this.scrollOptimizer.maxRegionScrollTops.get(region.id) ?? 0;
          if ((region.scrollTop ?? 0) < maxPushed) {
            this.terminalWriter.backbufferDirtyCurrentFrame = true;
          }
        }
      }
    }

    this.updateTrackingMaps(rootRegion, cameraY);

    if (this.terminalWriter.backbufferDirtyCurrentFrame) {
      this.terminalWriter.backbufferDirty = true;

      if (this.terminalWriter.fullRenderTimeout) {
        clearTimeout(this.terminalWriter.fullRenderTimeout);
      }

      this.terminalWriter.fullRenderTimeout = setTimeout(() => {
        void this.fullRender();
      }, this.backbufferUpdateDelay);
    }

    this.terminalWriter.backbufferDirtyCurrentFrame = false;

    this.logScene(scrolledToBackbuffer);
  }

  private tickAnimation() {
    const { hasScrolled, canScrollMore } = this.animationController.updateRegions(this.sceneManager.regions);

    if (hasScrolled) {
      void this.render();
    }

    if (!canScrollMore) {
      if (debugWorker) {
        debugLog(`[RENDER-WORKER] Stopping animation: all targets reached\n`);
      }

      this.animationController.stop();
    }
  }

  private composeScene(computeBackbuffer: boolean) {
    const rootRegion = this.sceneManager.getRootRegion();
    if (!rootRegion) {
      return;
    }

    const cameraY = this.getCameraY(rootRegion);
    this.backbuffer = [];

    if (!this.isAlternateBufferEnabled && computeBackbuffer) {
      const rootBackbufferHeight = cameraY;
      this.composeToBackbuffer(this.sceneManager.root!, rootRegion, rootBackbufferHeight, 0);

      for (const region of this.sceneManager.regions.values()) {
        if (region.overflowToBackbuffer && region.isScrollable) {
          const scrollTop = region.scrollTop ?? 0;
          const regionBackbufferHeight = scrollTop;
          const node = this.findNodeForRegion(region.id);
          if (node) {
            this.composeToBackbuffer(node, region, regionBackbufferHeight, 0);
          }
        }
      }
    }

    const canvas = Canvas.create(this.columns, this.rows, this.resized);
    this.composeNode(this.sceneManager.root!, canvas, {
      clip: undefined,
      offsetY: -cameraY,
    });
    this.screen = canvas.getLines();
    this.resized = false;
  }

  private composeToBackbuffer(node: RegionNode, region: Region, height: number, offset: number) {
    const canvas = Canvas.create(this.columns, height);
    const originalScrollTop = region.scrollTop;
    region.scrollTop = offset;
    try {
      this.composeNode(
        node,
        canvas,
        {
          clip: undefined,
          offsetY: -region.y,
          offsetX: 0,
          overrideHeight: height,
          isExpanded: true,
        },
        {
          skipStickyHeaders: true,
          skipScrollbars: true,
        }
      );
    } finally {
      region.scrollTop = originalScrollTop;
    }

    for (const line of canvas.getLines()) {
      this.backbuffer.push(this.terminalWriter.clampLine(line.styledChars, this.columns));
    }
  }

  /**
   * Recursively composites a region and its children onto the provided canvas.
   *
   * @param node The hierarchical node to compose.
   * @param canvas The target canvas to draw upon.
   * @param layout Layout and clipping options for the current composition pass.
   * @param layout.clip Optional bounding box to clip rendering.
   * @param layout.offsetY The cumulative Y offset (used for scrolling/camera adjustments).
   * @param layout.offsetX The cumulative X offset (used for scrolling/camera adjustments).
   * @param layout.overrideHeight Optional height to force for the current region, typically used when composing to the backbuffer to capture content that has scrolled out of view.
   * @param layout.isExpanded If true, forces the region to render at its full scroll height rather than its constrained layout height. When composing the backbuffer, this flag is passed down to the specific scrollable descendant that has `overflowToBackbuffer` enabled (typically only one such region should exist), allowing its complete content to be captured instead of just the visible viewport.
   * @param options Additional composition flags.
   * @param options.skipStickyHeaders If true, sticky headers will not be drawn.
   * @param options.skipScrollbars If true, scrollbars will not be drawn.
   */
  private composeNode(
    node: RegionNode,
    canvas: Canvas,
    {
      clip,
      offsetY = 0,
      offsetX = 0,
      overrideHeight,
      isExpanded = false,
    }: {
      clip?: { x: number; y: number; w: number; h: number };
      offsetY?: number;
      offsetX?: number;
      overrideHeight?: number;
      isExpanded?: boolean;
    },
    options?: { skipStickyHeaders?: boolean; skipScrollbars?: boolean }
  ) {
    const region = this.sceneManager.getRegion(node.id);
    if (!region) return;

    const absX = Math.round(region.x + offsetX);
    const absY = Math.round(region.y + offsetY);

    const inExpandedContext = isExpanded || overrideHeight !== undefined;
    const height = overrideHeight ?? (inExpandedContext && region.isScrollable ? (region.scrollHeight ?? 0) : (region.height ?? 0));

    if (absY >= canvas.height && !this.stickyHeadersInBackbuffer) return;
    if (absY + height < 0 && !this.stickyHeadersInBackbuffer) return;

    let myClip = {
      x: absX,
      y: absY,
      w: Math.round(region.width) - (region.marginRight ?? 0),
      h: Math.round(height) - (region.marginBottom ?? 0),
    };
    if (clip) {
      const x1 = Math.max(myClip.x, clip.x);
      const y1 = Math.max(myClip.y, clip.y);
      const x2 = Math.min(myClip.x + myClip.w, clip.x + clip.w);
      const y2 = Math.min(myClip.y + myClip.h, clip.y + clip.h);
      if (x2 <= x1 || y2 <= y1) return;
      myClip = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
    }

    const originalScrollTop = region.scrollTop;
    if (inExpandedContext && region.isScrollable && overrideHeight === undefined) {
      region.scrollTop = 0;
    }

    try {
      const compositor = this.createCompositor(options);
      compositor.drawContent(canvas, region, absX, absY, myClip);

      for (const child of node.children) {
        const childRegion = this.sceneManager.getRegion(child.id);

        let childOptions = options;
        if (options && childRegion && childRegion.isScrollable && !childRegion.overflowToBackbuffer) {
          childOptions = {
            ...options,
            skipStickyHeaders: false,
          };
        }

        this.composeNode(
          child,
          canvas,
          {
            clip: myClip,
            offsetY: absY - (region.scrollTop ?? 0),
            offsetX: absX - (region.scrollLeft ?? 0),
            isExpanded: inExpandedContext && Boolean(childRegion?.overflowToBackbuffer),
          },
          childOptions
        );
      }

      compositor.drawStickyHeaders(canvas, region, absX, absY, myClip);
      compositor.drawScrollbars(canvas, region, absX, absY, myClip);
    } finally {
      if (inExpandedContext && region.isScrollable && overrideHeight === undefined) {
        region.scrollTop = originalScrollTop;
      }
    }
  }

  private createCompositor(options?: { skipStickyHeaders?: boolean; skipScrollbars?: boolean }): Compositor {
    return new Compositor({
      skipStickyHeaders: options?.skipStickyHeaders,
      skipScrollbars: options?.skipScrollbars,
      stickyHeadersInBackbuffer: this.stickyHeadersInBackbuffer,
      animatedScroll: this.animatedScroll,
      targetScrollTops: this.animationController.allTargetScrollTops,
      regionWasAtEnd: this.sceneManager.regionWasAtEnd,
      canvasHeight: this.rows,
    });
  }

  private getCameraY(rootRegion: Region): number {
    return Math.max(0, rootRegion.height - this.rows);
  }

  private syncCursor(cameraY: number) {
    let cursorRow = -1;
    let cursorCol = -1;

    if (this.cursorPosition) {
      const row = this.cursorPosition.row - cameraY;
      if (row >= 0 && row < this.rows) {
        cursorRow = row;
        cursorCol = this.cursorPosition.col;
      }
    }

    this.terminalWriter.setTargetCursorPosition(cursorRow, cursorCol);
  }

  private appendToBackbuffer(start: number, count: number) {
    const rootNode = this.sceneManager.root;
    if (!rootNode) return;

    const canvas = Canvas.create(this.columns, count);
    this.composeNode(
      rootNode,
      canvas,
      { clip: undefined, offsetY: -start },
      {
        skipStickyHeaders: true,
        skipScrollbars: true,
      }
    );

    const linesScrollingOut = canvas.getLines().map((line) => this.terminalWriter.clampLine(line.styledChars, this.columns));

    this.terminalWriter.appendLinesBackbuffer(linesScrollingOut);
  }

  private updateTrackingMaps(rootRegion: Region | undefined, cameraY: number, reset = false) {
    if (rootRegion) {
      if (reset) {
        this.scrollOptimizer.setMaxPushed(rootRegion.id, cameraY);
      } else {
        this.scrollOptimizer.updateMaxPushed(rootRegion.id, cameraY);
      }
    }

    for (const region of this.sceneManager.regions.values()) {
      if (region.isScrollable) {
        this.scrollOptimizer.lastRegionScrollTops.set(region.id, region.scrollTop ?? 0);

        if (region.overflowToBackbuffer) {
          if (reset) {
            this.scrollOptimizer.setMaxPushed(region.id, region.scrollTop ?? 0);
          } else {
            this.scrollOptimizer.updateMaxPushed(region.id, region.scrollTop ?? 0);
          }
        }
      }
    }
  }

  private findNodeForRegion(id: string | number): RegionNode | undefined {
    if (!this.sceneManager.root) return undefined;

    const visit = (node: RegionNode): RegionNode | undefined => {
      if (node.id === id) return node;
      for (const child of node.children) {
        const found = visit(child);
        if (found) return found;
      }

      return undefined;
    };

    return visit(this.sceneManager.root);
  }

  private processRegionForScroll(
    node: RegionNode,
    offsetX: number,
    offsetY: number,
    cameraY: number,
    scrolledToBackbuffer: Map<string | number, number>,
    compositor: Compositor
  ) {
    const region = this.sceneManager.getRegion(node.id);
    if (!region) return;

    const exactAbsX = region.x + offsetX;
    const exactAbsY = region.y + offsetY;
    const absY = Math.round(exactAbsY);

    const operations = this.scrollOptimizer.calculateScrollOperations(
      region,
      this.rows,
      this.columns,
      absY,
      (scrollStart, count, start, end, scrollToBackbuffer) => {
        const originalScrollTop = region.scrollTop;
        region.scrollTop = scrollStart;
        try {
          const getLines = (skipScrollbars: boolean) => {
            const canvas = Canvas.create(this.columns, this.rows + count);
            this.composeNode(
              this.sceneManager.root!,
              canvas,
              {
                clip: undefined,
                offsetY: -cameraY,
              },
              { skipStickyHeaders: true, skipScrollbars }
            );

            const lines = canvas.getLines();
            return start === 0 && end + count === lines.length ? lines : lines.slice(start, end + count);
          };

          if (scrollToBackbuffer && count > 0 && start === 0) {
            const dirtyLines = getLines(false);
            const cleanLines = getLines(true);
            // First 'count' lines are clean (for backbuffer), the rest are dirty (for viewport)
            return [...cleanLines.slice(0, count), ...dirtyLines.slice(count)];
          }

          return getLines(false);
        } finally {
          region.scrollTop = originalScrollTop;
        }
      },
      (r, s, a) => compositor.calculateActualStuckTopHeight(r, s, a),
      (r, s, a) => compositor.calculateActualStuckBottomHeight(r, s, a),
      this.stickyHeadersInBackbuffer
    );

    for (const op of operations) {
      if (op.scrollToBackbuffer) {
        if (debugWorker) {
          debugLog(`[RENDER-WORKER] Region ${op.regionId} scrolling ${op.linesToScroll} lines to backbuffer`);
        }

        scrolledToBackbuffer.set(op.regionId, (scrolledToBackbuffer.get(op.regionId) ?? 0) + op.linesToScroll);
      }

      this.terminalWriter.scrollLines(op);
      if (op.newMaxPushed !== undefined) {
        this.scrollOptimizer.updateMaxPushed(op.regionId, op.newMaxPushed);
      }
    }

    for (const child of node.children) {
      this.processRegionForScroll(child, exactAbsX - (region.scrollLeft ?? 0), exactAbsY - (region.scrollTop ?? 0), cameraY, scrolledToBackbuffer, compositor);
    }
  }

  private logScene(scrolledToBackbuffer?: Map<string | number, number>) {
    if (!debugWorker) {
      return;
    }

    const rootNode = this.sceneManager.root;
    if (!rootNode) {
      return;
    }

    const rootRegion = this.sceneManager.getRootRegion();
    const cameraY = rootRegion ? this.getCameraY(rootRegion) : 0;

    debugLog("=".repeat(80));
    debugLog(`FRAME START (Index: ${this.frameIndex})`);
    debugLog("=".repeat(80));

    const traverse = (node: RegionNode, depth: number, offsetX: number, offsetY: number, clip: { x: number; y: number; w: number; h: number }) => {
      const region = this.sceneManager.getRegion(node.id);
      if (!region) {
        return;
      }

      const absX = Math.round(region.x + offsetX);
      const absY = Math.round(region.y + offsetY);
      const width = Math.round(region.width);
      const height = Math.round(region.height);

      let myClip = {
        x: absX,
        y: absY,
        w: width,
        h: height,
      };

      if (clip) {
        const x1 = Math.max(myClip.x, clip.x);
        const y1 = Math.max(myClip.y, clip.y);
        const x2 = Math.min(myClip.x + myClip.w, clip.x + clip.w);
        const y2 = Math.min(myClip.y + myClip.h, clip.y + clip.h);

        myClip = x2 > x1 && y2 > y1 ? { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } : { x: 0, y: 0, w: 0, h: 0 };
      }

      const indent = "  ".repeat(depth);
      const isStatic = region.node?.nodeName === "ink-static-render";

      debugLog(`${indent}Region: ${region.id} ${isStatic ? "(STATIC)" : ""}`);
      debugLog(`${indent}  Bounds: x=${absX}, y=${absY}, w=${width}, h=${height}`);
      debugLog(
        `${indent}  Scroll: top=${region.scrollTop ?? 0}, left=${region.scrollLeft ?? 0}, height=${region.scrollHeight ?? 0}, width=${region.scrollWidth ?? 0}`
      );

      const linesPushed = this.scrollOptimizer.maxRegionScrollTops.get(region.id) ?? 0;
      const justScrolled = scrolledToBackbuffer?.get(region.id) ?? 0;
      debugLog(
        `${indent}  Backbuffer: enabled=${region.overflowToBackbuffer ?? false}, linesPushed=${linesPushed}${justScrolled > 0 ? `, JUST_SCROLLED=${justScrolled}` : ""}`
      );

      debugLog(`${indent}  Clip: x=${myClip.x}, y=${myClip.y}, w=${myClip.w}, h=${myClip.h}`);

      if (region.lines.length > 0) {
        debugLog(`${indent}  Content:`);
        for (const line of region.lines) {
          const plainText = line.getText().trimEnd();
          if (plainText) {
            debugLog(`${indent}    ${plainText}`);
          }
        }
      }

      if (region.stickyHeaders.length > 0) {
        debugLog(`${indent}  Sticky Headers:`);
        for (const header of region.stickyHeaders) {
          const scrollTop = region.scrollTop ?? 0;
          const isStuckState =
            header.type === "bottom"
              ? Math.round(header.naturalRow - scrollTop + header.lines.length) >= Math.round(header.y + (header.stuckLines ?? header.lines).length)
              : Math.round(header.naturalRow - scrollTop) <= Math.round(header.y);

          let isStuck = isStuckState;
          if (isStuck && header.type === "top") {
            isStuck = this.stickyHeadersInBackbuffer || absY > 0;
          }

          debugLog(`${indent}    Header nodeID: ${header.nodeId}, type: ${header.type}, isStuckOnly: ${header.isStuckOnly}, IS_STUCK: ${isStuck}`);
          debugLog(`${indent}    Range: ${header.startRow}-${header.endRow}, StuckPos: y=${header.y}, NaturalRow: ${header.naturalRow}`);

          const linesToLog = isStuck ? (header.stuckLines ?? header.lines) : header.lines;
          debugLog(`${indent}    Header Content (${isStuck ? "STUCK" : "NATURAL"}):`);
          for (const line of linesToLog) {
            const plainText = line.getText().trimEnd();
            if (plainText) {
              debugLog(`${indent}      ${plainText}`);
            }
          }
        }
      }

      for (const child of node.children) {
        traverse(child, depth + 1, absX - (region.scrollLeft ?? 0), absY - (region.scrollTop ?? 0), myClip);
      }
    };

    traverse(rootNode, 0, 0, -cameraY, {
      x: 0,
      y: 0,
      w: this.columns,
      h: this.rows,
    });

    debugLog("=".repeat(80));
    debugLog("FRAME END");
    debugLog("=".repeat(80));
  }
}
