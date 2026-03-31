/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import process from "node:process";

import { TerminalBufferWorker } from "./render-worker.js";

let buffer: TerminalBufferWorker;

const main = () => {
  process.on("message", async (message: any) => {
    switch (message.type) {
      case "init": {
        const columns = (process.stdout.columns || message.columns) as number;
        const rows = (process.stdout.rows || message.rows) as number;
        buffer = new TerminalBufferWorker(columns, rows, {
          debugRainbowEnabled: message.debugRainbowEnabled as boolean,
          isAlternateBufferEnabled: message.isAlternateBufferEnabled as boolean,
          stickyHeadersInBackbuffer: message.stickyHeadersInBackbuffer as boolean,
          animatedScroll: message.animatedScroll as boolean,
          animationInterval: message.animationInterval as number,
          backbufferUpdateDelay: message.backbufferUpdateDelay as number,
          maxScrollbackLength: message.maxScrollbackLength as number,
          forceScrollToBottomOnBackbufferRefresh: message.forceScrollToBottomOnBackbufferRefresh as boolean,
        });
        break;
      }

      case "updateOptions": {
        if (buffer) {
          buffer.updateOptions(message.options);
        }

        break;
      }

      case "edits": {
        if (buffer) {
          buffer.update(message.tree, message.updates, message.cursorPosition);
        }

        break;
      }

      case "fullRender": {
        if (buffer) {
          void buffer.fullRender();
        }

        break;
      }

      case "render": {
        if (buffer) {
          await buffer.render();
          process.send?.({ type: "renderDone" });
        }

        break;
      }

      case "done": {
        if (buffer) {
          buffer.done();
          process.send?.({ type: "doneConfirmed" });
        }

        break;
      }

      case "getLinesUpdated": {
        if (buffer) {
          process.send?.({
            type: "linesUpdated",
            count: buffer.getLinesUpdated(),
          });
        }

        break;
      }

      case "resetLinesUpdated": {
        if (buffer) {
          buffer.resetLinesUpdated();
        }

        break;
      }

      case "clear": {
        if (buffer) {
          buffer.clear();
          process.send?.({ type: "clearDone" });
        }

        break;
      }

      case "resize": {
        if (buffer) {
          buffer.resize(message.columns as number, message.rows as number);
        }

        break;
      }

      case "dumpCurrentFrame": {
        if (buffer) {
          buffer.dumpCurrentFrame(message.filename);
        }

        break;
      }

      case "startRecording": {
        if (buffer) {
          buffer.startRecording(message.filename);
        }

        break;
      }

      case "stopRecording": {
        if (buffer) {
          buffer.stopRecording();
        }

        break;
      }

      case "waitForIdle": {
        if (buffer) {
          await buffer.waitForIdle();
          process.send?.({ type: "idle" });
        }

        break;
      }

      default: {
        break;
      }
    }
  });

  process.stdout.on("resize", () => {
    if (buffer && process.stdout.columns && process.stdout.rows) {
      buffer.resize(process.stdout.columns, process.stdout.rows);
    }
  });
};

if (process.env["INK_WORKER"] === "true") {
  main();
}
