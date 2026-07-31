import { hydrateRoot } from "react-dom/client";

import { App } from "./App";
import "./index.css";

hydrateRoot(document.getElementById("root")!, <App />);
