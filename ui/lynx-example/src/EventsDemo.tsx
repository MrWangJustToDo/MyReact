import { useCallback, useMemo, useState } from "@my-react/react";
import { runOnBackground, runOnMainThread } from "@my-react/react-lynx";

import { DemoShell } from "./DemoShell";

interface EventsDemoProps {
  onBack?: () => void;
}

/**
 * Covers: bind* / catch* events, main-thread:bind* worklets,
 * runOnMainThread + runOnBackground round-trip.
 */
export function EventsDemo({ onBack }: EventsDemoProps) {
  const [bgTaps, setBgTaps] = useState(0);
  const [caught, setCaught] = useState(0);
  const [mtTaps, setMtTaps] = useState(0);
  const [bridge, setBridge] = useState("idle");

  const bumpMtFromBg = useMemo(
    () =>
      function bumpMtFromBg() {
        setMtTaps((n) => n + 1);
      },
    []
  );

  const onBgTap = useCallback(() => {
    setBgTaps((n) => n + 1);
  }, []);

  const onCatchTap = useCallback(() => {
    setCaught((n) => n + 1);
  }, []);

  const onMtBindTap = useMemo(
    () =>
      function onMtBindTap() {
        "main thread";
        runOnBackground(bumpMtFromBg)();
      },
    [bumpMtFromBg]
  );

  const runBridge = useCallback(async () => {
    setBridge("calling MT…");
    const result = await runOnMainThread(() => {
      "main thread";
      return "mt-ok";
    })();
    setBridge(`BG←MT: ${result}`);
  }, []);

  return (
    <DemoShell title="Events & Worklets" subtitle="bind / catch / main-thread:bind / cross-thread" onBack={onBack}>
      <text className="DemoHint">
        Background handlers use bind/catch. Main-thread:bind runs on LEPUS and can call runOnBackground to update React state.
      </text>

      <view className="DemoPanel">
        <text className="DemoPanelTitle">Background bindtap</text>
        <view className="DemoButton" bindtap={onBgTap}>
          <text className="DemoButtonText">bindtap → BG ({bgTaps})</text>
        </view>
      </view>

      <view className="DemoPanel" catchtap={onCatchTap}>
        <text className="DemoPanelTitle">catchtap (parent)</text>
        <view className="DemoButton" bindtap={onBgTap}>
          <text className="DemoButtonText">Inner bindtap (also bubbles to catch)</text>
        </view>
        <text className="DemoValue">catch count: {caught}</text>
      </view>

      <view className="DemoPanel">
        <text className="DemoPanelTitle">main-thread:bindtap</text>
        <view className="DemoButton" main-thread:bindtap={onMtBindTap}>
          <text className="DemoButtonText">MT bind → runOnBackground ({mtTaps})</text>
        </view>
      </view>

      <view className="DemoPanel">
        <text className="DemoPanelTitle">runOnMainThread bridge</text>
        <view className="DemoButton" bindtap={runBridge}>
          <text className="DemoButtonText">Call MT worklet</text>
        </view>
        <text className="DemoValue">{bridge}</text>
      </view>
    </DemoShell>
  );
}
