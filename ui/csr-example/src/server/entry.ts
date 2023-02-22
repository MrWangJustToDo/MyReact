import { generateRender } from "./render";

import type { Express } from "express";

let handlerRender = generateRender;

const startApp = (app: Express) => {
  app.use((req, res) => {
    handlerRender()(req, res);
  });

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./render.tsx", () => {
      handlerRender = generateRender;
    });
    module.hot.dispose(() => process.exit(0));
  }
};

export { startApp };
