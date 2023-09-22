// const moduleAlias = require("module-alias");
const withNext = require("@my-react/react-refresh-tools/withNext");

// moduleAlias.addAlias({
//   react: "@my-react/react",
//   "react-dom": "@my-react/react-dom",
//   "react-dom/client": "@my-react/react-dom/client",
//   "react-dom/server": "@my-react/react-dom/server",
//   "react-dom/server.node": "@my-react/react-dom/server.node",
//   "react-dom/server.browser": "@my-react/react-dom/server.browser",
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // runtime: "experimental-edge",
  },
};

module.exports = withNext(nextConfig);
