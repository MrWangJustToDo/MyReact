import { useCallback, useEffect, useState, useMemo, lazy, Suspense } from "@my-react/react";
import { useMainThreadRef, runOnMainThread } from "@my-react/react-lynx";

import { Bar } from "./Bar";

import "./App.css";

const LazyComponent = lazy(() => import("./LazyCom.js"));

export const App = () => {
  const [count, setCount] = useState(0);
  const [tone, setTone] = useState<"sea" | "sun">("sea");
  const [mtMessage, setMtMessage] = useState("Waiting...");

  const cardRef = useMainThreadRef<any>(null);

  const onTap = useCallback(() => {
    console.log("[Background Thread] onTap called");
    setCount((prev) => prev + 1);
    setTone((prev) => (prev === "sea" ? "sun" : "sea"));
  }, []);

  const onMainThreadTap = useMemo(
    () =>
      function () {
        "main thread";
        console.log("[Main Thread] onMainThreadTap executed!");
        return "Hello from Main Thread!";
      },
    []
  );

  const triggerMainThread = useCallback(async () => {
    console.log("[Background Thread] Calling runOnMainThread...");
    const result = await runOnMainThread(onMainThreadTap)();
    console.log("[Background Thread] Got result:", result);
    setMtMessage(result);
  }, [onMainThreadTap]);

  const animateCard = useCallback(async () => {
    const animate = runOnMainThread((ref: typeof cardRef) => {
      "main thread";
      const el = ref.current;
      if (el) {
        console.log("[Main Thread] Animating element:", el);
        el.setStyleProperty?.("opacity", "0.5");
        setTimeout(() => {
          el.setStyleProperty?.("opacity", "1");
        }, 300);
      }
      return "Animation done!";
    });

    const result = await animate(cardRef);
    setMtMessage(result);
  }, [cardRef]);

  useEffect(() => {
    console.log("[Background Thread] App mounted");
  }, []);

  return (
    <scroll-view className={`Scene Scene--${tone}`} style={{ height: "100%" }} scroll-orientation="vertical">
      {/* Header */}
      <view className="Header">
        <view className="Logo">
          <text className="LogoText">M</text>
        </view>
        <text className="Title">MyReact Lynx</text>
        <text className="Subtitle">Dual-Thread Architecture Demo</text>
      </view>

      {/* Counter Section */}
      <view className="Section">
        <text className="SectionTitle">Interactive Counter</text>
        <view className="Card" main-thread:ref={cardRef} bindtap={onTap}>
          <text className="Counter">{count}</text>
          <text className="Label">Background Thread State</text>
          <text className="TapHint">Tap to increment & toggle theme</text>
        </view>
      </view>

      {/* Features Section */}
      <view className="Section" style={{ margin: "10px" }}>
        <text className="SectionTitle">Features</text>

        {/* Lazy Component */}
        <Suspense
          fallback={
            <view className="Loading">
              <text className="LoadingText">Loading lazy component...</text>
            </view>
          }
        >
          <LazyComponent />
        </Suspense>

        {/* Bar Component */}
        <Bar />
      </view>

      {/* Main Thread Actions */}
      <view className="Section">
        <text className="SectionTitle">Main Thread Actions</text>
        <view className="ButtonGroup">
          <view className="Button" bindtap={triggerMainThread}>
            <text className="ButtonIcon">⚡</text>
            <text className="ButtonText">Run Worklet</text>
          </view>
          <view className="Button Button--secondary" bindtap={animateCard}>
            <text className="ButtonIcon">✨</text>
            <text className="ButtonText">Animate Card</text>
          </view>
        </view>
      </view>

      {/* Response Card */}
      <view className="InfoCard">
        <view className="InfoIcon">
          <text className="InfoIconText">✓</text>
        </view>
        <view className="InfoContent">
          <text className="InfoTitle">Main Thread Response</text>
          <text className="InfoValue">{mtMessage}</text>
        </view>
      </view>

      {/* Footer */}
      <view className="Footer">
        <view className="FooterRow">
          <view className="FooterDot FooterDot--bg" />
          <text className="FooterText">Background: React reconciler & app logic</text>
        </view>
        <view className="FooterRow">
          <view className="FooterDot FooterDot--main" />
          <text className="FooterText">Main Thread: Native PAPI & worklets</text>
        </view>
      </view>
    </scroll-view>
  );
};
