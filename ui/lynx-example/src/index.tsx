import { useState } from "@my-react/react";
import { GlobalPropsProvider, InitDataProvider, registerDataProcessors, root } from "@my-react/react-lynx";

import { App, type DemoPage } from "./App";
import { CssQueryDemo } from "./CssQueryDemo";
import { DataDemo } from "./DataDemo";
import { EventsDemo } from "./EventsDemo";
import { GestureDemo } from "./GestureDemo";
import { ListDemo } from "./ListDemo";
import { MotionDemo } from "./MotionDemo";
import { PortalDemo } from "./PortalDemo";

// Must run before root.render — exercises processData / defaultDataProcessor path.
registerDataProcessors({
  defaultDataProcessor: (raw) => {
    const base = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    return {
      ...base,
      __myReactDemo: true,
      __processedAt: "registerDataProcessors",
    };
  },
});

const Shell = () => {
  const [page, setPage] = useState<DemoPage>("home");
  const back = () => setPage("home");

  let body;
  switch (page) {
    case "motion":
      body = <MotionDemo onBack={back} />;
      break;
    case "gesture":
      body = <GestureDemo onBack={back} />;
      break;
    case "events":
      body = <EventsDemo onBack={back} />;
      break;
    case "list":
      body = <ListDemo onBack={back} />;
      break;
    case "data":
      body = <DataDemo onBack={back} />;
      break;
    case "portal":
      body = <PortalDemo onBack={back} />;
      break;
    case "css":
      body = <CssQueryDemo onBack={back} />;
      break;
    default:
      body = <App onOpen={setPage} />;
  }

  return (
    <InitDataProvider>
      <GlobalPropsProvider>{body}</GlobalPropsProvider>
    </InitDataProvider>
  );
};

root.render(<Shell />);
