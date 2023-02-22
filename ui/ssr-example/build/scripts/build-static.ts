import { spawn } from "child_process";
import dotenv from "dotenv";

import { start } from "./entry-prod";

dotenv.config();

const generate = async () => {
  await start('/MyReact/');
  spawn("cross-env STATIC_GENERATE=true node", ["./build/scripts/start-app.js"], { shell: true, stdio: "inherit" });
};

generate();
