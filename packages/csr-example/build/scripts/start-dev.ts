import dotenv from "dotenv";
import { resolve } from "path";

import { start } from "./entry-dev";

dotenv.config();

const startDev = async () => {
  await start();
  await import(resolve(process.cwd(), "node", "server.js"));
};

startDev();
