import { useEffect } from "react";

import { useAppContext } from "../components/App.js";
import { useEffectEvent } from "./use-event.js";

import type { PasteEvent } from "@opentui/core";

/**
 * Subscribe to terminal paste events (bracketed paste).
 *
 * @example
 * usePaste((event) => {
 *   console.log("Pasted:", event.text)
 * })
 */
export const usePaste = (handler: (event: PasteEvent) => void) => {
  const { keyHandler } = useAppContext();
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    keyHandler?.on("paste", stableHandler);
    return () => {
      keyHandler?.off("paste", stableHandler);
    };
  }, [keyHandler]);
};
