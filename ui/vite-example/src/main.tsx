import { MantineProvider } from "@mantine/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { theme } from "./theme.ts";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
