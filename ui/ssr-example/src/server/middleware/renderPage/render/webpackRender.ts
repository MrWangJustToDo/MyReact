import { targetRender as targetCSRRender } from "../native/renderCSR";
import { targetRender as targetP_CSRRender } from "../native/renderP_CSR";
import { targetRender as targetSSRRender } from "../native/renderSSR";
import { targetRender as targetStreamSSRRender } from "../native/renderStreamSSR";

import type { SafeAction } from "../compose";

type Mode = { mode: "SSR" | "CSR" | "P_CSR" | "StreamSSR" };

export const webpackRender =
  ({ mode }: Mode): SafeAction =>
  async (args) => {
    if (mode === "SSR") return await targetSSRRender(args);
    if (mode === "CSR") return await targetCSRRender(args);
    if (mode === "P_CSR") return await targetP_CSRRender(args);
    if (mode === "StreamSSR") return await targetStreamSSRRender(args);
  };
