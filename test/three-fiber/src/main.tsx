import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { FiberProvider } from "./fiber";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FiberProvider>
      <App />
    </FiberProvider>
  </StrictMode>
);
