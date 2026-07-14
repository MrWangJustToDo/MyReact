import { useMemo, useState } from "@my-react/react";
import { LongPressGesture, PanGesture, TapGesture, runOnBackground, useGesture, useMainThreadRef } from "@my-react/react-lynx";

import "./GestureDemo.css";

interface GestureDemoProps {
  onBack?: () => void;
}

type PanOffset = { x: number; y: number };
type PanDragStart = { pageX: number; pageY: number; x: number; y: number };

export const GestureDemo = ({ onBack }: GestureDemoProps) => {
  const [tapCount, setTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);

  // Persist drag position across pan sessions (must live on MT via MainThreadRef).
  const panOffset = useMainThreadRef<PanOffset>({ x: 0, y: 0 });
  const panDragStart = useMainThreadRef<PanDragStart>({ pageX: 0, pageY: 0, x: 0, y: 0 });
  // Tracks whether this finger session already captured the drag origin.
  // onUpdate can fire without onStart on some hosts; never treat init {0,0} as origin.
  const panDragging = useMainThreadRef(false);

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

  // Capture origin on finger-down. Relying only on onStart leaves start at {0,0}
  // so the first onUpdate treats pageY as an absolute translate → jumps to bottom.
  pan.onBegin((event, stateManager) => {
    "main thread";
    stateManager.active();
    stateManager.interceptGesture(true);
    if (panDragging.current) {
      return;
    }
    const { pageX, pageY } = event.params;
    const offset = panOffset.current;
    panDragStart.current = { pageX, pageY, x: offset.x, y: offset.y };
    panDragging.current = true;
  });
  pan.onStart((event, stateManager) => {
    "main thread";
    stateManager.active();
    stateManager.interceptGesture(true);
    if (panDragging.current) {
      return;
    }
    const { pageX, pageY } = event.params;
    const offset = panOffset.current;
    panDragStart.current = { pageX, pageY, x: offset.x, y: offset.y };
    panDragging.current = true;
  });
  pan.onUpdate((event, stateManager) => {
    "main thread";
    stateManager.active();
    const { pageX, pageY } = event.params;
    // Lazy-init if begin/start never ran — still never use the {0,0} sentinel.
    if (!panDragging.current) {
      const offset = panOffset.current;
      panDragStart.current = { pageX, pageY, x: offset.x, y: offset.y };
      panDragging.current = true;
      return;
    }
    const start = panDragStart.current;
    const nextX = start.x + (pageX - start.pageX);
    const nextY = start.y + (pageY - start.pageY);
    panOffset.current = { x: nextX, y: nextY };
    event.currentTarget.setStyleProperty("transform", `translate(${nextX}px, ${nextY}px)`);
  });
  pan.onEnd((event) => {
    "main thread";
    panDragging.current = false;
    event.currentTarget.setStyleProperty("opacity", "0.92");
    setTimeout(() => {
      event.currentTarget.setStyleProperty("opacity", "1");
    }, 100);
  });
  pan.onTouchesCancel(() => {
    "main thread";
    panDragging.current = false;
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
        Pan uses page deltas + MainThreadRef offset on the main thread (avoids transform feedback flicker). Tap and long-press flash on MT and bump counters via
        runOnBackground.
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
