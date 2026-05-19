#!/usr/bin/env node
/**
 * Postinstall script to fetch MyReact DevTools runtime.
 *
 * Downloads the devtools bundle from CDN and stores it locally.
 * This ensures devtools work in environments without fetch/network access.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEVTOOLS_URL = "https://mrwangjusttodo.github.io/myreact-devtools/bundle/bundle-ws-dev.js";
const OUTPUT_PATH = resolve(__dirname, "../client/dev-runtime.js");

async function fetchDevTools() {
  try {
    const response = await fetch(DEVTOOLS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const code = await response.text();

    const clientDir = dirname(OUTPUT_PATH);
    if (!existsSync(clientDir)) {
      mkdirSync(clientDir, { recursive: true });
    }

    writeFileSync(OUTPUT_PATH, code, "utf-8");
    console.log("[@my-react/react-lynx] DevTools runtime fetched successfully");
  } catch (err) {
    console.warn("[@my-react/react-lynx] Failed to fetch devtools (will use dynamic loading):", err.message);
  }
}

fetchDevTools();
