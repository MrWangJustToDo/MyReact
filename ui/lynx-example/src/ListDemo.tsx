import { useMemo, useState } from "@my-react/react";

import "./DemoShell.css";

interface ListDemoProps {
  onBack?: () => void;
}

/**
 * Covers: native &lt;list&gt; / &lt;list-item&gt;, item-key, reuse-identifier.
 *
 * Lynx &lt;list&gt; needs an explicit height (flexGrow alone often collapses to 0).
 * Do not wrap it in an outer scroll-view.
 */
export function ListDemo({ onBack }: ListDemoProps) {
  const [count, setCount] = useState(24);

  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <view className="DemoShell ListDemoRoot" style={{ width: "100%", height: "100%" }}>
      <view className="DemoTopBar">
        {onBack ? (
          <view className="DemoBack" bindtap={onBack}>
            <text className="DemoBackText">← Back</text>
          </view>
        ) : null}
        <view className="DemoHeader">
          <text className="DemoTitle">List</text>
          <text className="DemoSubtitle">{"<list> / <list-item> + item-key"}</text>
        </view>
      </view>

      <text className="DemoHint">Native list owns scrolling. Cell recycle pool is not implemented yet.</text>

      <view className="DemoRow" style={{ flexDirection: "row" }}>
        <view className="DemoButton" bindtap={() => setCount((n) => n + 8)}>
          <text className="DemoButtonText">+8 items</text>
        </view>
        <view className="DemoButton" bindtap={() => setCount(12)}>
          <text className="DemoButtonText">Reset 12</text>
        </view>
      </view>

      <text className="DemoValue">items: {count}</text>

      <list className="ListDemoList" style={{ width: "100%", height: "420px" }} scroll-orientation="vertical" list-type="single">
        {items.map((i) => (
          <list-item
            key={String(i)}
            item-key={`row-${i}`}
            reuse-identifier="demo-row"
            // Helps native list measure cells before componentAtIndex attaches them
            estimated-height-px={64}
          >
            <view className="ListDemoRow" style={{ height: "64px" }}>
              <text className="ListDemoRowText">Row #{i}</text>
              <text className="ListDemoRowMeta">item-key=row-{i}</text>
            </view>
          </list-item>
        ))}
      </list>
    </view>
  );
}
