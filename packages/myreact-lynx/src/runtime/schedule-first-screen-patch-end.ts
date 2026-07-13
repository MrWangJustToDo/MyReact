import { __my_react_scheduler__ } from "@my-react/react/type";

import { markFirstScreenPatchComplete } from "./first-screen-patch.js";
import { scheduleFlush } from "./flush.js";

/**
 * Schedule the terminal first-screen patch flush after the initial commit.
 * Uses a microtask so synchronous lazy boundaries in the same commit wave
 * still emit first-screen tagged patches.
 */
export function scheduleFirstScreenPatchEnd(): void {
  __my_react_scheduler__.microTask(() => {
    markFirstScreenPatchComplete();
    scheduleFlush();
  });
}
