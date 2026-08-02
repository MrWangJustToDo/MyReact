/**
 * During IFR Main Thread sync mount, `entry.ts` registers `recordAndApply` here
 * so `flush.ts` applies ops locally (no callLepusMethod). BG leaves this null.
 *
 * @see packages/myreact-lynx/IFR.md
 */

type OpsApplier = (ops: unknown[]) => void;

let localApplier: OpsApplier | null = null;

/** @internal */
export function registerLocalOpsApplier(applier: OpsApplier | null): void {
  localApplier = applier;
}

/** @internal */
export function getLocalOpsApplier(): OpsApplier | null {
  return localApplier;
}
