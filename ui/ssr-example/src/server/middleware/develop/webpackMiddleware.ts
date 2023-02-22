/* eslint-disable @typescript-eslint/no-var-requires */
import type { Express } from "express";

export const webpackMiddleware = (app: Express) => {
  return new Promise<void>((resolve) => {
    if (__DEVELOPMENT__ && __MIDDLEWARE__ && process.env.CLIENT_ENTRY) {
      const webpack = require("webpack");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const { compilerPromise } = require("@build/scripts/compiler");
      const { definedWebpackConfig } = require("@build/webpack");
      const multiConfig = definedWebpackConfig({
        serverEntry: process.env.SERVER_ENTRY,
        clientEntry: process.env.CLIENT_ENTRY,
      });
      const [clientConfig] = multiConfig;
      const compiler = webpack(clientConfig);
      const clientPromise = compilerPromise("client", compiler, true, true);

      app.use(webpackDevMiddleware(compiler, clientConfig.devServer.devMiddleware));
      app.use(webpackHotMiddleware(compiler));
      return clientPromise.then(resolve).catch(resolve);
    } else {
      resolve();
    }
  });
};
