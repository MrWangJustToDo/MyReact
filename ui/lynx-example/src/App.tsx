import { useCallback, useEffect, useState, useMemo } from "@my-react/react";
import { useMainThreadRef, runOnMainThread } from "@my-react/react-lynx";

import { Bar } from "./Bar";

import "./App.css";

export const App = () => {
  const [count, setCount] = useState(0);
  const [tone, setTone] = useState<"sea" | "sun">("sea");
  const [mtMessage, setMtMessage] = useState("(none yet)");

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
    // if (!cardRef.current) {
    //   console.log("[Background Thread] cardRef not ready");
    //   return;
    // }

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
      return "Animation triggered!";
    });

    const result = await animate(cardRef);
    console.log("[Background Thread] Animation result:", result);
  }, [cardRef]);

  useEffect(() => {
    console.log("[Background Thread] App mounted, globalThis:", typeof globalThis);
  }, []);

  return (
    <view className={`Scene Scene--${tone}`}>
      <view className="Header">
        <text className="Title">MyReact Lynx</text>
        <text className="Subtitle">Two-Thread Architecture Demo</text>
      </view>

      <Bar />

      <view className="Card" main-thread-ref={cardRef} bindtap={onTap}>
        <text className="Counter">{count}</text>
        <text className="Label">taps (Background Thread)</text>
      </view>

      <view className="ButtonGroup">
        <view className="Button" bindtap={triggerMainThread}>
          <text className="ButtonText">Run on Main Thread</text>
        </view>
        <view className="Button" bindtap={animateCard}>
          <text className="ButtonText">Animate (Main Thread)</text>
        </view>
      </view>

      <view className="InfoCard">
        <text className="InfoTitle">Main Thread Response:</text>
        <text className="InfoValue">{mtMessage}</text>
      </view>

      <view className="Footer">
        <text className="Hint">Background: React reconciler runs here</text>
        <text className="Hint">Main: Native PAPI operations run here</text>
      </view>
    </view>
  );
};
