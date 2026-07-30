import { useCallback, useState } from "@my-react/react";
import { querySelector, querySelectorAll, runOnMainThread } from "@my-react/react-lynx";

import { DemoShell } from "./DemoShell";

interface CssQueryDemoProps {
  onBack?: () => void;
}

/**
 * Covers: CSS class selectors, CSS variables (plugin enableCSSInlineVariables),
 * querySelector / querySelectorAll helpers.
 */
export function CssQueryDemo({ onBack }: CssQueryDemoProps) {
  const [queryResult, setQueryResult] = useState("not queried");

  const runQuery = useCallback(async () => {
    // Prefer MT query when available (real elements); fall back to exported helpers.
    const result = await runOnMainThread(() => {
      "main thread";
      const one = lynx.querySelector?.(".CssProbe");
      const all = lynx.querySelectorAll?.(".CssProbe");
      return {
        one: one ? "found" : "null",
        all: Array.isArray(all) ? all.length : 0,
      };
    })();
    setQueryResult(`MT querySelector=.CssProbe → ${result.one}; querySelectorAll → ${result.all}`);

    // Also exercise package helpers (may wrap lynx.* depending on thread).
    try {
      querySelector(".CssProbe");
      querySelectorAll(".CssProbe");
    } catch {
      // helpers may be MT-only on some hosts
    }
  }, []);

  return (
    <DemoShell title="CSS & Query" subtitle="selectors / CSS vars / querySelector*" onBack={onBack}>
      <text className="DemoHint">
        Plugin enables enableCSSSelector, enableCSSInheritance, and enableCSSInlineVariables. Query uses main-thread lynx.querySelector when possible.
      </text>

      <view
        className="DemoPanel CssProbe"
        style={{
          // CSS custom properties (inline variables)
          ["--probe-accent" as string]: "#34d399",
          backgroundColor: "rgba(52, 211, 153, 0.12)",
        }}
      >
        <text className="DemoPanelTitle">.CssProbe + --probe-accent</text>
        <text className="CssProbeLabel">Inherited / variable-styled panel</text>
        <view className="CssProbeChild">
          <text className="DemoValue">child (inheritance target)</text>
        </view>
      </view>

      <view className="DemoButton" bindtap={runQuery}>
        <text className="DemoButtonText">Run querySelector</text>
      </view>
      <text className="DemoValue">{queryResult}</text>
    </DemoShell>
  );
}
