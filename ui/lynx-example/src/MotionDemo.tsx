import { animate, clamp, mapValue, mix, progress as calcProgress, styleEffect, transformValue, useMotionValueRef } from "@lynx-js/motion";
import { runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";

import type { MainThread } from "@lynx-js/types";

import "./MotionDemo.css";

/**
 * ==============   Configuration   ================
 */
const maxPull = 20;
const maxSquish = 0.92;
const maxStretch = 1.08;

/**
 * iOSSlider-style demo. Slider squash uses styleEffect; indicator fill uses
 * height% because inline `transform`/`scaleY` is unreliable on this iOS host.
 */
export const MotionDemo = function Comp({ onBack }: { onBack: () => void }) {
  const sliderRef = useMainThreadRef<MainThread.Element>(null);
  const progressRef = useMotionValueRef(0.5);
  const sizeRef = useMainThreadRef({ top: 0, bottom: 0 });
  const initialDragYRef = useMainThreadRef(0);
  const initialProgressYRef = useMainThreadRef(0);

  function measureSlider() {
    "main thread";
    void sliderRef.current?.invoke("boundingClientRect").then((res: { top: number; bottom: number }) => {
      sizeRef.current = { top: res.top, bottom: res.bottom };
    });
  }

  function paintIndicatorHeight(p: number) {
    "main thread";
    const nodes = lynx.querySelectorAll(".indicator") as Array<{ setStyleProperty?: (k: string, v: string) => void }>;
    const ind = nodes?.[0];
    if (!ind?.setStyleProperty) {
      return;
    }
    const v = clamp(0, 1, p);
    ind.setStyleProperty("height", `${Math.max(v * 100, 1)}%`);
    ind.setStyleProperty("top", "auto");
    ind.setStyleProperty("bottom", "0px");
  }

  function initEffects() {
    "main thread";
    measureSlider();

    const y = mapValue(progressRef.current, [-1, 0, 1, 2], [maxPull, 0, 0, -maxPull]);
    const scaleX = mapValue(y, [-maxPull, 0, 0, maxPull], [maxSquish, 1, 1, maxSquish]);
    const scaleY = mapValue(y, [-maxPull, 0, 0, maxPull], [maxStretch, 1, 1, maxStretch]);

    styleEffect(".slider", { y, scaleX, scaleY });

    const invertScaleX = transformValue(() => 1 / scaleX.get());
    const invertScaleY = transformValue(() => 1 / scaleY.get());
    styleEffect(".icon-container", {
      scaleX: invertScaleX,
      scaleY: invertScaleY,
    });

    progressRef.current.on?.("change", (p: number) => {
      paintIndicatorHeight(p);
    });
    paintIndicatorHeight(progressRef.current.get());
  }

  useEffect(() => {
    void runOnMainThread(initEffects)();
  }, []);

  function onTouchStart(e: MainThread.TouchEvent) {
    "main thread";
    const size = sizeRef.current;
    if (!size || !(size.bottom > size.top)) {
      measureSlider();
      return;
    }
    progressRef.current.stop();

    initialDragYRef.current = e.detail.y;
    initialProgressYRef.current = mix(size.bottom, size.top, progressRef.current.get());
  }

  function onTouchMove(e: MainThread.TouchEvent) {
    "main thread";
    const size = sizeRef.current;
    if (!size || !(size.bottom > size.top)) {
      return;
    }

    const dragOffset = e.detail.y - initialDragYRef.current;
    const newProgressY = initialProgressYRef.current + dragOffset;

    progressRef.current.set(calcProgress(size.bottom, size.top, newProgressY));
  }

  function onTouchEnd(_e: MainThread.TouchEvent) {
    "main thread";
    if (progressRef.current.get() < 0) {
      animate(progressRef.current, 0, {
        type: "spring",
        stiffness: 200,
        damping: 60,
      });
    } else if (progressRef.current.get() > 1) {
      animate(progressRef.current, 1, {
        type: "spring",
        stiffness: 200,
        damping: 60,
      });
    }
  }

  return (
    <view className="case-container">
      <view className="back-button" bindtap={onBack}>
        <text className="back-button-text">Back</text>
      </view>
      <view
        className="slider"
        main-thread:ref={sliderRef}
        main-thread:bindtouchstart={onTouchStart}
        main-thread:bindtouchmove={onTouchMove}
        main-thread:bindtouchend={onTouchEnd}
      >
        <view className="indicator"></view>
        <view className="icon-container">
          <image className="icon" src="" />
        </view>
      </view>
    </view>
  );
};
