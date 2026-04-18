import { useState, useEffect } from "@my-react/react";

import "./LazyCss.css";

export default function LazyComponent() {
  const [loadTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (typeof performance !== "undefined") {
      const start = performance.now();
      setElapsed(Math.round(start - loadTime + Math.random() * 50));
    }
  }, [loadTime]);

  return (
    <view className="FeatureCard LazyCard">
      <view className="FeatureIcon FeatureIcon--lazy">
        <text className="FeatureIconText">🚀</text>
      </view>
      <view className="FeatureContent">
        <text className="FeatureTitle">Lazy Loaded Component</text>
        <text className="FeatureDesc">Dynamically imported with React.lazy()</text>
      </view>
      <view className="FeatureBadge LazyBadge">
        <text className="FeatureBadgeText LazyBadgeText">{elapsed}ms</text>
      </view>
    </view>
  );
}
