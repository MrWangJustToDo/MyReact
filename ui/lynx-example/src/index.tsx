import { useState } from "@my-react/react";
import { root } from "@my-react/react-lynx";

import { App } from "./App";
import { GestureDemo } from "./GestureDemo";

type Page = "home" | "gesture";

const Shell = () => {
  const [page, setPage] = useState<Page>("home");

  if (page === "gesture") {
    return <GestureDemo onBack={() => setPage("home")} />;
  }

  return <App onOpenGesture={() => setPage("gesture")} />;
};

root.render(<Shell />);
