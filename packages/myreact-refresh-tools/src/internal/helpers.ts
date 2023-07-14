/**
 * MIT License
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// This file is copied from the Metro JavaScript bundler, with minor tweaks for
// webpack 4 compatibility.
//
// https://github.com/facebook/metro/blob/d6b9685c730d0d63577db40f41369157f28dfa3a/packages/metro/src/lib/polyfills/require.js

import RefreshRuntime from "@my-react/react-refresh/runtime";

type ModuleHotStatus = "idle" | "check" | "prepare" | "ready" | "dispose" | "apply" | "abort" | "fail";

type ModuleHotStatusHandler = (status: ModuleHotStatus) => void;

declare const module: {
  hot: {
    status: () => ModuleHotStatus;
    addStatusHandler: (handler: ModuleHotStatusHandler) => void;
    removeStatusHandler: (handler: ModuleHotStatusHandler) => void;
  };
};

function isSafeExport(key: string): boolean {
  return (
    key === "__esModule" ||
    key === "__N_SSG" ||
    key === "__N_SSP" ||
    // TODO: remove this key from page config instead of allow listing it
    key === "config"
  );
}

function registerExportsForReactRefresh(moduleExports: any, moduleID: string) {
  RefreshRuntime.register(moduleExports, moduleID + " %exports%");
  if (moduleExports == null || typeof moduleExports !== "object") {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }
  for (const key in moduleExports) {
    if (isSafeExport(key)) {
      continue;
    }
    const exportValue = moduleExports[key];
    const typeID = moduleID + " %exports% " + key;
    RefreshRuntime.register(exportValue, typeID);
  }
}

function getRefreshBoundarySignature(moduleExports: any): Array<unknown> {
  const signature = [];
  signature.push(RefreshRuntime.getFamilyByType(moduleExports));
  if (moduleExports == null || typeof moduleExports !== "object") {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return signature;
  }
  for (const key in moduleExports) {
    if (isSafeExport(key)) {
      continue;
    }
    const exportValue = moduleExports[key];
    signature.push(key);
    signature.push(RefreshRuntime.getFamilyByType(exportValue));
  }
  return signature;
}

function isReactRefreshBoundary(moduleExports: any): boolean {
  if (RefreshRuntime.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports == null || typeof moduleExports !== "object") {
    // Exit if we can't iterate over exports.
    return false;
  }
  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (isSafeExport(key)) {
      continue;
    }
    const exportValue = moduleExports[key];
    if (!RefreshRuntime.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  return hasExports && areAllExportsComponents;
}

function shouldInvalidateReactRefreshBoundary(prevExports: unknown, nextExports: unknown): boolean {
  const prevSignature = getRefreshBoundarySignature(prevExports);
  const nextSignature = getRefreshBoundarySignature(nextExports);
  if (prevSignature.length !== nextSignature.length) {
    return true;
  }
  for (let i = 0; i < nextSignature.length; i++) {
    if (prevSignature[i] !== nextSignature[i]) {
      return true;
    }
  }
  return false;
}

let isUpdateScheduled = false;
// This function aggregates updates from multiple modules into a single React Refresh call.
function scheduleUpdate() {
  if (isUpdateScheduled) {
    return;
  }
  isUpdateScheduled = true;

  function canApplyUpdate(status: ModuleHotStatus) {
    return status === "idle";
  }

  function applyUpdate() {
    isUpdateScheduled = false;
    try {
      RefreshRuntime.performReactRefresh();
    } catch (err) {
      console.warn("Warning: Failed to re-render. We will retry on the next Fast Refresh event.\n" + err);
    }
  }

  if (canApplyUpdate(module.hot.status())) {
    // Apply update on the next tick.
    Promise.resolve().then(() => {
      applyUpdate();
    });
    return;
  }

  const statusHandler = (status: any) => {
    if (canApplyUpdate(status)) {
      module.hot.removeStatusHandler(statusHandler);
      applyUpdate();
    }
  };

  // Apply update once the HMR runtime's status is idle.
  module.hot.addStatusHandler(statusHandler);
}

// Needs to be compatible with IE11
export default {
  registerExportsForReactRefresh: registerExportsForReactRefresh,
  isReactRefreshBoundary: isReactRefreshBoundary,
  shouldInvalidateReactRefreshBoundary: shouldInvalidateReactRefreshBoundary,
  getRefreshBoundarySignature: getRefreshBoundarySignature,
  scheduleUpdate: scheduleUpdate,
};
