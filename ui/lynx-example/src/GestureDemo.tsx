import { useMemo, useState } from "@my-react/react";
import { LongPressGesture, PanGesture, TapGesture, runOnBackground, useGesture } from "@my-react/react-lynx";

import "./GestureDemo.css";

interface GestureDemoProps {
  onBack?: () => void;
}

export const GestureDemo = ({ onBack }: GestureDemoProps) => {
  const [tapCount, setTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);

  const bumpTap = useMemo(
    () =>
      function bumpTap() {
        setTapCount((prev) => prev + 1);
      },
    []
  );

  const bumpLongPress = useMemo(
    () =>
      function bumpLongPress() {
        setLongPressCount((prev) => prev + 1);
      },
    []
  );

  const pan = useGesture(PanGesture);
  pan.minDistance(4);
  pan.onUpdate((event) => {
    "main thread";
    const { x, y } = event.params;
    event.currentTarget.setStyleProperty("transform", `translate(${x}px, ${y}px)`);
  });
  pan.onEnd((event) => {
    "main thread";
    event.currentTarget.setStyleProperty("opacity", "0.92");
    setTimeout(() => {
      event.currentTarget.setStyleProperty("opacity", "1");
    }, 100);
  });

  const tap = useGesture(TapGesture);
  tap.onEnd((event) => {
    "main thread";
    event.currentTarget.setStyleProperty("opacity", "0.55");
    setTimeout(() => {
      event.currentTarget.setStyleProperty("opacity", "1");
    }, 120);
    runOnBackground(bumpTap)();
  });

  const longPress = useGesture(LongPressGesture);
  longPress.minDuration(400);
  longPress.onStart((event) => {
    "main thread";
    event.currentTarget.setStyleProperty("transform", "scale(0.96)");
  });
  longPress.onEnd((event) => {
    "main thread";
    event.currentTarget.setStyleProperty("transform", "scale(1)");
    runOnBackground(bumpLongPress)();
  });

  return (
    <scroll-view className="GestureScene" style={{ height: "100%" }} scroll-orientation="vertical">
      <view className="GestureTopBar">
        {onBack ? (
          <view className="GestureBackButton" bindtap={onBack}>
            <text className="GestureBackText">← Back</text>
          </view>
        ) : null}
        <view className="GestureHeader">
          <text className="GestureTitle">Gesture Test</text>
          <text className="GestureSubtitle">@my-react/react-lynx + @lynx-js/gesture-runtime</text>
        </view>
      </view>

      <text className="GestureHint">
        Pan moves the blue box on the main thread. Tap and long-press flash on MT and bump the counters on the
        background thread through runOnBackground.
      </text>

      <view className="GesturePanel">
        <text className="GesturePanelTitle">Pan Gesture</text>
        <view className="GestureStage">
          <view className="GestureBox GestureBox--pan" main-thread:gesture={pan}>
            <text className="GestureBoxLabel">Drag me</text>
          </view>
        </view>
      </view>

      <view className="GesturePanel">
        <text className="GesturePanelTitle">Tap Gesture</text>
        <view className="GestureBox GestureBox--tap" main-thread:gesture={tap}>
          <text className="GestureBoxLabel">Tap me</text>
        </view>
      </view>

      <view className="GesturePanel">
        <text className="GesturePanelTitle">Long Press Gesture</text>
        <view className="GestureBox GestureBox--longpress" main-thread:gesture={longPress}>
          <text className="GestureBoxLabel">Press and hold</text>
        </view>
      </view>

      <view className="GestureStatus">
        <text className="GestureStatusTitle">Background Counters</text>
        <text className="GestureStatusValue">Tap count: {tapCount}</text>
        <text className="GestureStatusValue">Long press count: {longPressCount}</text>
      </view>
    </scroll-view>
  );
};
