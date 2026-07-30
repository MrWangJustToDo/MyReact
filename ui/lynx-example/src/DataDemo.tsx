import { Component, useState } from "@my-react/react";
import {
  InitDataConsumer,
  InitDataProvider,
  useGlobalProps,
  useInitData,
  useInitDataChanged,
  useLynxGlobalEventListener,
  withInitDataInState,
} from "@my-react/react-lynx";

import { DemoShell } from "./DemoShell";

interface DataDemoProps {
  onBack?: () => void;
}

function InitDataPanel() {
  const data = useInitData() as Record<string, unknown>;
  const [changed, setChanged] = useState(0);

  useInitDataChanged(() => {
    setChanged((n) => n + 1);
  });

  const keys = Object.keys(data ?? {});

  return (
    <view className="DemoPanel">
      <text className="DemoPanelTitle">useInitData</text>
      <text className="DemoValue">keys: {keys.length ? keys.join(", ") : "(empty / host default)"}</text>
      <text className="DemoValue">onDataChanged fires: {changed}</text>
    </view>
  );
}

function GlobalPropsPanel() {
  const props = useGlobalProps() as Record<string, unknown>;
  const keys = Object.keys(props ?? {});

  return (
    <view className="DemoPanel">
      <text className="DemoPanelTitle">useGlobalProps</text>
      <text className="DemoValue">keys: {keys.length ? keys.join(", ") : "(empty / host default)"}</text>
    </view>
  );
}

function GlobalEventPanel() {
  const [last, setLast] = useState("none");

  useLynxGlobalEventListener("exposure", (e) => {
    setLast(`exposure: ${JSON.stringify(e)?.slice(0, 80) ?? ""}`);
  });

  return (
    <view className="DemoPanel">
      <text className="DemoPanelTitle">useLynxGlobalEventListener</text>
      <text className="DemoValue">last: {last}</text>
    </view>
  );
}

/** withInitDataInState merges lynx.__initData into component state. */
class InitDataClassInner extends Component<Record<string, never>, Record<string, unknown>> {
  override render() {
    const keys = Object.keys(this.state ?? {});
    return (
      <view className="DemoPanel">
        <text className="DemoPanelTitle">withInitDataInState (class state)</text>
        <text className="DemoValue">state keys from initData: {keys.join(", ") || "(empty)"}</text>
      </view>
    );
  }
}

const InitDataClass = withInitDataInState(InitDataClassInner);

/**
 * Covers: InitData / GlobalProps providers & hooks, data processors (registered in index),
 * useLynxGlobalEventListener, withInitDataInState.
 */
export function DataDemo({ onBack }: DataDemoProps) {
  return (
    <DemoShell title="Data APIs" subtitle="initData / globalProps / processors / events" onBack={onBack}>
      <text className="DemoHint">
        registerDataProcessors runs before root.render (see index.tsx). Values depend on the Lynx host injecting __initData /
        __globalProps.
      </text>

      <InitDataProvider>
        <InitDataPanel />
        <InitDataConsumer>
          {(data) => (
            <view className="DemoPanel">
              <text className="DemoPanelTitle">InitDataConsumer</text>
              <text className="DemoValue">{JSON.stringify(data ?? {}).slice(0, 120)}</text>
            </view>
          )}
        </InitDataConsumer>
        <InitDataClass />
      </InitDataProvider>

      <GlobalPropsPanel />
      <GlobalEventPanel />
    </DemoShell>
  );
}
