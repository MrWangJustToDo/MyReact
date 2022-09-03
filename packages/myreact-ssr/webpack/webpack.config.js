const { ClientConfig } = require("./webpack.client.config");
const { ServerConfig } = require("./webpack.server.config");

const isSSR = process.env.SSR && JSON.parse(process.env.SSR);
const isCSR = process.env.CSR && JSON.parse(process.env.CSR);
const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);
const isAnimationRouter = process.env.ANIMATE_ROUTER && JSON.parse(process.env.ANIMATE_ROUTER);
const currentUI = "antd";

exports.config = (isDev) => {
  if (!process.env.CLIENT_ENTRY || !process.env.SERVER_ENTRY) {
    throw new Error("entry is undefined");
  }
  return [
    ClientConfig({ entryPath: process.env.CLIENT_ENTRY, isDev, isSSR, isCSR, isMiddleWareDevelop, isAnimationRouter, currentUI }),
    ServerConfig({ entryPath: process.env.SERVER_ENTRY, isDev, isSSR, isCSR, isMiddleWareDevelop, isAnimationRouter, currentUI }),
  ];
};
