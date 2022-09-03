import { decodeURI, initSession } from "./init";

import type e from "express";

const init = (expressApp: e.Express) => {
  expressApp.use(decodeURI);
  expressApp.use(initSession);
};

export { init };
