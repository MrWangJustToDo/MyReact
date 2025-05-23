export const RSPACK_REACT_TEMPLATE = {
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
    "/App.tsx": {
      code: `export default function App() {
  const data = "world"

  return <h1>Hello {data}</h1>
}
`,
    },
    "/index.tsx": {
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
    <title>Rspack App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
    },
    "/package.json": {
      code: JSON.stringify({
        scripts: {
          dev: "rspack serve",
          build: "rspack build",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "@my-react/react": "0.3.9",
          "@my-react/react-dom": "0.3.9",
        },
        devDependencies: {
          "@my-react/react-refresh": "0.3.9",
          "@my-react/react-rspack": "0.0.3",
          "@rspack/cli": "1.3.2",
          "@rspack/core": "1.3.2"
        },
      }),
    },
    "/rspack.config.js": {
      code: `const { rspack } = require('@rspack/core');
const RspackPlugin = require('@my-react/react-rspack');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: { main: './index.tsx' },
  devtool: 'source-map',
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    // always enable module alias for react packages
    new RspackPlugin(),
  ].filter(Boolean),
};

module.exports = config;
`,
    },
  },
  main: "/App.tsx",
  environment: "node",
} as const;
