import { pino } from "pino";
import pretty from "pino-pretty";

export const serverLog = (msg: string, level: "info" | "warn" | "error") => pino(pretty())[level](`[server] ${msg}`);
