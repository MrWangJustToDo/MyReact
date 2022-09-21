import dotenv from "dotenv";

import { start } from "./entry-dev";

dotenv.config();

const startDev = async () => {
  await start();
  await import("./start-app");
};

startDev();
