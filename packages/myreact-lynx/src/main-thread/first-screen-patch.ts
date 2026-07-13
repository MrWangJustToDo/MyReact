/**
 * Main Thread first-screen patch flag.
 *
 * Not ReactLynx snapshot hydration — only indicates that the current ops batch
 * is part of the initial BG→MT mount.
 */

let active = false;

export function isFirstScreenPatch(): boolean {
  return active;
}

export function setFirstScreenPatch(value: boolean): void {
  active = value;
}

/** Reset — for testing only. */
export function resetFirstScreenPatchState(): void {
  active = false;
}
