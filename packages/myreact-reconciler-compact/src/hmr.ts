import type { ReconcilerDispatch } from "./dispatch";
import type { CustomRenderDispatch } from "@my-react/react-reconciler";

const DEV_REFRESH_FIELD = "__@my-react/react-refresh-inject__";

type RefreshRuntime = (dispatch: CustomRenderDispatch) => void;

export const autoSetDevHMR = (dispatch: ReconcilerDispatch) => {
  if (__DEV__) {
    if (typeof globalThis !== "undefined" && globalThis[DEV_REFRESH_FIELD]) {
      try {
        const typedRuntimeField = globalThis[DEV_REFRESH_FIELD] as RefreshRuntime;

        typedRuntimeField?.(dispatch);
      } catch {
        void 0;
      }
    }
  }
};
