/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from "chalk";

import type PrettyError from "pretty-error";

const renderErrorObject: { pre: null | PrettyError } = {
  pre: null,
};

if (__SERVER__) {
  const PrettyError = require("pretty-error");
  renderErrorObject.pre = new PrettyError();
}

const side = __CLIENT__ ? "client" : "server";

const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  if (lev === "error") {
    if (side === "server") {
      if (message instanceof Error) {
        console.log(`[${side}]`, renderErrorObject.pre?.render(message));
      } else {
        console.log(`[${side}]`, renderErrorObject.pre?.render(new Error(message)));
      }
    } else {
      console.log(`[client]`, chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(`[${side}]`, chalk.green(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(`[${side}]`, message.toString());
    }
  }
};

export { log };
