import { useEffect, useRef, useState } from "@my-react/react";
import { createPortal, flushSync } from "@my-react/react-lynx";

import { DemoShell } from "./DemoShell";

interface PortalDemoProps {
  onBack?: () => void;
}

/**
 * Covers: createPortal into a ShadowElement host, flushSync for immediate commit.
 */
export function PortalDemo({ onBack }: PortalDemoProps) {
  // BG host config getPublicInstance returns the ShadowElement instance.
  const hostRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);
  const [syncTicks, setSyncTicks] = useState(0);
  const [portalLabel, setPortalLabel] = useState("portaled child");

  useEffect(() => {
    setReady(true);
  }, []);

  const bumpSync = () => {
    flushSync(() => {
      setSyncTicks((n) => n + 1);
      setPortalLabel(`flushSync #${syncTicks + 1}`);
    });
  };

  return (
    <DemoShell title="Portal & flushSync" subtitle="createPortal → ShadowElement host" onBack={onBack}>
      <text className="DemoHint">
        BG refs expose ShadowElement instances. createPortal mounts children into that host in the shadow tree. flushSync
        forces an immediate ops flush.
      </text>

      <view className="DemoPanel">
        <text className="DemoPanelTitle">Portal host</text>
        <view className="PortalHost" ref={hostRef}>
          <text className="DemoValue">host view (children below via portal)</text>
          {ready && hostRef.current
            ? createPortal(
                <view className="PortalChild">
                  <text className="PortalChildText">{portalLabel}</text>
                </view>,
                hostRef.current as never
              )
            : null}
        </view>
      </view>

      <view className="DemoPanel">
        <text className="DemoPanelTitle">flushSync</text>
        <view className="DemoButton" bindtap={bumpSync}>
          <text className="DemoButtonText">flushSync tick ({syncTicks})</text>
        </view>
      </view>
    </DemoShell>
  );
}
