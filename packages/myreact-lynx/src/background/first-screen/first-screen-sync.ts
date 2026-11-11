/**
 * ReactLynx 0.129 API compatibility.
 *
 * Upstream `markFirstScreenSyncReady()` is a no-op unless the build option
 * `firstScreenSyncTiming` is `'manual'`. MyReact does not implement that
 * option: its first screen is sealed by the IFR `renderPage` session and the
 * first-screen patch metadata. Keep the export so applications/libraries that
 * call it still link.
 *
 * @public
 */
export function markFirstScreenSyncReady(): void {
  // Intentionally no-op. See FEATURES.md: firstScreenSyncTiming is unsupported.
}
