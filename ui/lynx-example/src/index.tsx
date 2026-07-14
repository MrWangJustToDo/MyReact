import { useState } from "@my-react/react";
import { root } from "@my-react/react-lynx";

import { App } from "./App";
import { GestureDemo } from "./GestureDemo";
import { MotionDemo } from "./MotionDemo";

type Page = "home" | "gesture" | "motion";

const Shell = () => {
  const [page, setPage] = useState<Page>("home");

  if (page === "motion") {
    return <MotionDemo onBack={() => setPage("home")} />;
  }

  if (page === "gesture") {
    return <GestureDemo onBack={() => setPage("home")} />;
  }

  return (
    <App
      onOpenGesture={() => setPage("gesture")}
      onOpenMotion={() => setPage("motion")}
    />
  );
};

root.render(<Shell />);
