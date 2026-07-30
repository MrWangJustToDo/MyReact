import type { ReactNode } from "react";

import "./DemoShell.css";

interface DemoShellProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: ReactNode;
}

/** Shared chrome for feature demo pages (back + title). */
export function DemoShell({ title, subtitle, onBack, children }: DemoShellProps) {
  return (
    <scroll-view className="DemoShell" style={{ height: "100%" }} scroll-orientation="vertical">
      <view className="DemoTopBar">
        {onBack ? (
          <view className="DemoBack" bindtap={onBack}>
            <text className="DemoBackText">← Back</text>
          </view>
        ) : null}
        <view className="DemoHeader">
          <text className="DemoTitle">{title}</text>
          <text className="DemoSubtitle">{subtitle}</text>
        </view>
      </view>
      {children}
    </scroll-view>
  );
}
