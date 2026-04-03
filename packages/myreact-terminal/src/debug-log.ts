import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const debugLogEnabled = false;
let isFirstRun = true;
const logFilePath = path.join(process.cwd(), "debug.log");
let logStream: fs.WriteStream | undefined;

export const debugLog = (message: string) => {
  if (!debugLogEnabled) {
    return;
  }

  if (isFirstRun) {
    try {
      logStream = fs.createWriteStream(logFilePath, { flags: "w" });
    } catch (error) {
      process.stderr.write(`[debug-log] Failed to start writing to debug file ${logFilePath} in debugLog: ${String(error)}\n`);
    }

    isFirstRun = false;
  }

  if (logStream) {
    try {
      logStream.write(message + "\n");
    } catch (error) {
      process.stderr.write(`[debug-log] Failed to write to debug file ${logFilePath} in debugLog: ${String(error)}\n`);
    }
  }
};

export const clearDebugLog = () => {
  if (!debugLogEnabled) {
    return;
  }

  if (logStream) {
    logStream.end();
  }

  try {
    logStream = fs.createWriteStream(logFilePath, { flags: "w" });
  } catch (error) {
    process.stderr.write(`[debug-log] Failed to start writing to debug file ${logFilePath} in clearDebugLog: ${String(error)}\n`);
  }
};
