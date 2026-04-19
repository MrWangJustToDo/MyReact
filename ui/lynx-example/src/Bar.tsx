import { useState, useCallback } from "@my-react/react";

export const Bar = () => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <view className="FeatureCard" bindtap={toggle}>
      <view className="FeatureIcon FeatureIcon--bar">
        <text className="FeatureIconText">📦</text>
      </view>
      <view className="FeatureContent">
        <text className="FeatureTitle">Component Import</text>
        <text className="FeatureDesc">{expanded ? "Standard React component pattern with state management" : "Tap to see more details"}</text>
      </view>
      <view className="FeatureBadge">
        <text className="FeatureBadgeText">{expanded ? "EXPANDED" : "TAP"}</text>
      </view>
    </view>
  );
};
