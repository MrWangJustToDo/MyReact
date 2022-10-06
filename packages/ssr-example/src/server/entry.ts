import dotenv from "dotenv";
import express from "express";

import { setApi } from "./api";
import { generateHandler } from "./app";
import { develop } from "./middleware/develop";
import { serverLog } from "./util/serverLog";

let handlerRender = generateHandler;

dotenv.config();

const startApp = async () => {
  const app = express();

  app.use(express.static(`${process.cwd()}/public`));

  app.use(express.static(`${process.cwd()}/dist`));

  setApi(app);

  await develop(app);

  app.use((req, res, next) => {
    handlerRender()(req, res, next);
  });

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./app.ts", () => {
      serverLog("app update", "info");
      handlerRender = generateHandler;
    });
    module.hot.dispose(() => process.exit(0));
  }

  const port = __DEVELOPMENT__ ? process.env.DEV_PORT : process.env.PROD_PORT;

  app.listen(port, () => {
    serverLog(`app is running, open http://localhost:${port}`, "info");
  });
};

startApp();