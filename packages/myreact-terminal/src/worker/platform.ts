/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import process from "node:process";

/**
 * Handles platform-specific terminal quirks.
 */
export const platform = {
  /**
   * Terminal.app doesn't respect scroll regions starting at line 0 for scroll
   * escape sequences. We need to use a workaround for this terminal.
   */
  isAppleTerminal(): boolean {
    return process.env["TERM_PROGRAM"] === "Apple_Terminal";
  },
};
