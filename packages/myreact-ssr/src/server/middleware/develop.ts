/* eslint-disable @typescript-eslint/no-var-requires */

import type { Express } from "express";

const develop = (app: Express): Promise<void> => {
  return new Promise((resolve) => {
    if (__DEVELOPMENT__ && __MIDDLEWARE__ && process.env.CLIENT_ENTRY) {
      const webpack = require("webpack");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const { compilerPromise } = require("script/compiler");
      const { config } = require("webpackConfig/webpack.config");
      const multiConfig = config(true);
      const [clientConfig] = multiConfig;
      const compiler = webpack(clientConfig);
      const clientPromise = compilerPromise("client", compiler, { dynamicRouter: true, development: true });

      app.use(webpackDevMiddleware(compiler, clientConfig.devServer.devMiddleware));
      app.use(webpackHotMiddleware(compiler));
      return clientPromise.then(resolve).catch(resolve);
    } else {
      resolve();
    }
  });
};

export { develop };
