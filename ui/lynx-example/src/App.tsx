import { useCallback, useState, useEffect, useMemo, lazy, Suspense } from "@my-react/react";
import { useMainThreadRef, runOnMainThread } from "@my-react/react-lynx";

import { Bar } from "./Bar";

import "./App.css";

const LazyComponent = lazy(() => import("./LazyCom.js"));

export type DemoPage =
  | "home"
  | "gesture"
  | "motion"
  | "events"
  | "list"
  | "data"
  | "portal"
  | "css";

interface AppProps {
  onOpen: (page: Exclude<DemoPage, "home">) => void;
}

const FEATURES: Array<{
  id: Exclude<DemoPage, "home">;
  title: string;
  desc: string;
  icon: string;
}> = [
  { id: "gesture", title: "Gesture", desc: "Pan / tap / long-press + runOnBackground", icon: "👆" },
  { id: "motion", title: "Motion", desc: "@lynx-js/motion slider (worklet allowlist)", icon: "🎞" },
  { id: "events", title: "Events & Worklets", desc: "bind / catch / main-thread:bind / runOnMainThread", icon: "⚡" },
  { id: "list", title: "List", desc: "<list> / <list-item> + item-key", icon: "📋" },
  { id: "data", title: "Data APIs", desc: "initData / globalProps / processors", icon: "📦" },
  { id: "portal", title: "Portal & flushSync", desc: "createPortal + flushSync", icon: "🚪" },
  { id: "css", title: "CSS & Query", desc: "selectors / CSS vars / querySelector", icon: "🎨" },
];

export const App = ({ onOpen }: AppProps) => {
  const [count, setCount] = useState(0);
  const [tone, setTone] = useState<"sea" | "sun">("sea");
  const [mtMessage, setMtMessage] = useState("Waiting...");

  const cardRef = useMainThreadRef<any>(null);

  const onTap = useCallback(() => {
    setCount((prev) => prev + 1);
    setTone((prev) => (prev === "sea" ? "sun" : "sea"));
  }, []);

  const onMainThreadTap = useMemo(
    () =>
      function () {
        "main thread";
        return "Hello from Main Thread!";
      },
    []
  );

  const triggerMainThread = useCallback(async () => {
    const result = await runOnMainThread(onMainThreadTap)();
    setMtMessage(result);
  }, [onMainThreadTap]);

  const animateCard = useCallback(async () => {
    const animate = runOnMainThread((ref: typeof cardRef) => {
      "main thread";
      const el = ref.current;
      if (el) {
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
      <view className="Header">
        <view className="Logo">
          <text className="LogoText">M</text>
        </view>
        <text className="Title">MyReact Lynx</text>
        <text className="Subtitle">Capability demos (see FEATURES.md)</text>
      </view>

      <view className="Section">
        <text className="SectionTitle">Interactive Counter</text>
        <view className="Card" main-thread:ref={cardRef} bindtap={onTap}>
          <text className="Counter">{count}</text>
          <text className="Label">Background Thread State</text>
          <text className="TapHint">Tap to increment & toggle theme</text>
        </view>
      </view>

      <view className="Section" style={{ margin: "10px" }}>
        <text className="SectionTitle">Feature demos</text>

        {FEATURES.map((f) => (
          <view key={f.id} className="FeatureCard" bindtap={() => onOpen(f.id)}>
            <view className="FeatureIcon FeatureIcon--gesture">
              <text className="FeatureIconText">{f.icon}</text>
            </view>
            <view className="FeatureContent">
              <text className="FeatureTitle">{f.title}</text>
              <text className="FeatureDesc">{f.desc}</text>
            </view>
            <view className="FeatureBadge FeatureBadge--gesture">
              <text className="FeatureBadgeText FeatureBadgeText--gesture">OPEN</text>
            </view>
          </view>
        ))}

        <Suspense
          fallback={
            <view className="Loading">
              <text className="LoadingText">Loading lazy component...</text>
            </view>
          }
        >
          <LazyComponent />
        </Suspense>

        <Bar />
      </view>

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

      <view className="InfoCard">
        <view className="InfoIcon">
          <text className="InfoIconText">✓</text>
        </view>
        <view className="InfoContent">
          <text className="InfoTitle">Main Thread Response</text>
          <text className="InfoValue">{mtMessage}</text>
        </view>
      </view>

      <view className="Footer">
        <view className="FooterRow">
          <view className="FooterDot FooterDot--bg" />
          <text className="FooterText">Home also covers: BG state, CSS, Suspense lazy, useMainThreadRef</text>
        </view>
      </view>
    </scroll-view>
  );
};
