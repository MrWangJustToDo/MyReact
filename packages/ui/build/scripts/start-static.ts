import { spawn } from "child_process";
import dotenv from "dotenv";

import { start } from "./entry-prod";

dotenv.config();

const generate = async () => {
  await start();
  spawn("cross-env STATIC_GENERATE=true node", ["./start-app.js"], { shell: true, stdio: "inherit" });
};

generate();
