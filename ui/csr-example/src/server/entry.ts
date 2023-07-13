import { generateRender } from "./render";

import type { Express } from "express";

let handlerRender = generateRender;

const startApp = (app: Express) => {
  app.use(async (req, res) => {
    const render = handlerRender();
    await render(req, res);
  });

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./render.tsx", () => {
      handlerRender = generateRender;
    });
    module.hot.dispose(() => process.exit(0));
  }
};

export { startApp };
