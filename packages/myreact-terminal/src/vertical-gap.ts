/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the number of newlines to insert based on a vertical gap.
 *
 * If there was preceding content on a previous line, we output a newline for
 * the line break, plus any empty lines corresponding to the gap. If there was
 * no preceding content, we only output newlines for the gap.
 *
 * @param gap The vertical gap in lines.
 * @param hasPriorContent Whether there was content before this gap.
 * @returns The number of newlines to insert.
 */
export const calculateNewlineCount = (gap: number, hasPriorContent: boolean): number => {
  return hasPriorContent ? 1 + gap : gap;
};
