export const VITE_REACT_TEMPLATE = {
  files: {
    "/styles.css": {
      code: `body {
    font-family: sans-serif;
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  h1 {
    font-size: 1.5rem;
  }`,
    },
    "/App.jsx": {
      code: `export default function App() {
  const data = "world"

  return <h1>Hello {data}</h1>
}
`,
    },
    "/index.jsx": {
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    },
    "/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
  </body>
</html>
`,
    },
    "/package.json": {
      code: JSON.stringify({
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "@my-react/react": "0.3.0",
          "@my-react/react-dom": "0.3.0",
        },
        devDependencies: {
          "@my-react/react-refresh": "0.3.0",
          "@my-react/react-vite": "0.0.3",
          "@vitejs/plugin-react": "3.1.0",
          vite: "4.1.4",
          "esbuild-wasm": "0.17.12",
        },
      }),
    },
    "/vite.config.js": {
      code: `import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import react from "@my-react/react-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
`,
    },
  },
  main: "/App.jsx",
  environment: "node",
} as const;