export const NEXTJS_TEMPLATE = {
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
    "/pages/_app.js": {
      code: `import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}`,
    },
    "/pages/index.js": {
      code: `export default function Home({ data }) {
  return (
    <div>
      <h1>Hello {data}</h1>
    </div>
  );
}
  
export function getServerSideProps() {
  return {
    props: { data: "world" },
  }
}
`,
    },
    "/next.config.js": {
      code: `/** @type {import('next').NextConfig} */
const withNext = require("@my-react/react-refresh-tools/withNext");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withNext(nextConfig)
`,
    },
    "/package.json": {
      code: JSON.stringify({
        name: "my-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "NEXT_TELEMETRY_DISABLED=1 next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          next: "12.1.6", // @todo: update to the latest version
          react: "18.2.0",
          "react-dom": "18.2.0",
          "@my-react/react": "0.3.0",
          "@my-react/react-dom": "0.3.0",
          "@my-react/react-refresh": "0.3.0",
          "@my-react/react-refresh-tools": "0.0.9",
          "@next/swc-wasm-nodejs": "12.1.6",
        },
      }),
    },
  },
  main: "/pages/index.js",
  environment: "node",
} as const;
