/* eslint-disable @typescript-eslint/no-var-requires */
import type { Express } from "express";

export const webpackMiddleware = (app: Express) => {
  return new Promise<void>((resolve) => {
    if (__DEVELOPMENT__ && __MIDDLEWARE__ && process.env.CLIENT_ENTRY) {
      const webpack = require("webpack");
      const { WebpackDevMiddleware, WebpackHotMiddleware } = require("@site/webpack");
      const { compilerPromise } = require("@build/scripts/compiler");
      const { getConfig } = require("@build/scripts/config");
      const multiConfig = getConfig();
      const [clientConfig] = multiConfig;
      const compiler = webpack(clientConfig);
      const clientPromise = compilerPromise("client", compiler, true, true);

      app.use(WebpackDevMiddleware(compiler, clientConfig.devServer.devMiddleware));
      app.use(WebpackHotMiddleware(compiler));
      return clientPromise.then(resolve).catch(resolve);
    } else {
      resolve();
    }
  });
};
